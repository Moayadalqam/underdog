// ===========================================
// @underdog/conversation - Conversation State
// ===========================================
// Owner: Stream 2 (AI Role-Play Engine)
//
// State machine and event system for role-play conversations.

// ----- Types -----
export type {
  ConversationPhase,
  ConversationEndReason,
  ConversationMessage,
  ConversationMetrics,
  ConversationError,
  ConversationConfig,
  ConversationState,
} from './types';

export {
  createInitialState,
  isConversationActive,
  canStartConversation,
  canPauseConversation,
  calculateTalkRatio,
} from './types';

// ----- Events -----
export type {
  BaseEvent,
  ConversationStartedEvent,
  PhaseChangedEvent,
  MessageReceivedEvent,
  TraineeSpeakingStartedEvent,
  TraineeSpeakingEndedEvent,
  ProspectSpeakingStartedEvent,
  ProspectSpeakingEndedEvent,
  FeedbackGeneratedEvent,
  ObjectionRaisedEvent,
  MoodChangedEvent,
  TrustChangedEvent,
  ConversationPausedEvent,
  ConversationResumedEvent,
  MuteToggledEvent,
  ConversationEndingEvent,
  ConversationEndedEvent,
  ErrorOccurredEvent,
  ErrorRecoveredEvent,
  AudioLevelChangedEvent,
  InterimTranscriptEvent,
  ConversationEvent,
  ConversationEventListener,
  ConversationEventMap,
  ConversationEventEmitter,
} from './events';

export {
  createEvent,
  SimpleEventEmitter,
} from './events';

// ----- State Machine -----
export type {
  StateMachineOptions,
} from './state';

export {
  ConversationStateMachine,
  createStateMachine,
} from './state';
