-- ===========================================
-- Underdog AI - Row Level Security Policies
-- ===========================================
-- This migration enables RLS and creates policies for all tables

BEGIN;

-- ===========================================
-- Enable RLS on all tables
-- ===========================================

ALTER TABLE organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_personas ENABLE ROW LEVEL SECURITY;
ALTER TABLE curriculum_modules ENABLE ROW LEVEL SECURITY;
ALTER TABLE lessons ENABLE ROW LEVEL SECURITY;
ALTER TABLE training_scenarios ENABLE ROW LEVEL SECURITY;
ALTER TABLE objections ENABLE ROW LEVEL SECURITY;
ALTER TABLE training_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE transcripts ENABLE ROW LEVEL SECURITY;
ALTER TABLE transcript_segments ENABLE ROW LEVEL SECURITY;
ALTER TABLE session_scores ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE recordings ENABLE ROW LEVEL SECURITY;

-- ===========================================
-- Helper function to check user role
-- ===========================================

CREATE OR REPLACE FUNCTION get_user_role()
RETURNS user_role AS $$
  SELECT role FROM profiles WHERE id = auth.uid();
$$ LANGUAGE sql SECURITY DEFINER STABLE;

CREATE OR REPLACE FUNCTION get_user_organization_id()
RETURNS UUID AS $$
  SELECT organization_id FROM profiles WHERE id = auth.uid();
$$ LANGUAGE sql SECURITY DEFINER STABLE;

CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN AS $$
  SELECT get_user_role() = 'admin';
$$ LANGUAGE sql SECURITY DEFINER STABLE;

CREATE OR REPLACE FUNCTION is_trainer_or_admin()
RETURNS BOOLEAN AS $$
  SELECT get_user_role() IN ('admin', 'trainer');
$$ LANGUAGE sql SECURITY DEFINER STABLE;

-- ===========================================
-- Organizations Policies
-- ===========================================

-- SELECT: Users can view their own organization
CREATE POLICY "Users can view own organization" ON organizations
  FOR SELECT USING (
    id = get_user_organization_id() OR is_admin()
  );

-- INSERT: Only admins can create organizations
CREATE POLICY "Admins can create organizations" ON organizations
  FOR INSERT WITH CHECK (is_admin());

-- UPDATE: Only admins can update organizations
CREATE POLICY "Admins can update organizations" ON organizations
  FOR UPDATE USING (is_admin());

-- DELETE: Only admins can delete organizations
CREATE POLICY "Admins can delete organizations" ON organizations
  FOR DELETE USING (is_admin());

-- ===========================================
-- Profiles Policies
-- ===========================================

-- SELECT: Users can view profiles in their organization
CREATE POLICY "Users can view profiles in own org" ON profiles
  FOR SELECT USING (
    auth.uid() = id OR
    organization_id = get_user_organization_id() OR
    is_admin()
  );

-- INSERT: Handled by trigger on auth.users
CREATE POLICY "System can create profiles" ON profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- UPDATE: Users can update their own profile, admins can update any
CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (
    auth.uid() = id OR is_admin()
  );

-- DELETE: Only admins can delete profiles
CREATE POLICY "Admins can delete profiles" ON profiles
  FOR DELETE USING (is_admin());

-- ===========================================
-- AI Personas Policies
-- ===========================================

-- SELECT: All authenticated users can view active personas
CREATE POLICY "Authenticated users can view personas" ON ai_personas
  FOR SELECT USING (
    auth.role() = 'authenticated' AND (is_active = true OR is_admin())
  );

-- INSERT: Only admins can create personas
CREATE POLICY "Admins can create personas" ON ai_personas
  FOR INSERT WITH CHECK (is_admin());

-- UPDATE: Only admins can update personas
CREATE POLICY "Admins can update personas" ON ai_personas
  FOR UPDATE USING (is_admin());

-- DELETE: Only admins can delete personas
CREATE POLICY "Admins can delete personas" ON ai_personas
  FOR DELETE USING (is_admin());

-- ===========================================
-- Curriculum Modules Policies
-- ===========================================

-- SELECT: All authenticated users can view active modules
CREATE POLICY "Authenticated users can view modules" ON curriculum_modules
  FOR SELECT USING (
    auth.role() = 'authenticated' AND (is_active = true OR is_trainer_or_admin())
  );

