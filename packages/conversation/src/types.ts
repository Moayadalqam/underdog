// ===========================================
// Conversation State Types
// ===========================================
// Owner: Stream 2 (AI Role-Play Engine)
//
// Type definitions for conversation state management.

import type { TranscriptSegment, TrainingSession } from '@underdog/core';
import type { PersonaDefinition, PersonaState, FeedbackItem } from '@underdog/ai-engine';

/**
 * States in the conversation state machine.
 */
export type ConversationPhase =
  | 'idle'           // No active conversation
  | 'initializing'   // Setting up conversation resources
  | 'connecting'     // Establishing voice connection
  | 'ringing'        // "Phone is ringing" animation state
  | 'prospect_speaking' // AI is speaking
  | 'trainee_speaking'  // Trainee is speaking
  | 'processing'     // Processing trainee input, generating response
  | 'paused'         // Conversation paused by trainee
  | 'ending'         // Conversation is ending
  | 'ended'          // Conversation has ended
  | 'error';         // Error state

/**
 * Reasons for ending a conversation.
 */
export type ConversationEndReason =
  | 'trainee_ended'      // Trainee chose to end
  | 'prospect_hung_up'   // Prospect ended the call
  | 'time_limit'         // Maximum time reached
  | 'error'              // Technical error
  | 'completed';         // Natural conclusion

/**
 * A single message in the conversation.
 */
export interface ConversationMessage {
  /** Unique message ID */
  id: string;
  /** Who sent the message */
  speaker: 'trainee' | 'prospect' | 'system';
  /** Message content (text) */
  content: string;
  /** Timestamp when message was created */
  timestamp: number;
  /** Duration of audio in milliseconds (if applicable) */
  audioDurationMs?: number;
  /** Whether this message has been spoken aloud */
  spoken: boolean;
  /** Feedback items related to this message */
  feedback?: FeedbackItem[];
}

/**
 * Metrics tracked during the conversation.
 */
export interface ConversationMetrics {
  /** Total duration in milliseconds */
  totalDurationMs: number;
  /** Time trainee spent speaking */
  traineeSpokeDurationMs: number;
  /** Time prospect spent speaking */
  prospectSpokeDurationMs: number;
  /** Number of conversation turns */
  turnCount: number;
  /** Number of objections raised */
  objectionsRaised: number;
  /** Number of objections handled well */
  objectionsHandled: number;
  /** Final mood score */
  finalMoodScore: number;
  /** Final trust level */
  finalTrustLevel: number;
  /** Number of interruptions */
  interruptionCount: number;
  /** Average response time in ms */
  averageResponseTimeMs: number;
}

/**
 * Error information for error states.
 */
export interface ConversationError {
  /** Error code */
  code: string;
  /** Human-readable message */
  message: string;
  /** When the error occurred */
  timestamp: number;
  /** Whether the error is recoverable */
  recoverable: boolean;
  /** Suggested action for the user */
  suggestedAction?: string;
}

/**
 * Configuration for a conversation session.
 */
export interface ConversationConfig {
  /** Persona to simulate */
  persona: PersonaDefinition;
  /** Training module context */
  moduleId?: string;
  /** Specific scenario within module */
  scenarioId?: string;
  /** Maximum conversation duration in ms */
  maxDurationMs?: number;
  /** Whether to enable real-time feedback */
  enableFeedback?: boolean;
  /** Focus areas for feedback */
  feedbackFocusAreas?: string[];
  /** Trainee skill level */
  skillLevel?: 'beginner' | 'intermediate' | 'advanced';
  /** Voice configuration overrides */
  voiceConfig?: {
    voiceId?: string;
    speed?: number;
  };
}

/**
 * Complete conversation state.
 */
export interface ConversationState {
  /** Unique session ID */
  sessionId: string;
  /** Current phase of the conversation */
  phase: ConversationPhase;
  /** Configuration for this conversation */
  config: ConversationConfig;
  /** Associated training session */
  trainingSession?: TrainingSession;

  /** Current persona state */
  personaState: PersonaState;
  /** All messages in the conversation */
  messages: ConversationMessage[];
  /** Accumulated feedback items */
  feedback: FeedbackItem[];

  /** Conversation start time */
  startedAt: number;
  /** When the conversation ended (if applicable) */
  endedAt?: number;
  /** Reason for ending (if applicable) */
  endReason?: ConversationEndReason;

  /** Current error (if in error state) */
  error?: ConversationError;
  /** Conversation metrics */
  metrics: ConversationMetrics;

  /** Whether microphone is muted */
  isMuted: boolean;
  /** Whether currently recording */
  isRecording: boolean;
  /** Current transcript segment being processed */
  currentTranscript?: TranscriptSegment;
}

/**
 * Initial state factory.
 */
export function createInitialState(
  sessionId: string,
  config: ConversationConfig,
  personaState: PersonaState
): ConversationState {
  return {
    sessionId,
    phase: 'idle',
    config,
    personaState,
    messages: [],
    feedback: [],
    startedAt: 0,
    metrics: {
      totalDurationMs: 0,
      traineeSpokeDurationMs: 0,
      prospectSpokeDurationMs: 0,
      turnCount: 0,
      objectionsRaised: 0,
      objectionsHandled: 0,
      finalMoodScore: personaState.moodScore,
      finalTrustLevel: personaState.trustLevel,
      interruptionCount: 0,
      averageResponseTimeMs: 0,
    },
    isMuted: false,
    isRecording: false,
  };
}

/**
 * Check if conversation is in an active state.
 */
export function isConversationActive(state: ConversationState): boolean {
  const activePhases: ConversationPhase[] = [
    'connecting',
    'ringing',
    'prospect_speaking',
    'trainee_speaking',
    'processing',
    'paused',
  ];
  return activePhases.includes(state.phase);
}

/**
 * Check if conversation can be started.
 */
export function canStartConversation(state: ConversationState): boolean {
  return state.phase === 'idle' || state.phase === 'ended';
}

/**
 * Check if conversation can be paused.
 */
export function canPauseConversation(state: ConversationState): boolean {
  const pauseablePhases: ConversationPhase[] = [
    'prospect_speaking',
    'trainee_speaking',
    'processing',
  ];
  return pauseablePhases.includes(state.phase);
}

/**
 * Calculate talk ratio (trainee vs prospect).
 */
export function calculateTalkRatio(metrics: ConversationMetrics): number {
  const total = metrics.traineeSpokeDurationMs + metrics.prospectSpokeDurationMs;
  if (total === 0) return 0;
  return metrics.traineeSpokeDurationMs / total;
}
