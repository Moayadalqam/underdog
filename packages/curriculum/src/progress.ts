// ===========================================
// Progress Tracking
// ===========================================
// Owner: Stream 3 (Curriculum & Content)

import type { UserCurriculumProgress, ModuleProgress } from './types';
import { getAllModuleSummaries } from './modules';

/**
 * Calculate overall curriculum progress for a user
 */
export function calculateUserProgress(
  userId: string,
  completedLessons: Map<string, Set<string>>, // moduleId -> Set of lessonIds
  moduleScores: Map<string, number> // moduleId -> best score
): UserCurriculumProgress {
  const modules = getAllModuleSummaries();
  const moduleProgress: ModuleProgress[] = [];

  let totalLessons = 0;
  let completedLessonsCount = 0;
  let completedModulesCount = 0;
  let currentModuleId: string | undefined;
  let currentLessonId: string | undefined;

  for (const module of modules) {
    const completed = completedLessons.get(module.id) ?? new Set();
    const lessonsCompleted = completed.size;
    const progress = module.lessonCount > 0
      ? Math.round((lessonsCompleted / module.lessonCount) * 100)
      : 0;

    totalLessons += module.lessonCount;
    completedLessonsCount += lessonsCompleted;

    let status: ModuleProgress['status'] = 'not_started';
    if (progress === 100) {
      status = 'completed';
      completedModulesCount++;
    } else if (progress > 0) {
      status = 'in_progress';
      if (!currentModuleId) {
        currentModuleId = module.id;
      }
    }

    moduleProgress.push({
      moduleId: module.id,
      moduleNumber: module.number,
      status,
      lessonsCompleted,
      totalLessons: module.lessonCount,
      progress,
      bestScore: moduleScores.get(module.id),
    });
  }

  // Find current position if not in progress
  if (!currentModuleId && modules.length > 0) {
    const firstIncomplete = moduleProgress.find(m => m.status !== 'completed');
    currentModuleId = firstIncomplete?.moduleId ?? modules[0].id;
  }

  const overallProgress = totalLessons > 0
    ? Math.round((completedLessonsCount / totalLessons) * 100)
    : 0;

  return {
    userId,
    totalModules: modules.length,
    completedModules: completedModulesCount,
    currentModuleId,
    currentLessonId,
    overallProgress,
    moduleProgress,
  };
}

/**
 * Check if a module is unlocked for a user
 */
export function isModuleUnlocked(
  moduleNumber: number,
  completedModuleNumbers: number[]
): boolean {
  // First module is always unlocked
  if (moduleNumber === 1) return true;

  // Module is unlocked if previous module is completed
  return completedModuleNumbers.includes(moduleNumber - 1);
}

/**
 * Get the next lesson to complete in a module
 */
export function getNextLesson(
  moduleId: string,
  completedLessonIds: string[],
  allLessonIds: string[]
): string | undefined {
  const completedSet = new Set(completedLessonIds);
  return allLessonIds.find(id => !completedSet.has(id));
}

/**
 * Calculate streak days (consecutive days with activity)
 */
export function calculateStreak(activityDates: Date[]): number {
  if (activityDates.length === 0) return 0;

  const sorted = [...activityDates].sort((a, b) => b.getTime() - a.getTime());
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  let streak = 0;
  let checkDate = new Date(today);

  for (const date of sorted) {
    const activityDate = new Date(date);
    activityDate.setHours(0, 0, 0, 0);

    const diff = Math.floor((checkDate.getTime() - activityDate.getTime()) / (1000 * 60 * 60 * 24));

    if (diff === 0 || diff === 1) {
      streak++;
      checkDate = activityDate;
    } else {
      break;
    }
  }

  return streak;
}

/**
 * Format progress for display
 */
export function formatProgressDisplay(progress: number): string {
  if (progress === 0) return 'Not started';
  if (progress === 100) return 'Completed';
  return `${progress}% complete`;
}