-- INSERT: Trainers and admins can create modules
CREATE POLICY "Trainers can create modules" ON curriculum_modules
  FOR INSERT WITH CHECK (is_trainer_or_admin());

-- UPDATE: Trainers and admins can update modules
CREATE POLICY "Trainers can update modules" ON curriculum_modules
  FOR UPDATE USING (is_trainer_or_admin());

-- DELETE: Only admins can delete modules
CREATE POLICY "Admins can delete modules" ON curriculum_modules
  FOR DELETE USING (is_admin());

-- ===========================================
-- Lessons Policies
-- ===========================================

-- SELECT: All authenticated users can view lessons
CREATE POLICY "Authenticated users can view lessons" ON lessons
  FOR SELECT USING (auth.role() = 'authenticated');

-- INSERT: Trainers and admins can create lessons
CREATE POLICY "Trainers can create lessons" ON lessons
  FOR INSERT WITH CHECK (is_trainer_or_admin());

-- UPDATE: Trainers and admins can update lessons
CREATE POLICY "Trainers can update lessons" ON lessons
  FOR UPDATE USING (is_trainer_or_admin());

-- DELETE: Only admins can delete lessons
CREATE POLICY "Admins can delete lessons" ON lessons
  FOR DELETE USING (is_admin());

-- ===========================================
-- Training Scenarios Policies
-- ===========================================

-- SELECT: All authenticated users can view active scenarios
CREATE POLICY "Authenticated users can view scenarios" ON training_scenarios
  FOR SELECT USING (
    auth.role() = 'authenticated' AND (is_active = true OR is_trainer_or_admin())
  );

-- INSERT: Trainers and admins can create scenarios
CREATE POLICY "Trainers can create scenarios" ON training_scenarios
  FOR INSERT WITH CHECK (is_trainer_or_admin());

-- UPDATE: Trainers and admins can update scenarios
CREATE POLICY "Trainers can update scenarios" ON training_scenarios
  FOR UPDATE USING (is_trainer_or_admin());

-- DELETE: Only admins can delete scenarios
CREATE POLICY "Admins can delete scenarios" ON training_scenarios
  FOR DELETE USING (is_admin());

-- ===========================================
-- Objections Policies
-- ===========================================

-- SELECT: All authenticated users can view active objections
CREATE POLICY "Authenticated users can view objections" ON objections
  FOR SELECT USING (
    auth.role() = 'authenticated' AND (is_active = true OR is_trainer_or_admin())
  );

-- INSERT: Trainers and admins can create objections
CREATE POLICY "Trainers can create objections" ON objections
  FOR INSERT WITH CHECK (is_trainer_or_admin());

-- UPDATE: Trainers and admins can update objections
CREATE POLICY "Trainers can update objections" ON objections
  FOR UPDATE USING (is_trainer_or_admin());

-- DELETE: Only admins can delete objections
CREATE POLICY "Admins can delete objections" ON objections
  FOR DELETE USING (is_admin());

-- ===========================================
-- Training Sessions Policies
-- ===========================================

-- SELECT: Users can view their own sessions, trainers can view org sessions
CREATE POLICY "Users can view own sessions" ON training_sessions
  FOR SELECT USING (
    user_id = auth.uid() OR
    is_trainer_or_admin()
  );

-- INSERT: Users can create their own sessions
CREATE POLICY "Users can create own sessions" ON training_sessions
  FOR INSERT WITH CHECK (user_id = auth.uid());

-- UPDATE: Users can update their own sessions
CREATE POLICY "Users can update own sessions" ON training_sessions
  FOR UPDATE USING (user_id = auth.uid() OR is_trainer_or_admin());

-- DELETE: Users can delete their own sessions, admins can delete any
CREATE POLICY "Users can delete own sessions" ON training_sessions
  FOR DELETE USING (user_id = auth.uid() OR is_admin());

-- ===========================================
-- Transcripts Policies
-- ===========================================

-- SELECT: Users can view transcripts for their own sessions
CREATE POLICY "Users can view own transcripts" ON transcripts
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM training_sessions
      WHERE training_sessions.id = transcripts.session_id
      AND (training_sessions.user_id = auth.uid() OR is_trainer_or_admin())
    )
  );

