-- ============================================
-- Migration: History Visualization & Extended Metrics
-- Description: Updates daily_metrics schema, agi_stats, and adds synchronization triggers
-- ============================================

-- 1. Update agi_stats table (Add new columns)
ALTER TABLE agi_stats ADD COLUMN IF NOT EXISTS total_users INTEGER DEFAULT 0;
ALTER TABLE agi_stats ADD COLUMN IF NOT EXISTS index_question_count INTEGER DEFAULT 0;
ALTER TABLE agi_stats ADD COLUMN IF NOT EXISTS candidate_question_count INTEGER DEFAULT 0;

-- 2. Recreate daily_metrics table (with new columns)
DROP TABLE IF EXISTS daily_metrics;

CREATE TABLE daily_metrics (
  date DATE PRIMARY KEY DEFAULT CURRENT_DATE,
  overall_rate NUMERIC(5,2),
  linguistic_rate NUMERIC(5,2),
  multimodal_rate NUMERIC(5,2),
  linguistic_count INTEGER,
  multimodal_count INTEGER,
  total_votes INTEGER,
  total_users INTEGER,
  index_question_count INTEGER,
  candidate_question_count INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Enable RLS and add policies
ALTER TABLE daily_metrics ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Daily metrics are viewable by everyone" ON daily_metrics;
CREATE POLICY "Daily metrics are viewable by everyone" ON daily_metrics FOR SELECT USING (true);

-- 4. Update recalculate_agi_stats function
CREATE OR REPLACE FUNCTION recalculate_agi_stats()
RETURNS TRIGGER AS $$
DECLARE
  v_linguistic_rate NUMERIC(5,2);
  v_multimodal_rate NUMERIC(5,2);
  v_overall_rate NUMERIC(5,2);
  v_linguistic_count INTEGER;
  v_multimodal_count INTEGER;
  v_total_votes INTEGER;
  v_total_users INTEGER;
  v_index_question_count INTEGER;
  v_candidate_question_count INTEGER;
BEGIN
  -- Rate calculations
  SELECT
    COALESCE(AVG(CASE WHEN vote_count > 0 THEN (achieved_count::NUMERIC / vote_count) * 100 ELSE 0 END), 0),
    COUNT(*)
  INTO v_linguistic_rate, v_linguistic_count
  FROM questions
  WHERE is_indexed = true AND category = 'linguistic';

  SELECT
    COALESCE(AVG(CASE WHEN vote_count > 0 THEN (achieved_count::NUMERIC / vote_count) * 100 ELSE 0 END), 0),
    COUNT(*)
  INTO v_multimodal_rate, v_multimodal_count
  FROM questions
  WHERE is_indexed = true AND category = 'multimodal';

  IF (v_linguistic_count + v_multimodal_count) > 0 THEN
    v_overall_rate := (
      (v_linguistic_rate * v_linguistic_count) + (v_multimodal_rate * v_multimodal_count)
    ) / (v_linguistic_count + v_multimodal_count);
  ELSE
    v_overall_rate := 0;
  END IF;

  -- New Metrics Calculations
  SELECT COALESCE(SUM(vote_count), 0) INTO v_total_votes FROM questions;
  SELECT COUNT(DISTINCT user_id) INTO v_total_users FROM votes;
  SELECT COUNT(*) INTO v_index_question_count FROM questions WHERE is_indexed = true;
  SELECT COUNT(*) INTO v_candidate_question_count FROM questions WHERE is_indexed = false;

  INSERT INTO agi_stats (
    id, overall_rate, linguistic_rate, multimodal_rate, 
    linguistic_count, multimodal_count, total_votes, 
    total_users, index_question_count, candidate_question_count, updated_at
  )
  VALUES (
    1, v_overall_rate, v_linguistic_rate, v_multimodal_rate, 
    v_linguistic_count, v_multimodal_count, v_total_votes, 
    v_total_users, v_index_question_count, v_candidate_question_count, NOW()
  )
  ON CONFLICT (id) DO UPDATE SET
    overall_rate = EXCLUDED.overall_rate,
    linguistic_rate = EXCLUDED.linguistic_rate,
    multimodal_rate = EXCLUDED.multimodal_rate,
    linguistic_count = EXCLUDED.linguistic_count,
    multimodal_count = EXCLUDED.multimodal_count,
    total_votes = EXCLUDED.total_votes,
    total_users = EXCLUDED.total_users,
    index_question_count = EXCLUDED.index_question_count,
    candidate_question_count = EXCLUDED.candidate_question_count,
    updated_at = EXCLUDED.updated_at;

  RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 5. Create/Update sync function
CREATE OR REPLACE FUNCTION sync_daily_metrics()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO daily_metrics (
    date,
    overall_rate,
    linguistic_rate,
    multimodal_rate,
    linguistic_count,
    multimodal_count,
    total_votes,
    total_users,
    index_question_count,
    candidate_question_count,
    updated_at
  )
  VALUES (
    CURRENT_DATE,
    NEW.overall_rate,
    NEW.linguistic_rate,
    NEW.multimodal_rate,
    NEW.linguistic_count,
    NEW.multimodal_count,
    NEW.total_votes,
    NEW.total_users,
    NEW.index_question_count,
    NEW.candidate_question_count,
    NOW()
  )
  ON CONFLICT (date) DO UPDATE SET
    overall_rate = EXCLUDED.overall_rate,
    linguistic_rate = EXCLUDED.linguistic_rate,
    multimodal_rate = EXCLUDED.multimodal_rate,
    linguistic_count = EXCLUDED.linguistic_count,
    multimodal_count = EXCLUDED.multimodal_count,
    total_votes = EXCLUDED.total_votes,
    total_users = EXCLUDED.total_users,
    index_question_count = EXCLUDED.index_question_count,
    candidate_question_count = EXCLUDED.candidate_question_count,
    updated_at = EXCLUDED.updated_at;
  
  RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 6. Create Trigger
DROP TRIGGER IF EXISTS trigger_sync_daily_metrics ON agi_stats;

CREATE TRIGGER trigger_sync_daily_metrics
  AFTER INSERT OR UPDATE ON agi_stats
  FOR EACH ROW
  EXECUTE FUNCTION sync_daily_metrics();

-- 7. Recalculate everything to populate new columns
-- This will also trigger sync_daily_metrics to update today's row
UPDATE questions SET id = id WHERE false; -- No-op to just ensure triggers exist? No, we need to call the function.

-- We can just call the trigger function manually or update a dummy vote. 
-- Better: create a callable function in schema (we did: do_recalculate_agi_stats) and call it.
-- But since we can't easily call that from here without it being in the migration script explicitly if it wasn't there before.
-- We updated the trigger function `recalculate_agi_stats`, so any vote will fix it.
-- Let's try to force a recalc if possible, or just rely on the next vote.
-- Actually, let's just run the logic once here to backfill.

DO $$
DECLARE
  v_linguistic_rate NUMERIC(5,2);
  v_multimodal_rate NUMERIC(5,2);
  v_overall_rate NUMERIC(5,2);
  v_linguistic_count INTEGER;
  v_multimodal_count INTEGER;
  v_total_votes INTEGER;
  v_total_users INTEGER;
  v_index_question_count INTEGER;
  v_candidate_question_count INTEGER;
BEGIN
  -- Rate calculations
  SELECT
    COALESCE(AVG(CASE WHEN vote_count > 0 THEN (achieved_count::NUMERIC / vote_count) * 100 ELSE 0 END), 0),
    COUNT(*)
  INTO v_linguistic_rate, v_linguistic_count
  FROM questions
  WHERE is_indexed = true AND category = 'linguistic';

  SELECT
    COALESCE(AVG(CASE WHEN vote_count > 0 THEN (achieved_count::NUMERIC / vote_count) * 100 ELSE 0 END), 0),
    COUNT(*)
  INTO v_multimodal_rate, v_multimodal_count
  FROM questions
  WHERE is_indexed = true AND category = 'multimodal';

  IF (v_linguistic_count + v_multimodal_count) > 0 THEN
    v_overall_rate := (
      (v_linguistic_rate * v_linguistic_count) + (v_multimodal_rate * v_multimodal_count)
    ) / (v_linguistic_count + v_multimodal_count);
  ELSE
    v_overall_rate := 0;
  END IF;

  SELECT COALESCE(SUM(vote_count), 0) INTO v_total_votes FROM questions;
  SELECT COUNT(DISTINCT user_id) INTO v_total_users FROM votes;
  SELECT COUNT(*) INTO v_index_question_count FROM questions WHERE is_indexed = true;
  SELECT COUNT(*) INTO v_candidate_question_count FROM questions WHERE is_indexed = false;

  INSERT INTO agi_stats (
    id, overall_rate, linguistic_rate, multimodal_rate, 
    linguistic_count, multimodal_count, total_votes, 
    total_users, index_question_count, candidate_question_count, updated_at
  )
  VALUES (
    1, v_overall_rate, v_linguistic_rate, v_multimodal_rate, 
    v_linguistic_count, v_multimodal_count, v_total_votes, 
    v_total_users, v_index_question_count, v_candidate_question_count, NOW()
  )
  ON CONFLICT (id) DO UPDATE SET
    overall_rate = EXCLUDED.overall_rate,
    linguistic_rate = EXCLUDED.linguistic_rate,
    multimodal_rate = EXCLUDED.multimodal_rate,
    linguistic_count = EXCLUDED.linguistic_count,
    multimodal_count = EXCLUDED.multimodal_count,
    total_votes = EXCLUDED.total_votes,
    total_users = EXCLUDED.total_users,
    index_question_count = EXCLUDED.index_question_count,
    candidate_question_count = EXCLUDED.candidate_question_count,
    updated_at = EXCLUDED.updated_at;
END $$;

