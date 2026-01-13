// ===========================================
// Curriculum Types
// ===========================================
// Owner: Stream 3 (Curriculum & Content)

import type { CurriculumModule, Lesson, UserProgress } from '@underdog/core';

/**
 * Module with lesson count for list views
 */
export interface ModuleSummary {
  id: string;
  number: number;
  title: string;
  description: string;
  lessonCount: number;
  scenarioCount: number;
  estimatedMinutes: number;
}

/**
 * Module with full content
 */
export interface ModuleWithContent extends CurriculumModule {
  lessons: LessonWithContent[];
  scenarios: ScenarioSummary[];
}

/**
 * Lesson with rich content
 */
export interface LessonWithContent extends Lesson {
  objectives: string[];
  keyPoints: string[];
  exercises: Exercise[];
}

/**
 * Exercise within a lesson
 */
export interface Exercise {
  id: string;
  type: 'reflection' | 'practice' | 'quiz' | 'roleplay';
  title: string;
  instructions: string;
  scenarioId?: string; // Link to training scenario
}

/**
 * Training scenario summary
 */
export interface ScenarioSummary {
  id: string;
  title: string;
  description: string;
  difficulty: number;
  personaHint?: string;
  moduleId: string;
}

/**
 * User's progress through curriculum
 */
export interface UserCurriculumProgress {
  userId: string;
  totalModules: number;
  completedModules: number;
  currentModuleId?: string;
  currentLessonId?: string;
  overallProgress: number; // 0-100
  moduleProgress: ModuleProgress[];
}

/**
 * Progress for a single module
 */
export interface ModuleProgress {
  moduleId: string;
  moduleNumber: number;
  status: 'not_started' | 'in_progress' | 'completed';
  lessonsCompleted: number;
  totalLessons: number;
  progress: number; // 0-100
  bestScore?: number;
  lastAccessedAt?: Date;
}

/**
 * Curriculum navigation item
 */
export interface CurriculumNavItem {
  moduleNumber: number;
  moduleId: string;
  title: string;
  isCompleted: boolean;
  isCurrent: boolean;
  isLocked: boolean; // Sequential unlock
}
