// ===========================================
// @underdog/curriculum - Training Modules
// ===========================================
// Owner: Stream 3 (Curriculum & Content)

// Types
export type {
  ModuleSummary,
  ModuleWithContent,
  LessonWithContent,
  Exercise,
  ScenarioSummary,
  UserCurriculumProgress,
  ModuleProgress,
  CurriculumNavItem,
} from './types';

// Module functions
export {
  loadModules,
  getAllModuleSummaries,
  getModuleById,
  getModuleByNumber,
  getNavigationItems,
  getNextModule,
  getPreviousModule,
  registerModule,
  clearModuleCache,
} from './modules';

// Progress functions
export {
  calculateUserProgress,
  isModuleUnlocked,
  getNextLesson,
  calculateStreak,
  formatProgressDisplay,
} from './progress';

// Scenario functions
export {
  DIFFICULTY_LABELS,
  getModuleScenarios,
  getScenariosByDifficulty,
  getRandomScenario,
  getRecommendedScenarios,
  buildScenarioContext,
  isValidDifficulty,
} from './scenarios';
