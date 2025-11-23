-- ============================================
-- AGI Stats Table with Auto-Update Triggers
-- ============================================
-- This creates a single-row table that stores pre-calculated AGI achievement rates.
-- Rates are automatically updated whenever votes change.
--
-- Run this after 01_schema.sql
-- ============================================

-- ============================================
-- TABLE: agi_stats
-- ============================================
-- Single-row table storing aggregated AGI achievement statistics

CREATE TABLE IF NOT EXISTS agi_stats (
  id INTEGER PRIMARY KEY DEFAULT 1 CHECK (id = 1), -- Ensures single row
  overall_rate NUMERIC(5,2) DEFAULT 0,
  linguistic_rate NUMERIC(5,2) DEFAULT 0,
  multimodal_rate NUMERIC(5,2) DEFAULT 0,
  linguistic_count INTEGER DEFAULT 0,  -- Number of linguistic index questions
  multimodal_count INTEGER DEFAULT 0,  -- Number of multimodal index questions
  total_votes INTEGER DEFAULT 0,       -- Total votes across all index questions
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE agi_stats ENABLE ROW LEVEL SECURITY;

-- Everyone can read stats
CREATE POLICY "AGI stats are viewable by everyone"
  ON agi_stats FOR SELECT
  USING (true);

-- ============================================
-- FUNCTION: recalculate_agi_stats
-- ============================================
-- Recalculates all AGI statistics from index questions
-- Called by trigger whenever votes change

CREATE OR REPLACE FUNCTION recalculate_agi_stats()
RETURNS TRIGGER AS $$
DECLARE
  v_linguistic_rate NUMERIC(5,2);
  v_multimodal_rate NUMERIC(5,2);
  v_overall_rate NUMERIC(5,2);
  v_linguistic_count INTEGER;
  v_multimodal_count INTEGER;
  v_total_votes INTEGER;
BEGIN
  -- Calculate linguistic rate (average achievement rate for linguistic index questions)
  SELECT
    COALESCE(AVG(CASE WHEN vote_count > 0 THEN (achieved_count::NUMERIC / vote_count) * 100 ELSE 0 END), 0),
    COUNT(*)
  INTO v_linguistic_rate, v_linguistic_count
  FROM questions
  WHERE is_indexed = true AND category = 'linguistic';

  -- Calculate multimodal rate (average achievement rate for multimodal index questions)
  SELECT
    COALESCE(AVG(CASE WHEN vote_count > 0 THEN (achieved_count::NUMERIC / vote_count) * 100 ELSE 0 END), 0),
    COUNT(*)
  INTO v_multimodal_rate, v_multimodal_count
  FROM questions
  WHERE is_indexed = true AND category = 'multimodal';

  -- Calculate overall rate (weighted average)
  IF (v_linguistic_count + v_multimodal_count) > 0 THEN
    v_overall_rate := (
      (v_linguistic_rate * v_linguistic_count) + (v_multimodal_rate * v_multimodal_count)
    ) / (v_linguistic_count + v_multimodal_count);
  ELSE
    v_overall_rate := 0;
  END IF;

  -- Get total votes on index questions
  SELECT COALESCE(SUM(vote_count), 0)
  INTO v_total_votes
  FROM questions
  WHERE is_indexed = true;

  -- Upsert the stats row
  INSERT INTO agi_stats (id, overall_rate, linguistic_rate, multimodal_rate, linguistic_count, multimodal_count, total_votes, updated_at)
  VALUES (1, v_overall_rate, v_linguistic_rate, v_multimodal_rate, v_linguistic_count, v_multimodal_count, v_total_votes, NOW())
  ON CONFLICT (id) DO UPDATE SET
    overall_rate = EXCLUDED.overall_rate,
    linguistic_rate = EXCLUDED.linguistic_rate,
    multimodal_rate = EXCLUDED.multimodal_rate,
    linguistic_count = EXCLUDED.linguistic_count,
    multimodal_count = EXCLUDED.multimodal_count,
    total_votes = EXCLUDED.total_votes,
    updated_at = EXCLUDED.updated_at;

  RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================
-- TRIGGERS
-- ============================================

-- Trigger on votes table (INSERT/UPDATE/DELETE)
CREATE TRIGGER trigger_recalculate_agi_stats_on_vote
  AFTER INSERT OR UPDATE OR DELETE ON votes
  FOR EACH STATEMENT
  EXECUTE FUNCTION recalculate_agi_stats();

-- Trigger on questions table (when is_indexed or category changes)
CREATE TRIGGER trigger_recalculate_agi_stats_on_question
  AFTER INSERT OR UPDATE OF is_indexed, category, vote_count, achieved_count OR DELETE ON questions
  FOR EACH STATEMENT
  EXECUTE FUNCTION recalculate_agi_stats();

-- ============================================
-- FUNCTION: do_recalculate_agi_stats (callable)
-- ============================================
-- Same logic but can be called directly (not a trigger function)

CREATE OR REPLACE FUNCTION do_recalculate_agi_stats()
RETURNS VOID AS $$
DECLARE
  v_linguistic_rate NUMERIC(5,2);
  v_multimodal_rate NUMERIC(5,2);
  v_overall_rate NUMERIC(5,2);
  v_linguistic_count INTEGER;
  v_multimodal_count INTEGER;
  v_total_votes INTEGER;
BEGIN
  -- Calculate linguistic rate
  SELECT
    COALESCE(AVG(CASE WHEN vote_count > 0 THEN (achieved_count::NUMERIC / vote_count) * 100 ELSE 0 END), 0),
    COUNT(*)
  INTO v_linguistic_rate, v_linguistic_count
  FROM questions
  WHERE is_indexed = true AND category = 'linguistic';

  -- Calculate multimodal rate
  SELECT
    COALESCE(AVG(CASE WHEN vote_count > 0 THEN (achieved_count::NUMERIC / vote_count) * 100 ELSE 0 END), 0),
    COUNT(*)
  INTO v_multimodal_rate, v_multimodal_count
  FROM questions
  WHERE is_indexed = true AND category = 'multimodal';

  -- Calculate overall rate (weighted average)
  IF (v_linguistic_count + v_multimodal_count) > 0 THEN
    v_overall_rate := (
      (v_linguistic_rate * v_linguistic_count) + (v_multimodal_rate * v_multimodal_count)
    ) / (v_linguistic_count + v_multimodal_count);
  ELSE
    v_overall_rate := 0;
  END IF;

  -- Get total votes on index questions
  SELECT COALESCE(SUM(vote_count), 0)
  INTO v_total_votes
  FROM questions
  WHERE is_indexed = true;

  -- Upsert the stats row
  INSERT INTO agi_stats (id, overall_rate, linguistic_rate, multimodal_rate, linguistic_count, multimodal_count, total_votes, updated_at)
  VALUES (1, v_overall_rate, v_linguistic_rate, v_multimodal_rate, v_linguistic_count, v_multimodal_count, v_total_votes, NOW())
  ON CONFLICT (id) DO UPDATE SET
    overall_rate = EXCLUDED.overall_rate,
    linguistic_rate = EXCLUDED.linguistic_rate,
    multimodal_rate = EXCLUDED.multimodal_rate,
    linguistic_count = EXCLUDED.linguistic_count,
    multimodal_count = EXCLUDED.multimodal_count,
    total_votes = EXCLUDED.total_votes,
    updated_at = EXCLUDED.updated_at;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================
-- INITIAL DATA
-- ============================================
-- Insert initial stats row and calculate current values

INSERT INTO agi_stats (id) VALUES (1) ON CONFLICT (id) DO NOTHING;

-- Run initial calculation
SELECT do_recalculate_agi_stats();

-- ============================================
-- USAGE
-- ============================================
-- Frontend query (super fast - just one row):
--   SELECT * FROM agi_stats WHERE id = 1;
--
-- Response example:
-- {
--   "overall_rate": 45.50,
--   "linguistic_rate": 52.30,
--   "multimodal_rate": 38.70,
--   "linguistic_count": 10,
--   "multimodal_count": 8,
--   "total_votes": 1250,
--   "updated_at": "2024-01-15T10:30:00Z"
-- }
-- ============================================
