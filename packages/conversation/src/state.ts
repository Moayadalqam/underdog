// ===========================================
// Conversation State Machine
// ===========================================
// Owner: Stream 2 (AI Role-Play Engine)
//
// State machine for managing conversation flow.

import { v4 as uuidv4 } from 'uuid';
import type {
  ConversationState,
  ConversationPhase,
  ConversationConfig,
  ConversationMessage,
  ConversationEndReason,
  ConversationError,
} from './types';
import {
  createInitialState,
  isConversationActive,
} from './types';
import {
  SimpleEventEmitter,
  createEvent,
  type ConversationEventEmitter,
  type ConversationEvent,
} from './events';
import type { PersonaState, FeedbackItem } from '@underdog/ai-engine';
import { createPersonaState } from '@underdog/ai-engine';

/**
 * Valid state transitions for the conversation state machine.
 */
const VALID_TRANSITIONS: Record<ConversationPhase, ConversationPhase[]> = {
  idle: ['initializing'],
  initializing: ['connecting', 'error'],
  connecting: ['ringing', 'error'],
  ringing: ['prospect_speaking', 'error'],
  prospect_speaking: ['trainee_speaking', 'processing', 'paused', 'ending', 'error'],
  trainee_speaking: ['processing', 'paused', 'ending', 'error'],
  processing: ['prospect_speaking', 'paused', 'ending', 'error'],
  paused: ['prospect_speaking', 'trainee_speaking', 'processing', 'ending', 'error'],
  ending: ['ended', 'error'],
  ended: ['idle'],
  error: ['idle', 'ending'],
};

/**
 * Options for state machine creation.
 */
export interface StateMachineOptions {
  /** Callback for state changes */
  onStateChange?: (state: ConversationState, event: ConversationEvent) => void;
  /** Generate unique IDs (injectable for testing) */
  generateId?: () => string;
}

/**
 * Conversation state machine.
 */
export class ConversationStateMachine {
  private state: ConversationState;
  private readonly emitter: ConversationEventEmitter;
  private readonly generateId: () => string;
  private readonly onStateChange?: (state: ConversationState, event: ConversationEvent) => void;
  private responseTimes: number[] = [];

  constructor(
    sessionId: string,
    config: ConversationConfig,
    options: StateMachineOptions = {}
  ) {
    const personaState = createPersonaState(config.persona);
    this.state = createInitialState(sessionId, config, personaState);
    this.emitter = new SimpleEventEmitter();
    this.generateId = options.generateId ?? uuidv4;
    this.onStateChange = options.onStateChange;
  }

  /**
   * Get current state (immutable).
   */
  getState(): Readonly<ConversationState> {
    return { ...this.state };
  }

  /**
   * Get event emitter for subscribing to events.
   */
  getEmitter(): ConversationEventEmitter {
    return this.emitter;
  }

  /**
   * Start the conversation.
   */
  start(): void {
    this.transition('initializing');
    this.state.startedAt = Date.now();

    const event = createEvent('conversation_started', this.state.sessionId, {
      personaId: this.state.config.persona.id,
      moduleId: this.state.config.moduleId,
    });
    this.emitAndNotify(event);
  }

  /**
   * Mark connection established.
   */
  connected(): void {
    this.transition('connecting');
  }

  /**
   * Start the "ringing" phase.
   */
  startRinging(): void {
    this.transition('ringing');
  }

  /**
   * Prospect begins speaking.
   */
  prospectStartSpeaking(text: string): string {
    const wasTraineeSpeaking = this.state.phase === 'trainee_speaking';
    this.transition('prospect_speaking');

    const messageId = this.generateId();
    const message: ConversationMessage = {
      id: messageId,
      speaker: 'prospect',
      content: text,
      timestamp: Date.now(),
      spoken: false,
    };

    this.state.messages.push(message);

    // Check if this was an interruption
    if (wasTraineeSpeaking) {
      this.state.metrics.interruptionCount++;
    }

    this.emitAndNotify(createEvent('prospect_speaking_started', this.state.sessionId, { text }));

    return messageId;
  }

