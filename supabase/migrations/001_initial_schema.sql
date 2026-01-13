-- ===========================================
-- Underdog AI - Supabase Database Schema
-- ===========================================
-- This migration creates all tables with Row Level Security (RLS)
-- Run this in the Supabase SQL Editor or via supabase db push

BEGIN;

-- ===========================================
-- Helper Functions
-- ===========================================

-- Function to auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ===========================================
-- ENUMS
-- ===========================================

CREATE TYPE user_role AS ENUM ('admin', 'trainer', 'trainee');
CREATE TYPE session_type AS ENUM ('roleplay', 'recording_analysis');
CREATE TYPE session_status AS ENUM ('active', 'completed', 'abandoned');
CREATE TYPE speaker_type AS ENUM ('trainee', 'ai', 'prospect');
CREATE TYPE personality_type AS ENUM ('skeptical', 'busy', 'interested', 'hostile', 'friendly');
CREATE TYPE objection_category AS ENUM ('common', 'industry', 'personality');
CREATE TYPE recording_status AS ENUM ('uploading', 'processing', 'transcribed', 'analyzed', 'failed');

-- ===========================================
-- Stream 1: Core Platform Tables
-- ===========================================

-- Organizations
CREATE TABLE organizations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE TRIGGER organizations_updated_at
  BEFORE UPDATE ON organizations
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- Profiles (linked to auth.users)
CREATE TABLE profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  role user_role DEFAULT 'trainee' NOT NULL,
  organization_id UUID REFERENCES organizations(id),
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE INDEX idx_profiles_organization ON profiles(organization_id);
CREATE INDEX idx_profiles_email ON profiles(email);

CREATE TRIGGER profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- Auto-create profile on user signup
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'name', NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1))
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- ===========================================
-- Stream 2: AI Role-Play Engine Tables
-- ===========================================

-- AI Personas
CREATE TABLE ai_personas (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  personality personality_type NOT NULL,
  mood_min TEXT NOT NULL CHECK (mood_min IN ('low', 'medium', 'high')),
  mood_max TEXT NOT NULL CHECK (mood_max IN ('low', 'medium', 'high')),
  objection_style TEXT NOT NULL,
  response_patterns TEXT[] DEFAULT '{}',
  is_active BOOLEAN DEFAULT true NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE TRIGGER ai_personas_updated_at
  BEFORE UPDATE ON ai_personas
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ===========================================
-- Stream 3: Curriculum & Content Tables
-- ===========================================

-- Curriculum Modules
CREATE TABLE curriculum_modules (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  number INT UNIQUE NOT NULL CHECK (number >= 1 AND number <= 12),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  is_active BOOLEAN DEFAULT true NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE TRIGGER curriculum_modules_updated_at
  BEFORE UPDATE ON curriculum_modules
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- Lessons
CREATE TABLE lessons (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  module_id UUID REFERENCES curriculum_modules(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  "order" INT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  UNIQUE(module_id, "order")
);

CREATE INDEX idx_lessons_module ON lessons(module_id);

CREATE TRIGGER lessons_updated_at
  BEFORE UPDATE ON lessons
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- Training Scenarios
CREATE TABLE training_scenarios (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  module_id UUID REFERENCES curriculum_modules(id) NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  persona_hint TEXT,
  difficulty INT DEFAULT 3 CHECK (difficulty >= 1 AND difficulty <= 5),
  is_active BOOLEAN DEFAULT true NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE INDEX idx_training_scenarios_module ON training_scenarios(module_id);

CREATE TRIGGER training_scenarios_updated_at
  BEFORE UPDATE ON training_scenarios
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- Objections
CREATE TABLE objections (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  category objection_category NOT NULL,
  text TEXT NOT NULL,
  suggested_responses TEXT[] DEFAULT '{}',
  difficulty INT DEFAULT 3 CHECK (difficulty >= 1 AND difficulty <= 5),
  is_active BOOLEAN DEFAULT true NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE INDEX idx_objections_category ON objections(category);

CREATE TRIGGER objections_updated_at
  BEFORE UPDATE ON objections
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ===========================================
-- Training Sessions & Transcripts
-- ===========================================

-- Training Sessions
CREATE TABLE training_sessions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  type session_type NOT NULL,
  module_id UUID REFERENCES curriculum_modules(id),
  scenario_id UUID REFERENCES training_scenarios(id),
  status session_status DEFAULT 'active' NOT NULL,
  started_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  ended_at TIMESTAMPTZ
);

CREATE INDEX idx_training_sessions_user ON training_sessions(user_id);
CREATE INDEX idx_training_sessions_module ON training_sessions(module_id);

-- Transcripts
CREATE TABLE transcripts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  session_id UUID REFERENCES training_sessions(id) ON DELETE CASCADE UNIQUE NOT NULL,
  duration FLOAT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Transcript Segments
CREATE TABLE transcript_segments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  transcript_id UUID REFERENCES transcripts(id) ON DELETE CASCADE NOT NULL,
  speaker speaker_type NOT NULL,
  text TEXT NOT NULL,
  start_time FLOAT NOT NULL,
  end_time FLOAT NOT NULL,
  confidence FLOAT NOT NULL
);

CREATE INDEX idx_transcript_segments_transcript ON transcript_segments(transcript_id);

-- ===========================================
-- Stream 4: Analytics & Feedback Tables
-- ===========================================

-- Session Scores
CREATE TABLE session_scores (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  session_id UUID REFERENCES training_sessions(id) ON DELETE CASCADE UNIQUE NOT NULL,
  overall_score FLOAT NOT NULL CHECK (overall_score >= 0 AND overall_score <= 100),
  opening_score FLOAT NOT NULL CHECK (opening_score >= 0 AND opening_score <= 100),
  discovery_score FLOAT NOT NULL CHECK (discovery_score >= 0 AND discovery_score <= 100),
  objection_score FLOAT NOT NULL CHECK (objection_score >= 0 AND objection_score <= 100),
  closing_score FLOAT NOT NULL CHECK (closing_score >= 0 AND closing_score <= 100),
  feedback TEXT[] DEFAULT '{}',
  generated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- User Progress
CREATE TABLE user_progress (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  module_id UUID REFERENCES curriculum_modules(id) ON DELETE CASCADE NOT NULL,
  lesson_id UUID REFERENCES lessons(id) ON DELETE SET NULL,
  score FLOAT CHECK (score >= 0 AND score <= 100),
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  UNIQUE(user_id, module_id, lesson_id)
);

CREATE INDEX idx_user_progress_user ON user_progress(user_id);
CREATE INDEX idx_user_progress_module ON user_progress(module_id);

CREATE TRIGGER user_progress_updated_at
  BEFORE UPDATE ON user_progress
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ===========================================
-- Stream 5: Call Recordings Tables
-- ===========================================

-- Recordings
CREATE TABLE recordings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  filename TEXT NOT NULL,
  storage_url TEXT NOT NULL,
  duration FLOAT,
  status recording_status DEFAULT 'uploading' NOT NULL,
  transcript_id UUID,
  error_message TEXT,
  uploaded_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  processed_at TIMESTAMPTZ
);

CREATE INDEX idx_recordings_user ON recordings(user_id);
CREATE INDEX idx_recordings_status ON recordings(status);

COMMIT;
