// ===========================================
// Underdog AI - Supabase TypeScript Types
// ===========================================
// Generated types matching the Supabase database schema
// These types can be used with the Supabase client for type-safe queries

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

// ===========================================
// Enum Types
// ===========================================

export type UserRole = 'admin' | 'trainer' | 'trainee';
export type SessionType = 'roleplay' | 'recording_analysis';
export type SessionStatus = 'active' | 'completed' | 'abandoned';
export type SpeakerType = 'trainee' | 'ai' | 'prospect';
export type PersonalityType = 'skeptical' | 'busy' | 'interested' | 'hostile' | 'friendly';
export type ObjectionCategory = 'common' | 'industry' | 'personality';
export type RecordingStatus = 'uploading' | 'processing' | 'transcribed' | 'analyzed' | 'failed';
export type MoodLevel = 'low' | 'medium' | 'high';

// ===========================================
// Database Types
// ===========================================

export interface Database {
  public: {
    Tables: {
      organizations: {
        Row: {
          id: string;
          name: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      profiles: {
        Row: {
          id: string;
          email: string;
          name: string;
          role: UserRole;
          organization_id: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          email: string;
          name: string;
          role?: UserRole;
          organization_id?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          name?: string;
          role?: UserRole;
          organization_id?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'profiles_id_fkey';
            columns: ['id'];
            referencedRelation: 'users';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'profiles_organization_id_fkey';
            columns: ['organization_id'];
            referencedRelation: 'organizations';
            referencedColumns: ['id'];
          }
        ];
      };
      ai_personas: {
        Row: {
          id: string;
          name: string;
          personality: PersonalityType;
          mood_min: MoodLevel;
          mood_max: MoodLevel;
          objection_style: string;
          response_patterns: string[];
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          personality: PersonalityType;
          mood_min: MoodLevel;
          mood_max: MoodLevel;
          objection_style: string;
          response_patterns?: string[];
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          personality?: PersonalityType;
          mood_min?: MoodLevel;
          mood_max?: MoodLevel;
          objection_style?: string;
          response_patterns?: string[];
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      curriculum_modules: {
        Row: {
          id: string;
          number: number;
          title: string;
          description: string;
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          number: number;
          title: string;
          description: string;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          number?: number;
          title?: string;
          description?: string;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      lessons: {
        Row: {
          id: string;
          module_id: string;
          title: string;
          content: string;
          order: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          module_id: string;
          title: string;
          content: string;
          order: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          module_id?: string;
          title?: string;
          content?: string;
          order?: number;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'lessons_module_id_fkey';
            columns: ['module_id'];
            referencedRelation: 'curriculum_modules';
            referencedColumns: ['id'];
          }
        ];
      };
      training_scenarios: {
        Row: {
          id: string;
          module_id: string;
          title: string;
          description: string;
          persona_hint: string | null;
          difficulty: number;
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          module_id: string;
          title: string;
          description: string;
          persona_hint?: string | null;
          difficulty?: number;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          module_id?: string;
          title?: string;
          description?: string;
          persona_hint?: string | null;
          difficulty?: number;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'training_scenarios_module_id_fkey';
            columns: ['module_id'];
            referencedRelation: 'curriculum_modules';
            referencedColumns: ['id'];
          }
        ];
      };
      objections: {
        Row: {
          id: string;
          category: ObjectionCategory;
          text: string;
          suggested_responses: string[];
          difficulty: number;
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          category: ObjectionCategory;
          text: string;
          suggested_responses?: string[];
          difficulty?: number;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          category?: ObjectionCategory;
          text?: string;
          suggested_responses?: string[];
          difficulty?: number;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      training_sessions: {
        Row: {
          id: string;
          user_id: string;
          type: SessionType;
          module_id: string | null;
          scenario_id: string | null;
          status: SessionStatus;
          started_at: string;
          ended_at: string | null;
        };
        Insert: {
          id?: string;
          user_id: string;
          type: SessionType;
          module_id?: string | null;
          scenario_id?: string | null;
          status?: SessionStatus;
          started_at?: string;
          ended_at?: string | null;
        };
        Update: {
          id?: string;
          user_id?: string;
          type?: SessionType;
          module_id?: string | null;
          scenario_id?: string | null;
          status?: SessionStatus;
          started_at?: string;
          ended_at?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: 'training_sessions_user_id_fkey';
            columns: ['user_id'];
            referencedRelation: 'profiles';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'training_sessions_module_id_fkey';
            columns: ['module_id'];
            referencedRelation: 'curriculum_modules';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'training_sessions_scenario_id_fkey';
            columns: ['scenario_id'];
            referencedRelation: 'training_scenarios';
            referencedColumns: ['id'];
          }
        ];
      };
      transcripts: {
        Row: {
          id: string;
          session_id: string;
          duration: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          session_id: string;
          duration: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          session_id?: string;
          duration?: number;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'transcripts_session_id_fkey';
            columns: ['session_id'];
            referencedRelation: 'training_sessions';
            referencedColumns: ['id'];
          }
        ];
      };
      transcript_segments: {
        Row: {
          id: string;
          transcript_id: string;
          speaker: SpeakerType;
          text: string;
          start_time: number;
          end_time: number;
          confidence: number;
        };
        Insert: {
          id?: string;
          transcript_id: string;
          speaker: SpeakerType;
          text: string;
          start_time: number;
          end_time: number;
          confidence: number;
        };
        Update: {
          id?: string;
          transcript_id?: string;
          speaker?: SpeakerType;
          text?: string;
          start_time?: number;
          end_time?: number;
          confidence?: number;
        };
        Relationships: [
          {
            foreignKeyName: 'transcript_segments_transcript_id_fkey';
            columns: ['transcript_id'];
            referencedRelation: 'transcripts';
            referencedColumns: ['id'];
          }
        ];
      };
      session_scores: {
        Row: {
          id: string;
          session_id: string;
          overall_score: number;
          opening_score: number;
          discovery_score: number;
          objection_score: number;
          closing_score: number;
          feedback: string[];
          generated_at: string;
        };
        Insert: {
          id?: string;
          session_id: string;
          overall_score: number;
          opening_score: number;
          discovery_score: number;
          objection_score: number;
          closing_score: number;
          feedback?: string[];
          generated_at?: string;
        };
        Update: {
          id?: string;
          session_id?: string;
          overall_score?: number;
          opening_score?: number;
          discovery_score?: number;
          objection_score?: number;
          closing_score?: number;
          feedback?: string[];
          generated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'session_scores_session_id_fkey';
            columns: ['session_id'];
            referencedRelation: 'training_sessions';
            referencedColumns: ['id'];
          }
        ];
      };
      user_progress: {
        Row: {
          id: string;
          user_id: string;
          module_id: string;
          lesson_id: string | null;
          score: number | null;
          completed_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          module_id: string;
          lesson_id?: string | null;
          score?: number | null;
          completed_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          module_id?: string;
          lesson_id?: string | null;
          score?: number | null;
          completed_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'user_progress_user_id_fkey';
            columns: ['user_id'];
            referencedRelation: 'profiles';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'user_progress_module_id_fkey';
            columns: ['module_id'];
            referencedRelation: 'curriculum_modules';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'user_progress_lesson_id_fkey';
            columns: ['lesson_id'];
            referencedRelation: 'lessons';
            referencedColumns: ['id'];
          }
        ];
      };
      recordings: {
        Row: {
          id: string;
          user_id: string;
          filename: string;
          storage_url: string;
          duration: number | null;
          status: RecordingStatus;
          transcript_id: string | null;
          error_message: string | null;
          uploaded_at: string;
          processed_at: string | null;
        };
        Insert: {
          id?: string;
          user_id: string;
          filename: string;
          storage_url: string;
          duration?: number | null;
          status?: RecordingStatus;
          transcript_id?: string | null;
          error_message?: string | null;
          uploaded_at?: string;
          processed_at?: string | null;
        };
        Update: {
          id?: string;
          user_id?: string;
          filename?: string;
          storage_url?: string;
          duration?: number | null;
          status?: RecordingStatus;
          transcript_id?: string | null;
          error_message?: string | null;
          uploaded_at?: string;
          processed_at?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: 'recordings_user_id_fkey';
            columns: ['user_id'];
            referencedRelation: 'profiles';
            referencedColumns: ['id'];
          }
        ];
      };
    };
    Views: {};
    Functions: {
      get_user_role: {
        Args: Record<PropertyKey, never>;
        Returns: UserRole;
      };
      get_user_organization_id: {
        Args: Record<PropertyKey, never>;
        Returns: string;
      };
      is_admin: {
        Args: Record<PropertyKey, never>;
        Returns: boolean;
      };
      is_trainer_or_admin: {
        Args: Record<PropertyKey, never>;
        Returns: boolean;
      };
    };
    Enums: {
      user_role: UserRole;
      session_type: SessionType;
      session_status: SessionStatus;
      speaker_type: SpeakerType;
      personality_type: PersonalityType;
      objection_category: ObjectionCategory;
      recording_status: RecordingStatus;
    };
  };
}

