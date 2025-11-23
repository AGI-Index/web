-- ============================================
-- AGI Index Database Schema
-- ============================================
-- This file contains the complete database schema for the AGI Index platform.
-- Run this file first when setting up a new Supabase project.
--
-- Tables:
--   - profiles: User profile information
--   - questions: AGI milestone questions
--   - votes: User votes on questions
--
-- Features:
--   - Row Level Security (RLS) enabled on all tables
--   - Automatic profile creation on user signup
--   - Enum types for structured data
-- ============================================

-- ============================================
-- ENUMS
-- ============================================

-- Reason for marking a question as unsuitable
CREATE TYPE unsuitable_reason AS ENUM (
  'too_broad',
  'too_narrow',
  'duplicate',
  'other'
);

-- ============================================
-- TABLES
-- ============================================

-- User Profiles
-- Extends Supabase auth.users with additional profile information
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT,
  is_admin BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- AGI Milestone Questions
-- Stores questions that define AGI capabilities
CREATE TABLE questions (
  id SERIAL PRIMARY KEY,
  content TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('Linguistic', 'Multimodal')),
  author_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  
  -- Indexing status
  is_indexed BOOLEAN DEFAULT FALSE,
  
  -- Aggregated statistics (updated via triggers or periodic jobs)
  vote_count INTEGER DEFAULT 0,
  suitable_count INTEGER DEFAULT 0,
  achieved_count INTEGER DEFAULT 0,
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- User Votes on Questions
-- Stores individual user votes with detailed opinions
CREATE TABLE votes (
  id SERIAL PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  question_id INTEGER NOT NULL REFERENCES questions(id) ON DELETE CASCADE,
  
  -- Vote details
  is_suitable BOOLEAN,
  is_achieved BOOLEAN,
  weight INTEGER CHECK (weight >= 1 AND weight <= 3),
  unsuitable_reason unsuitable_reason,
  custom_reason TEXT,
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  -- Ensure one vote per user per question
  UNIQUE(user_id, question_id)
);

-- ============================================
-- INDEXES
-- ============================================

-- Improve query performance
CREATE INDEX idx_questions_is_indexed ON questions(is_indexed);
CREATE INDEX idx_questions_category ON questions(category);
CREATE INDEX idx_questions_created_at ON questions(created_at DESC);
CREATE INDEX idx_questions_vote_count ON questions(vote_count DESC);
CREATE INDEX idx_votes_user_id ON votes(user_id);
CREATE INDEX idx_votes_question_id ON votes(question_id);

-- ============================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================

-- Enable RLS on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE votes ENABLE ROW LEVEL SECURITY;

-- Profiles Policies
CREATE POLICY "Public profiles are viewable by everyone"
  ON profiles FOR SELECT
  USING (true);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);

-- Questions Policies
CREATE POLICY "Questions are viewable by everyone"
  ON questions FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can insert questions"
  ON questions FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Users can update own questions"
  ON questions FOR UPDATE
  USING (auth.uid() = author_id);

-- Votes Policies
CREATE POLICY "Votes are viewable by everyone"
  ON votes FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can insert votes"
  ON votes FOR INSERT
  WITH CHECK (auth.role() = 'authenticated' AND auth.uid() = user_id);

CREATE POLICY "Users can update own votes"
  ON votes FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own votes"
  ON votes FOR DELETE
  USING (auth.uid() = user_id);

-- ============================================
-- FUNCTIONS & TRIGGERS
-- ============================================

-- Function: Create profile on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email)
  VALUES (NEW.id, NEW.email);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger: Automatically create profile when user signs up
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Function: Update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers: Auto-update updated_at on all tables
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_questions_updated_at
  BEFORE UPDATE ON questions
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_votes_updated_at
  BEFORE UPDATE ON votes
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- INITIAL SETUP COMPLETE
-- ============================================
-- Next steps:
-- 1. Run 02_seed_questions.sql to add sample data (optional)
-- 2. Configure OAuth providers in Supabase dashboard
-- 3. Update .env.local with your Supabase credentials
-- ============================================