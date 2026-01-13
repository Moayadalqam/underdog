// ===========================================
// @underdog/scoring - Pitch Evaluation
// ===========================================
// Owner: Stream 4 (Analytics & Feedback)

// Types
export type {
  ScoreCategory,
  CategoryScore,
  CriteriaScore,
  SessionScore,
  ScoringRubric,
  RubricCriteria,
  RubricLevel,
  ScoringTranscript,
  ScoringSegment,
} from './types';

// Rubrics
export { OPENING_RUBRIC, scoreOpening } from './rubrics/opening';
export { DISCOVERY_RUBRIC, scoreDiscovery } from './rubrics/discovery';

// Evaluator
export {
  evaluateSession,
  getLetterGrade,
  getPerformanceLevel,
  compareToAverage,
} from './evaluator';