// ===========================================
// Helper Types for easier usage
// ===========================================

export type Tables<T extends keyof Database['public']['Tables']> =
  Database['public']['Tables'][T]['Row'];

export type InsertTables<T extends keyof Database['public']['Tables']> =
  Database['public']['Tables'][T]['Insert'];

export type UpdateTables<T extends keyof Database['public']['Tables']> =
  Database['public']['Tables'][T]['Update'];

// Convenience type aliases
export type Organization = Tables<'organizations'>;
export type Profile = Tables<'profiles'>;
export type AIPersona = Tables<'ai_personas'>;
export type CurriculumModule = Tables<'curriculum_modules'>;
export type Lesson = Tables<'lessons'>;
export type TrainingScenario = Tables<'training_scenarios'>;
export type Objection = Tables<'objections'>;
export type TrainingSession = Tables<'training_sessions'>;
export type Transcript = Tables<'transcripts'>;
export type TranscriptSegment = Tables<'transcript_segments'>;
export type SessionScores = Tables<'session_scores'>;
export type UserProgress = Tables<'user_progress'>;
export type Recording = Tables<'recordings'>;

// Insert types
export type OrganizationInsert = InsertTables<'organizations'>;
export type ProfileInsert = InsertTables<'profiles'>;
export type AIPersonaInsert = InsertTables<'ai_personas'>;
export type CurriculumModuleInsert = InsertTables<'curriculum_modules'>;
export type LessonInsert = InsertTables<'lessons'>;
export type TrainingScenarioInsert = InsertTables<'training_scenarios'>;
export type ObjectionInsert = InsertTables<'objections'>;
export type TrainingSessionInsert = InsertTables<'training_sessions'>;
export type TranscriptInsert = InsertTables<'transcripts'>;
export type TranscriptSegmentInsert = InsertTables<'transcript_segments'>;
export type SessionScoresInsert = InsertTables<'session_scores'>;
export type UserProgressInsert = InsertTables<'user_progress'>;
export type RecordingInsert = InsertTables<'recordings'>;

