// ===========================================
// Curriculum Service - CRUD Operations
// ===========================================
// Type-safe curriculum operations with Supabase

import { createTypedBrowserClient } from '@/lib/supabase/typed-client';
import type {
  CurriculumModule,
  CurriculumModuleInsert,
  CurriculumModuleUpdate,
  CurriculumModuleWithLessons,
  Lesson,
  LessonInsert,
  TrainingScenario,
  UserProgress,
  UserProgressInsert,
} from '@underdog/database';

export class CurriculumService {
  private supabase = createTypedBrowserClient();

  // ===========================================
  // Module Operations
  // ===========================================

  /**
   * Get all active curriculum modules
   */
  async getModules(): Promise<CurriculumModule[]> {
    const { data, error } = await this.supabase
      .from('curriculum_modules')
      .select('*')
      .eq('is_active', true)
      .order('number', { ascending: true });

    if (error) {
      console.error('Error fetching modules:', error);
      throw error;
    }

    return data || [];
  }

  /**
   * Get module by ID with lessons and scenarios
   */
  async getModuleById(id: string): Promise<CurriculumModuleWithLessons | null> {
    const { data, error } = await this.supabase
      .from('curriculum_modules')
      .select(`
        *,
        lessons(*),
        training_scenarios(*)
      `)
      .eq('id', id)
      .maybeSingle();

    if (error) {
      console.error('Error fetching module:', error);
      throw error;
    }

    if (data) {
      // Sort lessons by order
      const moduleData = data as CurriculumModuleWithLessons;
      if (moduleData.lessons) {
        moduleData.lessons = moduleData.lessons.sort((a: Lesson, b: Lesson) => a.order - b.order);
      }
      return moduleData;
    }

    return null;
  }

  /**
   * Get module by number (1-12)
   */
  async getModuleByNumber(number: number): Promise<CurriculumModuleWithLessons | null> {
    const { data, error } = await this.supabase
      .from('curriculum_modules')
      .select(`
        *,
        lessons(*),
        training_scenarios(*)
      `)
      .eq('number', number)
      .maybeSingle();

    if (error) {
      console.error('Error fetching module by number:', error);
      throw error;
    }

    if (data) {
      const moduleData = data as CurriculumModuleWithLessons;
      if (moduleData.lessons) {
        moduleData.lessons = moduleData.lessons.sort((a: Lesson, b: Lesson) => a.order - b.order);
      }
      return moduleData;
    }

    return null;
  }

  /**
   * Create a new module (trainer/admin only)
   */
  async createModule(module: CurriculumModuleInsert): Promise<CurriculumModule> {
    const { data, error } = await this.supabase
      .from('curriculum_modules')
      .insert(module)
      .select()
      .single();

    if (error) {
      console.error('Error creating module:', error);
      throw error;
    }

    return data;
  }

  /**
   * Update a module (trainer/admin only)
   */
  async updateModule(id: string, updates: CurriculumModuleUpdate): Promise<CurriculumModule> {
    const { data, error } = await this.supabase
      .from('curriculum_modules')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating module:', error);
      throw error;
    }

    return data;
  }

  // ===========================================
  // Lesson Operations
  // ===========================================

  /**
   * Get lessons for a module
   */
  async getLessonsByModule(moduleId: string): Promise<Lesson[]> {
    const { data, error } = await this.supabase
      .from('lessons')
      .select('*')
      .eq('module_id', moduleId)
      .order('order', { ascending: true });

    if (error) {
      console.error('Error fetching lessons:', error);
      throw error;
    }

    return data || [];
  }

  /**
   * Get lesson by ID
   */
  async getLessonById(id: string): Promise<Lesson | null> {
    const { data, error } = await this.supabase
      .from('lessons')
      .select('*')
      .eq('id', id)
      .maybeSingle();

    if (error) {
      console.error('Error fetching lesson:', error);
      throw error;
    }

    return data;
  }

  /**
   * Create a new lesson (trainer/admin only)
   */
  async createLesson(lesson: LessonInsert): Promise<Lesson> {
    const { data, error } = await this.supabase
      .from('lessons')
      .insert(lesson)
      .select()
      .single();

    if (error) {
      console.error('Error creating lesson:', error);
      throw error;
    }

    return data;
  }

  // ===========================================
  // Training Scenarios
  // ===========================================

  /**
   * Get scenarios for a module
   */
  async getScenariosByModule(moduleId: string): Promise<TrainingScenario[]> {
    const { data, error } = await this.supabase
      .from('training_scenarios')
      .select('*')
      .eq('module_id', moduleId)
      .eq('is_active', true)
      .order('difficulty', { ascending: true });

    if (error) {
      console.error('Error fetching scenarios:', error);
      throw error;
    }

    return data || [];
  }

  // ===========================================
  // User Progress Operations
  // ===========================================

  /**
   * Get user's progress for all modules
   */
  async getUserProgress(): Promise<UserProgress[]> {
    const { data: { user } } = await this.supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const { data, error } = await this.supabase
      .from('user_progress')
      .select(`
        *,
        curriculum_module:curriculum_modules(*),
        lesson:lessons(*)
      `)
      .eq('user_id', user.id)
      .order('updated_at', { ascending: false });

    if (error) {
      console.error('Error fetching user progress:', error);
      throw error;
    }

    return data || [];
  }

  /**
   * Get user's progress for a specific module
   */
  async getModuleProgress(moduleId: string): Promise<UserProgress[]> {
    const { data: { user } } = await this.supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const { data, error } = await this.supabase
      .from('user_progress')
      .select('*')
      .eq('user_id', user.id)
      .eq('module_id', moduleId);

    if (error) {
      console.error('Error fetching module progress:', error);
      throw error;
    }

    return data || [];
  }

  /**
   * Update or create progress record
   */
  async upsertProgress(
    moduleId: string,
    lessonId: string | null,
    score?: number,
    completed: boolean = false
  ): Promise<UserProgress> {
    const { data: { user } } = await this.supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const progress: UserProgressInsert = {
      user_id: user.id,
      module_id: moduleId,
      lesson_id: lessonId,
      score: score || null,
      completed_at: completed ? new Date().toISOString() : null,
    };

    const { data, error } = await this.supabase
      .from('user_progress')
      .upsert(progress, {
        onConflict: 'user_id,module_id,lesson_id',
      })
      .select()
      .single();

    if (error) {
      console.error('Error upserting progress:', error);
      throw error;
    }

    return data;
  }

  /**
   * Mark a lesson as completed
   */
  async completeLesson(moduleId: string, lessonId: string, score?: number): Promise<UserProgress> {
    return this.upsertProgress(moduleId, lessonId, score, true);
  }

  /**
   * Get completion percentage for a module
   */
  async getModuleCompletionPercentage(moduleId: string): Promise<number> {
    const { data: { user } } = await this.supabase.auth.getUser();
    if (!user) return 0;

    // Get total lessons in module
    const { count: totalLessons } = await this.supabase
      .from('lessons')
      .select('*', { count: 'exact', head: true })
      .eq('module_id', moduleId);

    if (!totalLessons || totalLessons === 0) return 0;

    // Get completed lessons
    const { count: completedLessons } = await this.supabase
      .from('user_progress')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', user.id)
      .eq('module_id', moduleId)
      .not('completed_at', 'is', null);

    return Math.round(((completedLessons || 0) / totalLessons) * 100);
  }
}

// Singleton instance for easy import
export const curriculumService = new CurriculumService();
