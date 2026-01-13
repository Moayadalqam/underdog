// ===========================================
// Feedback Types
// ===========================================
// Owner: Stream 4 (Analytics & Feedback)

/**
 * Feedback severity levels
 */
export type FeedbackSeverity = 'critical' | 'important' | 'suggestion' | 'positive';

/**
 * Feedback categories
 */
export type FeedbackCategory =
  | 'opening'
  | 'rapport'
  | 'discovery'
  | 'objection_handling'
  | 'closing'
  | 'communication'
  | 'product_knowledge';

/**
 * Individual feedback item
 */
export interface FeedbackItem {
  id: string;
  category: FeedbackCategory;
  severity: FeedbackSeverity;
  message: string;
  suggestion?: string;
  timestamp?: number; // When in the call this occurred
  evidence?: string; // Quote from transcript
}

/**
 * Complete feedback for a session
 */
export interface SessionFeedback {
  sessionId: string;
  items: FeedbackItem[];
  summary: string;
  topStrength: string;
  topImprovement: string;
  actionItems: string[];
  generatedAt: Date;
}

/**
 * Real-time coaching feedback
 */
export interface RealtimeFeedback {
  type: 'tip' | 'warning' | 'encouragement';
  message: string;
  priority: number; // 1-10, higher = more urgent
  expiresInSeconds?: number;
}

/**
 * Feedback generation context
 */
export interface FeedbackContext {
  sessionId: string;
  transcript: TranscriptForFeedback;
  scores?: {
    opening?: number;
    discovery?: number;
    objectionHandling?: number;
    closing?: number;
  };
  userLevel: 'beginner' | 'intermediate' | 'advanced';
}

/**
 * Transcript structure for feedback generation
 */
export interface TranscriptForFeedback {
  segments: Array<{
    speaker: 'trainee' | 'prospect';
    text: string;
    timestamp: number;
  }>;
  duration: number;
}