// Update types
export type OrganizationUpdate = UpdateTables<'organizations'>;
export type ProfileUpdate = UpdateTables<'profiles'>;
export type AIPersonaUpdate = UpdateTables<'ai_personas'>;
export type CurriculumModuleUpdate = UpdateTables<'curriculum_modules'>;
export type LessonUpdate = UpdateTables<'lessons'>;
export type TrainingScenarioUpdate = UpdateTables<'training_scenarios'>;
export type ObjectionUpdate = UpdateTables<'objections'>;
export type TrainingSessionUpdate = UpdateTables<'training_sessions'>;
export type TranscriptUpdate = UpdateTables<'transcripts'>;
export type TranscriptSegmentUpdate = UpdateTables<'transcript_segments'>;
export type SessionScoresUpdate = UpdateTables<'session_scores'>;
export type UserProgressUpdate = UpdateTables<'user_progress'>;
export type RecordingUpdate = UpdateTables<'recordings'>;

// ===========================================
// Extended Types with Relations
// ===========================================

export interface TrainingSessionWithRelations extends TrainingSession {
  profile?: Profile;
  curriculum_module?: CurriculumModule;
  training_scenario?: TrainingScenario;
  transcript?: Transcript;
  session_scores?: SessionScores;
}

export interface TranscriptWithSegments extends Transcript {
  transcript_segments: TranscriptSegment[];
}

export interface CurriculumModuleWithLessons extends CurriculumModule {
  lessons: Lesson[];
  training_scenarios: TrainingScenario[];
}

export interface ProfileWithOrganization extends Profile {
  organization?: Organization;
}

export interface UserProgressWithRelations extends UserProgress {
  curriculum_module?: CurriculumModule;
  lesson?: Lesson;
}