  /**
   * Prospect finishes speaking.
   */
  prospectStopSpeaking(messageId: string, durationMs: number): void {
    const message = this.state.messages.find((m) => m.id === messageId);
    if (message) {
      message.spoken = true;
      message.audioDurationMs = durationMs;
    }

    this.state.metrics.prospectSpokeDurationMs += durationMs;
    this.state.metrics.turnCount++;

    this.emitAndNotify(createEvent('prospect_speaking_ended', this.state.sessionId, { durationMs }));

    // Transition to waiting for trainee
    if (this.state.phase === 'prospect_speaking') {
      this.transition('trainee_speaking');
    }
  }

  /**
   * Trainee begins speaking.
   */
  traineeStartSpeaking(): void {
    if (this.state.phase !== 'trainee_speaking') {
      this.transition('trainee_speaking');
    }

    this.emitAndNotify(createEvent('trainee_speaking_started', this.state.sessionId, {}));
  }

  /**
   * Trainee finishes speaking.
   */
  traineeStopSpeaking(transcript: string, durationMs: number, confidence: number): string {
    const responseStartTime = Date.now();

    const messageId = this.generateId();
    const message: ConversationMessage = {
      id: messageId,
      speaker: 'trainee',
      content: transcript,
      timestamp: Date.now(),
      audioDurationMs: durationMs,
      spoken: true,
    };

    this.state.messages.push(message);
    this.state.metrics.traineeSpokeDurationMs += durationMs;

    // Track response time
    const lastProspectMessage = [...this.state.messages]
      .reverse()
      .find((m) => m.speaker === 'prospect');
    if (lastProspectMessage) {
      const responseTime = message.timestamp - lastProspectMessage.timestamp;
      this.responseTimes.push(responseTime);
      this.state.metrics.averageResponseTimeMs =
        this.responseTimes.reduce((a, b) => a + b, 0) / this.responseTimes.length;
    }

    this.emitAndNotify(createEvent('trainee_speaking_ended', this.state.sessionId, {
      durationMs,
      transcript,
      confidence,
    }));

    // Transition to processing
    this.transition('processing');

    return messageId;
  }

  /**
   * Update interim transcript during speech.
   */
  updateInterimTranscript(text: string, confidence: number): void {
    this.state.currentTranscript = {
      speaker: 'trainee',
      text,
      startTime: 0,
      endTime: 0,
      confidence,
    };

    this.emitAndNotify(createEvent('interim_transcript', this.state.sessionId, {
      text,
      confidence,
    }));
  }

  /**
   * Update persona state after AI processing.
   */
  updatePersonaState(newState: PersonaState): void {
    const previousMood = this.state.personaState.moodScore;
    const previousTrust = this.state.personaState.trustLevel;

    this.state.personaState = newState;
    this.state.metrics.finalMoodScore = newState.moodScore;
    this.state.metrics.finalTrustLevel = newState.trustLevel;

    // Emit mood change if significant
    if (Math.abs(newState.moodScore - previousMood) >= 5) {
      this.emitAndNotify(createEvent('mood_changed', this.state.sessionId, {
        previousScore: previousMood,
        newScore: newState.moodScore,
        delta: newState.moodScore - previousMood,
      }));
    }

    // Emit trust change if significant
    if (Math.abs(newState.trustLevel - previousTrust) >= 5) {
      this.emitAndNotify(createEvent('trust_changed', this.state.sessionId, {
        previousLevel: previousTrust,
        newLevel: newState.trustLevel,
      }));
    }
  }

  /**
   * Add feedback to the conversation.
   */
  addFeedback(feedback: FeedbackItem[], messageId: string): void {
    this.state.feedback.push(...feedback);

    // Associate feedback with message
    const message = this.state.messages.find((m) => m.id === messageId);
    if (message) {
      message.feedback = feedback;
    }

    this.emitAndNotify(createEvent('feedback_generated', this.state.sessionId, {
      feedback,
      messageId,
    }));
  }

  /**
   * Record an objection being raised.
   */
  recordObjection(objectionId: string, objectionText: string): void {
    this.state.metrics.objectionsRaised++;
    this.state.personaState.raisedObjections.push(objectionId);

    this.emitAndNotify(createEvent('objection_raised', this.state.sessionId, {
      objectionId,
      objectionText,
    }));
  }

