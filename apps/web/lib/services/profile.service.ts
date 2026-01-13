// ===========================================
// Profile Service - CRUD Operations
// ===========================================
// Type-safe profile operations with Supabase

import { createTypedBrowserClient } from '@/lib/supabase/typed-client';
import type {
  Profile,
  ProfileUpdate,
  ProfileWithOrganization,
} from '@underdog/database';

export class ProfileService {
  private supabase = createTypedBrowserClient();

  // ===========================================
  // READ Operations
  // ===========================================

  /**
   * Get current user's profile
   */
  async getCurrentProfile(): Promise<Profile | null> {
    const { data: { user } } = await this.supabase.auth.getUser();
    if (!user) return null;

    const { data, error } = await this.supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();

    if (error) {
      console.error('Error fetching profile:', error);
      throw error;
    }

    return data;
  }

  /**
   * Get profile by ID
   */
  async getProfileById(id: string): Promise<Profile | null> {
    const { data, error } = await this.supabase
      .from('profiles')
      .select('*')
      .eq('id', id)
      .maybeSingle();

    if (error) {
      console.error('Error fetching profile:', error);
      throw error;
    }

    return data;
  }

  /**
   * Get profile with organization details
   */
  async getProfileWithOrganization(id: string): Promise<ProfileWithOrganization | null> {
    const { data, error } = await this.supabase
      .from('profiles')
      .select(`
        *,
        organization:organizations(*)
      `)
      .eq('id', id)
      .maybeSingle();

    if (error) {
      console.error('Error fetching profile with organization:', error);
      throw error;
    }

    return data as ProfileWithOrganization | null;
  }

  /**
   * Get all profiles in organization
   */
  async getOrganizationProfiles(organizationId: string): Promise<Profile[]> {
    const { data, error } = await this.supabase
      .from('profiles')
      .select('*')
      .eq('organization_id', organizationId)
      .order('name', { ascending: true });

    if (error) {
      console.error('Error fetching organization profiles:', error);
      throw error;
    }

    return data || [];
  }

  // ===========================================
  // UPDATE Operations
  // ===========================================

  /**
   * Update current user's profile
   */
  async updateCurrentProfile(updates: ProfileUpdate): Promise<Profile> {
    const { data: { user } } = await this.supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const { data, error } = await this.supabase
      .from('profiles')
      .update(updates)
      .eq('id', user.id)
      .select()
      .single();

    if (error) {
      console.error('Error updating profile:', error);
      throw error;
    }

    return data;
  }

  /**
   * Update profile by ID (admin only)
   */
  async updateProfile(id: string, updates: ProfileUpdate): Promise<Profile> {
    const { data, error } = await this.supabase
      .from('profiles')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating profile:', error);
      throw error;
    }

    return data;
  }
}

// Singleton instance for easy import
export const profileService = new ProfileService();