-- INSERT: System can create transcripts for user's sessions
CREATE POLICY "Users can create transcripts for own sessions" ON transcripts
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM training_sessions
      WHERE training_sessions.id = session_id
      AND training_sessions.user_id = auth.uid()
    )
  );

-- UPDATE: Users can update their own transcripts
CREATE POLICY "Users can update own transcripts" ON transcripts
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM training_sessions
      WHERE training_sessions.id = transcripts.session_id
      AND training_sessions.user_id = auth.uid()
    )
  );

-- DELETE: Users can delete their own transcripts
CREATE POLICY "Users can delete own transcripts" ON transcripts
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM training_sessions
      WHERE training_sessions.id = transcripts.session_id
      AND (training_sessions.user_id = auth.uid() OR is_admin())
    )
  );

-- ===========================================
-- Transcript Segments Policies
-- ===========================================

-- SELECT: Users can view segments for their own transcripts
CREATE POLICY "Users can view own transcript segments" ON transcript_segments
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM transcripts
      JOIN training_sessions ON training_sessions.id = transcripts.session_id
      WHERE transcripts.id = transcript_segments.transcript_id
      AND (training_sessions.user_id = auth.uid() OR is_trainer_or_admin())
    )
  );

-- INSERT: System can create segments for user's transcripts
CREATE POLICY "Users can create segments for own transcripts" ON transcript_segments
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM transcripts
      JOIN training_sessions ON training_sessions.id = transcripts.session_id
      WHERE transcripts.id = transcript_id
      AND training_sessions.user_id = auth.uid()
    )
  );

-- UPDATE/DELETE: Handled via cascade from transcripts

-- ===========================================
-- Session Scores Policies
-- ===========================================

-- SELECT: Users can view their own scores, trainers can view all
CREATE POLICY "Users can view own scores" ON session_scores
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM training_sessions
      WHERE training_sessions.id = session_scores.session_id
      AND (training_sessions.user_id = auth.uid() OR is_trainer_or_admin())
    )
  );

-- INSERT: System can create scores (typically done by AI engine)
CREATE POLICY "System can create scores" ON session_scores
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM training_sessions
      WHERE training_sessions.id = session_id
      AND training_sessions.user_id = auth.uid()
    ) OR is_trainer_or_admin()
  );

-- UPDATE: Trainers and admins can update scores
CREATE POLICY "Trainers can update scores" ON session_scores
  FOR UPDATE USING (is_trainer_or_admin());

-- DELETE: Only admins can delete scores
CREATE POLICY "Admins can delete scores" ON session_scores
  FOR DELETE USING (is_admin());

-- ===========================================
-- User Progress Policies
-- ===========================================

-- SELECT: Users can view their own progress, trainers can view org progress
CREATE POLICY "Users can view own progress" ON user_progress
  FOR SELECT USING (
    user_id = auth.uid() OR is_trainer_or_admin()
  );

-- INSERT: Users can create their own progress records
CREATE POLICY "Users can create own progress" ON user_progress
  FOR INSERT WITH CHECK (user_id = auth.uid());

-- UPDATE: Users can update their own progress
CREATE POLICY "Users can update own progress" ON user_progress
  FOR UPDATE USING (user_id = auth.uid() OR is_trainer_or_admin());

-- DELETE: Users can delete their own progress, admins can delete any
CREATE POLICY "Users can delete own progress" ON user_progress
  FOR DELETE USING (user_id = auth.uid() OR is_admin());

-- ===========================================
-- Recordings Policies
-- ===========================================

-- SELECT: Users can view their own recordings
CREATE POLICY "Users can view own recordings" ON recordings
  FOR SELECT USING (
    user_id = auth.uid() OR is_trainer_or_admin()
  );

-- INSERT: Users can upload their own recordings
CREATE POLICY "Users can create own recordings" ON recordings
  FOR INSERT WITH CHECK (user_id = auth.uid());

-- UPDATE: Users can update their own recordings
CREATE POLICY "Users can update own recordings" ON recordings
  FOR UPDATE USING (user_id = auth.uid() OR is_trainer_or_admin());

-- DELETE: Users can delete their own recordings
CREATE POLICY "Users can delete own recordings" ON recordings
  FOR DELETE USING (user_id = auth.uid() OR is_admin());

COMMIT;
