// ===========================================
// @underdog/ai-engine - LLM Orchestration
// ===========================================
// Owner: Stream 2 (AI Role-Play Engine)
//
// AI engine for prospect simulation and real-time feedback.

// ----- Persona Types -----
export type {
  PersonaVoiceConfig,
  PersonaBehavior,
  PersonaObjections,
  PersonaMood,
  PersonaIndustryContext,
  PersonaAvailability,
  PersonaDefinition,
  PersonaResponsePattern,
  PersonaSummary,
  PersonaState,
} from './personas/types';

export {
  scoreToMoodLevel,
  moodLevelToScore,
  createPersonaState,
} from './personas/types';

// ----- Prompts -----
export {
  generateProspectSystemPrompt,
  formatTraineeMessage,
  generateOpeningPrompt,
  buildConversationMessages,
} from './prompts/prospect';

export type {
  FeedbackCategory,
  FeedbackSeverity,
  FeedbackItem,
  FeedbackContext,
} from './prompts/feedback';

export {
  generateFeedbackSystemPrompt,
  formatFeedbackRequest,
  parseFeedbackResponse,
  detectFillerWords,
  generateFillerWordFeedback,
} from './prompts/feedback';

// ----- Orchestrator -----
export type {
  OrchestratorConfig,
  ConversationTurnResult,
  ConversationEntry,
} from './orchestrator';

export {
  AIOrchestrator,
  AIOrchestrationError,
  createOrchestrator,
} from './orchestrator';
