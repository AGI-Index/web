-- ============================================
-- Migration: Merge questions SELECT policies
-- ============================================
-- Merges multiple permissive SELECT policies into one
-- for better query performance.
--
-- Prerequisite: 03_migration_fix_search_path.sql must be applied first
-- ============================================

-- Drop existing SELECT policies
DROP POLICY IF EXISTS "Public read approved" ON questions;
DROP POLICY IF EXISTS "Authors read own" ON questions;
DROP POLICY IF EXISTS "Admin select" ON questions;

-- Create single merged SELECT policy
CREATE POLICY "Questions read policy" ON questions FOR SELECT
  USING (
    status = 'approved'
    OR (SELECT auth.uid()) = author_id
    OR (SELECT is_admin FROM profiles WHERE id = (SELECT auth.uid())) = true
  );