  /**
   * Record an objection being handled well.
   */
  recordObjectionHandled(): void {
    this.state.metrics.objectionsHandled++;
  }

  /**
   * Pause the conversation.
   */
  pause(): void {
    if (this.canPause()) {
      this.transition('paused');
      this.emitAndNotify(createEvent('conversation_paused', this.state.sessionId, {}));
    }
  }

  /**
   * Resume the conversation.
   */
  resume(): void {
    if (this.state.phase === 'paused') {
      // Resume to trainee_speaking by default
      this.transition('trainee_speaking');
      this.emitAndNotify(createEvent('conversation_resumed', this.state.sessionId, {}));
    }
  }

  /**
   * Toggle mute.
   */
  toggleMute(): boolean {
    this.state.isMuted = !this.state.isMuted;
    this.emitAndNotify(createEvent('mute_toggled', this.state.sessionId, {
      isMuted: this.state.isMuted,
    }));
    return this.state.isMuted;
  }

  /**
   * End the conversation.
   */
  end(reason: ConversationEndReason): void {
    this.transition('ending');
    this.emitAndNotify(createEvent('conversation_ending', this.state.sessionId, { reason }));

    // Finalize
    this.state.endedAt = Date.now();
    this.state.endReason = reason;
    this.state.metrics.totalDurationMs = this.state.endedAt - this.state.startedAt;

    this.transition('ended');
    this.emitAndNotify(createEvent('conversation_ended', this.state.sessionId, {
      reason,
      metrics: this.state.metrics,
      feedbackCount: this.state.feedback.length,
    }));
  }

  /**
   * Handle an error.
   */
  handleError(error: ConversationError): void {
    this.state.error = error;
    this.transition('error');

    this.emitAndNotify(createEvent('error_occurred', this.state.sessionId, { error }));
  }

  /**
   * Recover from an error.
   */
  recoverFromError(): void {
    if (this.state.phase === 'error' && this.state.error?.recoverable) {
      const previousError = this.state.error;
      this.state.error = undefined;

      // Go back to idle for a fresh start
      this.transition('idle');

      this.emitAndNotify(createEvent('error_recovered', this.state.sessionId, {
        previousError,
      }));
    }
  }

  /**
   * Update audio level for visualization.
   */
  updateAudioLevel(level: number, source: 'trainee' | 'prospect'): void {
    this.emitAndNotify(createEvent('audio_level_changed', this.state.sessionId, {
      level,
      source,
    }));
  }

  /**
   * Check if conversation can be paused.
   */
  canPause(): boolean {
    return ['prospect_speaking', 'trainee_speaking', 'processing'].includes(this.state.phase);
  }

  /**
   * Check if conversation is active.
   */
  isActive(): boolean {
    return isConversationActive(this.state);
  }

  /**
   * Transition to a new phase.
   */
  private transition(newPhase: ConversationPhase): void {
    const validTargets = VALID_TRANSITIONS[this.state.phase];

    if (!validTargets.includes(newPhase)) {
      console.warn(
        `Invalid state transition: ${this.state.phase} -> ${newPhase}. Valid: ${validTargets.join(', ')}`
      );
      return;
    }

    const previousPhase = this.state.phase;
    this.state.phase = newPhase;

    this.emitAndNotify(createEvent('phase_changed', this.state.sessionId, {
      previousPhase,
      newPhase,
    }));
  }

  /**
   * Emit event and notify state change callback.
   */
  private emitAndNotify(event: ConversationEvent): void {
    this.emitter.emit(event as any);
    this.onStateChange?.(this.getState(), event);
  }

  /**
   * Reset to idle state (for reuse).
   */
  reset(): void {
    const personaState = createPersonaState(this.state.config.persona);
    this.state = createInitialState(
      this.generateId(),
      this.state.config,
      personaState
    );
    this.responseTimes = [];
  }
}

/**
 * Create a conversation state machine.
 */
export function createStateMachine(
  config: ConversationConfig,
  options?: StateMachineOptions
): ConversationStateMachine {
  const sessionId = options?.generateId?.() ?? uuidv4();
  return new ConversationStateMachine(sessionId, config, options);
}
