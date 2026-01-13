// ===========================================
// @underdog/objections - Objection Library
// ===========================================
// Owner: Stream 3 (Curriculum & Content)

// Types
export type {
  ObjectionDefinition,
  SuggestedResponse,
  ResponseTechnique,
  ObjectionMatch,
  ObjectionStats,
} from './types';

// Library functions
export {
  loadObjections,
  getAllObjections,
  getObjectionsByCategory,
  getObjectionsByDifficulty,
  getObjectionById,
  searchObjections,
  matchObjection,
  getRandomObjections,
  getObjectionStats,
  registerObjection,
  clearObjectionCache,
} from './library';

// Response functions
export {
  TECHNIQUE_DESCRIPTIONS,
  RESPONSE_TEMPLATES,
  getResponseTemplate,
  fillTemplate,
  getBestResponse,
  scoreResponse,
} from './responses';
