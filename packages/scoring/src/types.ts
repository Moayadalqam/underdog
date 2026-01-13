// ===========================================
// Scoring Types
// ===========================================
// Owner: Stream 4 (Analytics & Feedback)

/**
 * Score categories for pitch evaluation
 */
export type ScoreCategory = 'opening' | 'discovery' | 'objectionHandling' | 'closing';

/**
 * Individual category score
 */
export interface CategoryScore {
  category: ScoreCategory;
  score: number; // 0-100
  weight: number; // Percentage weight in overall score
  criteria: CriteriaScore[];
  feedback: string[];
}

/**
 * Individual criteria within a category
 */
export interface CriteriaScore {
  name: string;
  score: number; // 0-100
  maxScore: number;
  evidence: string[];
}

/**
 * Complete session score
 */
export interface SessionScore {
  sessionId: string;
  overallScore: number; // 0-100 weighted average
  categories: CategoryScore[];
  strengths: string[];
  improvements: string[];
  generatedAt: Date;
}

/**
 * Scoring rubric definition
 */
export interface ScoringRubric {
  category: ScoreCategory;
  weight: number;
  criteria: RubricCriteria[];
}

/**
 * Individual rubric criteria
 */
export interface RubricCriteria {
  name: string;
  description: string;
  maxPoints: number;
  levels: RubricLevel[];
}

/**
 * Scoring levels within criteria
 */
export interface RubricLevel {
  points: number;
  label: string;
  description: string;
  indicators: string[];
}

/**
 * Transcript for scoring
 */
export interface ScoringTranscript {
  sessionId: string;
  segments: ScoringSegment[];
  duration: number;
  traineeWordCount: number;
  prospectWordCount: number;
}

/**
 * Transcript segment for scoring
 */
export interface ScoringSegment {
  speaker: 'trainee' | 'prospect';
  text: string;
  timestamp: number;
}
