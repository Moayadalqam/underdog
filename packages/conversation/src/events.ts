// ===========================================
// Conversation Events
// ===========================================
// Owner: Stream 2 (AI Role-Play Engine)
//
// Event types for the conversation system.

import type { FeedbackItem } from '@underdog/ai-engine';
import type {
  ConversationPhase,
  ConversationEndReason,
  ConversationError,
  ConversationMessage,
  ConversationMetrics,
} from './types';

/**
 * Base event interface.
 */
export interface BaseEvent {
  /** Event type identifier */
  type: string;
  /** Timestamp when event occurred */
  timestamp: number;
  /** Session ID this event belongs to */
  sessionId: string;
}

/**
 * Conversation started event.
 */
export interface ConversationStartedEvent extends BaseEvent {
  type: 'conversation_started';
  /** Persona ID being simulated */
  personaId: string;
  /** Module ID if applicable */
  moduleId?: string;
}

/**
 * Phase changed event.
 */
export interface PhaseChangedEvent extends BaseEvent {
  type: 'phase_changed';
  /** Previous phase */
  previousPhase: ConversationPhase;
  /** New phase */
  newPhase: ConversationPhase;
}

/**
 * Message received event (from either party).
 */
export interface MessageReceivedEvent extends BaseEvent {
  type: 'message_received';
  /** The message that was received */
  message: ConversationMessage;
}

/**
 * Trainee started speaking event.
 */
export interface TraineeSpeakingStartedEvent extends BaseEvent {
  type: 'trainee_speaking_started';
}

/**
 * Trainee stopped speaking event.
 */
export interface TraineeSpeakingEndedEvent extends BaseEvent {
  type: 'trainee_speaking_ended';
  /** Duration of speech in milliseconds */
  durationMs: number;
  /** Transcribed text */
  transcript: string;
  /** Confidence score */
  confidence: number;
}

/**
 * Prospect started speaking event.
 */
export interface ProspectSpeakingStartedEvent extends BaseEvent {
  type: 'prospect_speaking_started';
  /** Text being spoken */
  text: string;
}

/**
 * Prospect stopped speaking event.
 */
export interface ProspectSpeakingEndedEvent extends BaseEvent {
  type: 'prospect_speaking_ended';
  /** Duration of speech in milliseconds */
  durationMs: number;
}

/**
 * Feedback generated event.
 */
export interface FeedbackGeneratedEvent extends BaseEvent {
  type: 'feedback_generated';
  /** Feedback items */
  feedback: FeedbackItem[];
  /** Related message ID */
  messageId: string;
}

/**
 * Objection raised event.
 */
export interface ObjectionRaisedEvent extends BaseEvent {
  type: 'objection_raised';
  /** Objection ID */
  objectionId: string;
  /** Objection text */
  objectionText: string;
}

/**
 * Mood changed event.
 */
export interface MoodChangedEvent extends BaseEvent {
  type: 'mood_changed';
  /** Previous mood score */
  previousScore: number;
  /** New mood score */
  newScore: number;
  /** Change amount */
  delta: number;
}

/**
 * Trust changed event.
 */
export interface TrustChangedEvent extends BaseEvent {
  type: 'trust_changed';
  /** Previous trust level */
  previousLevel: number;
  /** New trust level */
  newLevel: number;
}

/**
 * Conversation paused event.
 */
export interface ConversationPausedEvent extends BaseEvent {
  type: 'conversation_paused';
}

/**
 * Conversation resumed event.
 */
export interface ConversationResumedEvent extends BaseEvent {
  type: 'conversation_resumed';
}

/**
 * Mute toggled event.
 */
export interface MuteToggledEvent extends BaseEvent {
  type: 'mute_toggled';
  /** Whether microphone is now muted */
  isMuted: boolean;
}

/**
 * Conversation ending event (initiated but not yet complete).
 */
export interface ConversationEndingEvent extends BaseEvent {
  type: 'conversation_ending';
  /** Reason for ending */
  reason: ConversationEndReason;
}

/**
 * Conversation ended event.
 */
export interface ConversationEndedEvent extends BaseEvent {
  type: 'conversation_ended';
  /** Reason for ending */
  reason: ConversationEndReason;
  /** Final metrics */
  metrics: ConversationMetrics;
  /** Total feedback items */
  feedbackCount: number;
}

/**
 * Error occurred event.
 */
export interface ErrorOccurredEvent extends BaseEvent {
  type: 'error_occurred';
  /** Error details */
  error: ConversationError;
}

/**
 * Error recovered event.
 */
export interface ErrorRecoveredEvent extends BaseEvent {
  type: 'error_recovered';
  /** Previous error that was recovered from */
  previousError: ConversationError;
}

/**
 * Audio level changed event (for visualization).
 */
export interface AudioLevelChangedEvent extends BaseEvent {
  type: 'audio_level_changed';
  /** Audio level (0-1) */
  level: number;
  /** Source of audio */
  source: 'trainee' | 'prospect';
}

/**
 * Interim transcript event (during speech).
 */
export interface InterimTranscriptEvent extends BaseEvent {
  type: 'interim_transcript';
  /** Partial transcript text */
  text: string;
  /** Confidence score */
  confidence: number;
}

