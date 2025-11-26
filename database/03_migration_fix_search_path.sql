-- ============================================
-- Migration: Fix RLS security and performance issues
-- ============================================
-- 1. Fix search_path security warning for SECURITY DEFINER functions
-- 2. Fix auth function re-evaluation performance issue
-- 3. Fix duplicate permissive policies
-- ============================================

-- ============================================
-- 1. Fix search_path for SECURITY DEFINER functions
-- ============================================
ALTER FUNCTION public.handle_new_user() SET search_path = public;
ALTER FUNCTION public.update_question_stats() SET search_path = public;
ALTER FUNCTION public.recalculate_agi_stats() SET search_path = public;
ALTER FUNCTION public.do_recalculate_agi_stats() SET search_path = public;
ALTER FUNCTION public.sync_daily_metrics() SET search_path = public;

-- ============================================
-- 2. Fix profiles RLS (auth function caching)
-- ============================================
DROP POLICY IF EXISTS "Users can insert their own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;

CREATE POLICY "Users can insert their own profile" ON profiles
  FOR INSERT WITH CHECK ((SELECT auth.uid()) = id);
CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING ((SELECT auth.uid()) = id);

-- ============================================
-- 3. Fix questions RLS (merge SELECT policies + split ALL policy)
-- ============================================
DROP POLICY IF EXISTS "Public read approved" ON questions;
DROP POLICY IF EXISTS "Authors read own" ON questions;
DROP POLICY IF EXISTS "Admin full access" ON questions;
DROP POLICY IF EXISTS "Admin select" ON questions;
DROP POLICY IF EXISTS "Authenticated users can insert questions" ON questions;

-- Merge all SELECT policies into one for performance
CREATE POLICY "Questions read policy" ON questions FOR SELECT
  USING (
    status = 'approved'
    OR (SELECT auth.uid()) = author_id
    OR (SELECT is_admin FROM profiles WHERE id = (SELECT auth.uid())) = true
  );
CREATE POLICY "Admin update" ON questions FOR UPDATE
  USING ((SELECT is_admin FROM profiles WHERE id = (SELECT auth.uid())) = true);
CREATE POLICY "Admin delete" ON questions FOR DELETE
  USING ((SELECT is_admin FROM profiles WHERE id = (SELECT auth.uid())) = true);
CREATE POLICY "Authenticated users can insert questions" ON questions FOR INSERT
  WITH CHECK ((SELECT auth.role()) = 'authenticated');

-- ============================================
-- 4. Fix votes RLS (auth function caching)
-- ============================================
DROP POLICY IF EXISTS "Authenticated users can vote" ON votes;
DROP POLICY IF EXISTS "Users can update own vote" ON votes;

CREATE POLICY "Authenticated users can vote" ON votes
  FOR INSERT WITH CHECK ((SELECT auth.role()) = 'authenticated');
CREATE POLICY "Users can update own vote" ON votes
  FOR UPDATE USING ((SELECT auth.uid()) = user_id);

-- ============================================
-- 5. Fix question_translations RLS (split ALL policy)
-- ============================================
DROP POLICY IF EXISTS "Only admins can modify translations" ON question_translations;

CREATE POLICY "Only admins can insert translations" ON question_translations FOR INSERT
  WITH CHECK ((SELECT is_admin FROM profiles WHERE id = (SELECT auth.uid())) = true);
CREATE POLICY "Only admins can update translations" ON question_translations FOR UPDATE
  USING ((SELECT is_admin FROM profiles WHERE id = (SELECT auth.uid())) = true);
CREATE POLICY "Only admins can delete translations" ON question_translations FOR DELETE
  USING ((SELECT is_admin FROM profiles WHERE id = (SELECT auth.uid())) = true);
