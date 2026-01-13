'use client';

// ===========================================
// Supabase React Hooks
// ===========================================
// Custom hooks for data fetching with Supabase

import { useState, useEffect, useCallback } from 'react';
import { createClient } from '@/lib/supabase/client';
import type { User, Session, AuthChangeEvent } from '@supabase/supabase-js';
import type {
  Profile,
  CurriculumModule,
  TrainingSession,
} from '@underdog/database';

// ===========================================
// Auth Hooks
// ===========================================

/**
 * Hook to get and subscribe to auth state
 */
export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const supabase = createClient();

    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // Subscribe to auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event: AuthChangeEvent, session: Session | null) => {
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const signOut = useCallback(async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
  }, []);

  return { user, session, loading, signOut };
}

// ===========================================
// Profile Hooks
// ===========================================

/**
 * Hook to get current user's profile
 */
export function useProfile() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const { user } = useAuth();

  const fetchProfile = useCallback(async () => {
    if (!user) {
      setProfile(null);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const supabase = createClient();
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (error) throw error;
      setProfile(data);
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  return { profile, loading, error, refetch: fetchProfile };
}

// ===========================================
// Curriculum Hooks
// ===========================================

/**
 * Hook to get all curriculum modules
 */
export function useCurriculumModules() {
  const [modules, setModules] = useState<CurriculumModule[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchModules = useCallback(async () => {
    try {
      setLoading(true);
      const supabase = createClient();
      const { data, error } = await supabase
        .from('curriculum_modules')
        .select('*')
        .eq('is_active', true)
        .order('number', { ascending: true });

      if (error) throw error;
      setModules(data || []);
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchModules();
  }, [fetchModules]);

  return { modules, loading, error, refetch: fetchModules };
}

/**
 * Hook to get a single curriculum module with lessons
 */
export function useCurriculumModule(moduleId: string | null) {
  const [module, setModule] = useState<CurriculumModule | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchModule = useCallback(async () => {
    if (!moduleId) {
      setModule(null);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const supabase = createClient();
      const { data, error } = await supabase
        .from('curriculum_modules')
        .select(`
          *,
          lessons(*),
          training_scenarios(*)
        `)
        .eq('id', moduleId)
        .single();

      if (error) throw error;
      setModule(data);
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  }, [moduleId]);

  useEffect(() => {
    fetchModule();
  }, [fetchModule]);

  return { module, loading, error, refetch: fetchModule };
}

// ===========================================
// Training Session Hooks
// ===========================================

/**
 * Hook to get user's recent training sessions
 */
export function useTrainingSessions(limit: number = 10) {
  const [sessions, setSessions] = useState<TrainingSession[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const { user } = useAuth();

  const fetchSessions = useCallback(async () => {
    if (!user) {
      setSessions([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const supabase = createClient();
      const { data, error } = await supabase
        .from('training_sessions')
        .select('*')
        .eq('user_id', user.id)
        .order('started_at', { ascending: false })
        .limit(limit);

      if (error) throw error;
      setSessions(data || []);
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  }, [user, limit]);

  useEffect(() => {
    fetchSessions();
  }, [fetchSessions]);

  return { sessions, loading, error, refetch: fetchSessions };
}

// ===========================================
// Real-time Subscription Hook
// ===========================================

/**
 * Hook to subscribe to real-time changes on a table
 */
export function useRealtimeSubscription<T>(
  table: string,
  filter?: { column: string; value: string }
) {
  const [data, setData] = useState<T[]>([]);

  useEffect(() => {
    const supabase = createClient();

    const channel = supabase
      .channel(`${table}-changes`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table,
          filter: filter ? `${filter.column}=eq.${filter.value}` : undefined,
        },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            setData((prev) => [...prev, payload.new as T]);
          } else if (payload.eventType === 'UPDATE') {
            setData((prev) =>
              prev.map((item: T) =>
                (item as { id?: string }).id === (payload.new as { id?: string }).id
                  ? (payload.new as T)
                  : item
              )
            );
          } else if (payload.eventType === 'DELETE') {
            setData((prev) =>
              prev.filter(
                (item: T) => (item as { id?: string }).id !== (payload.old as { id?: string }).id
              )
            );
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [table, filter]);

  return { data, setData };
}