/**
 * Union of all conversation events.
 */
export type ConversationEvent =
  | ConversationStartedEvent
  | PhaseChangedEvent
  | MessageReceivedEvent
  | TraineeSpeakingStartedEvent
  | TraineeSpeakingEndedEvent
  | ProspectSpeakingStartedEvent
  | ProspectSpeakingEndedEvent
  | FeedbackGeneratedEvent
  | ObjectionRaisedEvent
  | MoodChangedEvent
  | TrustChangedEvent
  | ConversationPausedEvent
  | ConversationResumedEvent
  | MuteToggledEvent
  | ConversationEndingEvent
  | ConversationEndedEvent
  | ErrorOccurredEvent
  | ErrorRecoveredEvent
  | AudioLevelChangedEvent
  | InterimTranscriptEvent;

/**
 * Event listener callback type.
 */
export type ConversationEventListener<T extends ConversationEvent = ConversationEvent> = (
  event: T
) => void;

/**
 * Event type map for type-safe event handlers.
 */
export interface ConversationEventMap {
  conversation_started: ConversationStartedEvent;
  phase_changed: PhaseChangedEvent;
  message_received: MessageReceivedEvent;
  trainee_speaking_started: TraineeSpeakingStartedEvent;
  trainee_speaking_ended: TraineeSpeakingEndedEvent;
  prospect_speaking_started: ProspectSpeakingStartedEvent;
  prospect_speaking_ended: ProspectSpeakingEndedEvent;
  feedback_generated: FeedbackGeneratedEvent;
  objection_raised: ObjectionRaisedEvent;
  mood_changed: MoodChangedEvent;
  trust_changed: TrustChangedEvent;
  conversation_paused: ConversationPausedEvent;
  conversation_resumed: ConversationResumedEvent;
  mute_toggled: MuteToggledEvent;
  conversation_ending: ConversationEndingEvent;
  conversation_ended: ConversationEndedEvent;
  error_occurred: ErrorOccurredEvent;
  error_recovered: ErrorRecoveredEvent;
  audio_level_changed: AudioLevelChangedEvent;
  interim_transcript: InterimTranscriptEvent;
}

/**
 * Type-safe event emitter interface.
 */
export interface ConversationEventEmitter {
  /**
   * Subscribe to a specific event type.
   */
  on<K extends keyof ConversationEventMap>(
    eventType: K,
    listener: ConversationEventListener<ConversationEventMap[K]>
  ): void;

  /**
   * Subscribe to all events.
   */
  onAny(listener: ConversationEventListener): void;

  /**
   * Unsubscribe from a specific event type.
   */
  off<K extends keyof ConversationEventMap>(
    eventType: K,
    listener: ConversationEventListener<ConversationEventMap[K]>
  ): void;

  /**
   * Unsubscribe from all events.
   */
  offAny(listener: ConversationEventListener): void;

  /**
   * Emit an event.
   */
  emit<K extends keyof ConversationEventMap>(event: ConversationEventMap[K]): void;
}

/**
 * Create an event with common fields.
 */
export function createEvent<T extends ConversationEvent['type']>(
  type: T,
  sessionId: string,
  data: Omit<Extract<ConversationEvent, { type: T }>, 'type' | 'timestamp' | 'sessionId'>
): Extract<ConversationEvent, { type: T }> {
  return {
    type,
    timestamp: Date.now(),
    sessionId,
    ...data,
  } as Extract<ConversationEvent, { type: T }>;
}

/**
 * Simple event emitter implementation.
 */
export class SimpleEventEmitter implements ConversationEventEmitter {
  private listeners = new Map<string, Set<ConversationEventListener>>();
  private anyListeners = new Set<ConversationEventListener>();

  on<K extends keyof ConversationEventMap>(
    eventType: K,
    listener: ConversationEventListener<ConversationEventMap[K]>
  ): void {
    if (!this.listeners.has(eventType)) {
      this.listeners.set(eventType, new Set());
    }
    this.listeners.get(eventType)!.add(listener as ConversationEventListener);
  }

  onAny(listener: ConversationEventListener): void {
    this.anyListeners.add(listener);
  }

  off<K extends keyof ConversationEventMap>(
    eventType: K,
    listener: ConversationEventListener<ConversationEventMap[K]>
  ): void {
    this.listeners.get(eventType)?.delete(listener as ConversationEventListener);
  }

  offAny(listener: ConversationEventListener): void {
    this.anyListeners.delete(listener);
  }

  emit<K extends keyof ConversationEventMap>(event: ConversationEventMap[K]): void {
    // Notify specific listeners
    const typeListeners = this.listeners.get(event.type);
    if (typeListeners) {
      for (const listener of typeListeners) {
        try {
          listener(event);
        } catch (error) {
          console.error(`Error in event listener for ${event.type}:`, error);
        }
      }
    }

    // Notify any listeners
    for (const listener of this.anyListeners) {
      try {
        listener(event);
      } catch (error) {
        console.error(`Error in any-event listener for ${event.type}:`, error);
      }
    }
  }

  /**
   * Remove all listeners.
   */
  removeAllListeners(): void {
    this.listeners.clear();
    this.anyListeners.clear();
  }
}
