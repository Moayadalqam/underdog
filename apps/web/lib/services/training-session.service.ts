// ===========================================
// Training Session Service - CRUD Operations
// ===========================================
// Type-safe training session operations with Supabase

import { createClient } from '@/lib/supabase/client';
import type {
  TrainingSession,
  TrainingSessionInsert,
  TrainingSessionUpdate,
  TrainingSessionWithRelations,
  SessionStatus,
  SessionType,
} from '@underdog/database';

export class TrainingSessionService {
  private supabase = createClient();

  // ===========================================
  // CREATE Operations
  // ===========================================

  /**
   * Start a new training session
   */
  async createSession(
    type: SessionType,
    moduleId?: string,
    scenarioId?: string
  ): Promise<TrainingSession> {
    const { data: { user } } = await this.supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const session: TrainingSessionInsert = {
      user_id: user.id,
      type,
      module_id: moduleId || null,
      scenario_id: scenarioId || null,
      status: 'active',
    };

    const { data, error } = await this.supabase
      .from('training_sessions')
      .insert(session)
      .select()
      .single();

    if (error) {
      console.error('Error creating session:', error);
      throw error;
    }

    return data;
  }

  // ===========================================
  // READ Operations
  // ===========================================

  /**
   * Get session by ID with all relations
   */
  async getSessionById(id: string): Promise<TrainingSessionWithRelations | null> {
    const { data, error } = await this.supabase
      .from('training_sessions')
      .select(`
        *,
        profile:profiles(*),
        curriculum_module:curriculum_modules(*),
        training_scenario:training_scenarios(*),
        transcript:transcripts(*),
        session_scores:session_scores(*)
      `)
      .eq('id', id)
      .maybeSingle();

    if (error) {
      console.error('Error fetching session:', error);
      throw error;
    }

    return data as TrainingSessionWithRelations | null;
  }

  /**
   * Get current user's sessions with pagination
   */
  async getUserSessions(
    page: number = 1,
    pageSize: number = 10,
    status?: SessionStatus
  ): Promise<{ sessions: TrainingSession[]; total: number }> {
    const { data: { user } } = await this.supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    let query = this.supabase
      .from('training_sessions')
      .select('*', { count: 'exact' })
      .eq('user_id', user.id)
      .order('started_at', { ascending: false })
      .range((page - 1) * pageSize, page * pageSize - 1);

    if (status) {
      query = query.eq('status', status);
    }

    const { data, error, count } = await query;

    if (error) {
      console.error('Error fetching sessions:', error);
      throw error;
    }

    return {
      sessions: data || [],
      total: count || 0,
    };
  }

  /**
   * Get recent sessions for dashboard
   */
  async getRecentSessions(limit: number = 5): Promise<TrainingSession[]> {
    const { data: { user } } = await this.supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const { data, error } = await this.supabase
      .from('training_sessions')
      .select('*')
      .eq('user_id', user.id)
      .order('started_at', { ascending: false })
      .limit(limit);

    if (error) {
      console.error('Error fetching recent sessions:', error);
      throw error;
    }

    return data || [];
  }

  /**
   * Get sessions by module
   */
  async getSessionsByModule(moduleId: string): Promise<TrainingSession[]> {
    const { data: { user } } = await this.supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const { data, error } = await this.supabase
      .from('training_sessions')
      .select('*')
      .eq('user_id', user.id)
      .eq('module_id', moduleId)
      .order('started_at', { ascending: false });

    if (error) {
      console.error('Error fetching module sessions:', error);
      throw error;
    }

    return data || [];
  }

  // ===========================================
  // UPDATE Operations
  // ===========================================

  /**
   * Update session status
   */
  async updateSessionStatus(
    id: string,
    status: SessionStatus
  ): Promise<TrainingSession> {
    const updates: TrainingSessionUpdate = {
      status,
      ended_at: status === 'completed' || status === 'abandoned'
        ? new Date().toISOString()
        : null,
    };

    const { data, error } = await this.supabase
      .from('training_sessions')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating session:', error);
      throw error;
    }

    return data;
  }

  /**
   * End a session (mark as completed)
   */
  async endSession(id: string): Promise<TrainingSession> {
    return this.updateSessionStatus(id, 'completed');
  }

  /**
   * Abandon a session
   */
  async abandonSession(id: string): Promise<TrainingSession> {
    return this.updateSessionStatus(id, 'abandoned');
  }

  // ===========================================
  // DELETE Operations
  // ===========================================

  /**
   * Delete a session
   */
  async deleteSession(id: string): Promise<void> {
    const { error } = await this.supabase
      .from('training_sessions')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting session:', error);
      throw error;
    }
  }

  // ===========================================
  // Analytics Helpers
  // ===========================================

  /**
   * Get session statistics for current user
   */
  async getSessionStats(): Promise<{
    totalSessions: number;
    completedSessions: number;
    averageScore: number | null;
  }> {
    const { data: { user } } = await this.supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    // Get session counts
    const { count: totalSessions } = await this.supabase
      .from('training_sessions')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', user.id);

    const { count: completedSessions } = await this.supabase
      .from('training_sessions')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', user.id)
      .eq('status', 'completed');

    // Get average score
    const { data: scores } = await this.supabase
      .from('session_scores')
      .select(`
        overall_score,
        training_sessions!inner(user_id)
      `)
      .eq('training_sessions.user_id', user.id);

    const averageScore = scores && scores.length > 0
      ? scores.reduce((sum, s) => sum + s.overall_score, 0) / scores.length
      : null;

    return {
      totalSessions: totalSessions || 0,
      completedSessions: completedSessions || 0,
      averageScore,
    };
  }
}

// Singleton instance for easy import
export const trainingSessionService = new TrainingSessionService();
