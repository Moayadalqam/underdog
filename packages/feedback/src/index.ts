// ===========================================
// @underdog/feedback - AI Feedback Generation
// ===========================================
// Owner: Stream 4 (Analytics & Feedback)

// Types
export type {
  FeedbackSeverity,
  FeedbackCategory,
  FeedbackItem,
  SessionFeedback,
  RealtimeFeedback,
  FeedbackContext,
  TranscriptForFeedback,
} from './types';

// Analyzer
export {
  analyzeTranscript,
  countBySeverity,
  countByCategory,
} from './analyzer';

// Suggestions
export {
  generateSessionFeedback,
  getContextualTip,
} from './suggestions';
