-- ============================================
-- Migration: Decouple Suitability & Achievement Voting
-- ============================================
-- Purpose: Allow independent voting on suitability and achievement
-- Run this BEFORE updating the schema
-- ============================================

-- Step 1: Add new columns to questions table
ALTER TABLE questions
ADD COLUMN IF NOT EXISTS unsuitable_count INT DEFAULT 0,
ADD COLUMN IF NOT EXISTS not_achieved_count INT DEFAULT 0;

-- Step 2: Modify votes table to allow NULL values
-- (Users can now vote on achievement without voting on suitability)
ALTER TABLE votes
ALTER COLUMN is_suitable DROP NOT NULL;

-- Step 3: Sync existing data - Calculate new counters from existing votes
UPDATE questions q
SET
  unsuitable_count = (
    SELECT COUNT(*) FROM votes v
    WHERE v.question_id = q.id AND v.is_suitable = false
  ),
  not_achieved_count = (
    SELECT COUNT(*) FROM votes v
    WHERE v.question_id = q.id AND v.is_suitable = true AND v.is_achieved = false
  );

-- Step 4: Drop old trigger and function
DROP TRIGGER IF EXISTS on_vote_change ON votes;
DROP FUNCTION IF EXISTS update_question_stats();

-- Step 5: Create new trigger function with decoupled logic
CREATE OR REPLACE FUNCTION update_question_stats()
RETURNS TRIGGER AS $$
DECLARE
  _question_id BIGINT;
  _total INT;
  _suitable INT;
  _unsuitable INT;
  _achieved INT;
  _not_achieved INT;
  _weight_sum INT;
  _top_reason unsuitable_reason;
  _suitability_rate FLOAT;
  _achievement_rate FLOAT;
BEGIN
  -- Get affected question ID
  IF (TG_OP = 'DELETE') THEN
    _question_id := OLD.question_id;
  ELSE
    _question_id := NEW.question_id;
  END IF;

  -- 1. Calculate separate counters
  SELECT
    COUNT(*),
    COUNT(*) FILTER (WHERE is_suitable = true),
    COUNT(*) FILTER (WHERE is_suitable = false),
    COUNT(*) FILTER (WHERE is_achieved = true),
    COUNT(*) FILTER (WHERE is_achieved = false),
    COALESCE(SUM(weight) FILTER (WHERE is_suitable = true), 0)
  INTO _total, _suitable, _unsuitable, _achieved, _not_achieved, _weight_sum
  FROM votes
  WHERE question_id = _question_id;

  -- 2. Find dominant unsuitable reason
  SELECT unsuitable_reason
  INTO _top_reason
  FROM votes
  WHERE question_id = _question_id AND is_suitable = false
  GROUP BY unsuitable_reason
  ORDER BY COUNT(*) DESC
  LIMIT 1;

  -- 3. Calculate rates independently
  -- Suitability rate: suitable / (suitable + unsuitable) - only counts explicit votes
  IF (_suitable + _unsuitable) > 0 THEN
    _suitability_rate := _suitable::float / (_suitable + _unsuitable)::float;
  ELSE
    _suitability_rate := 0;
  END IF;

  -- Achievement rate: achieved / (achieved + not_achieved) - only counts explicit votes
  IF (_achieved + _not_achieved) > 0 THEN
    _achievement_rate := _achieved::float / (_achieved + _not_achieved)::float;
  ELSE
    _achievement_rate := 0;
  END IF;

  -- 4. Update questions table
  UPDATE questions
  SET
    vote_count = _total,
    suitable_count = _suitable,
    unsuitable_count = _unsuitable,
    achieved_count = _achieved,
    not_achieved_count = _not_achieved,
    current_weight = CASE WHEN _suitable > 0 THEN ROUND(_weight_sum::numeric / _suitable::numeric, 2) ELSE 0 END,
    dominant_unsuitable_reason = _top_reason,

    -- INDEX inclusion: 10+ suitable votes AND suitability rate >= 50%
    is_indexed = CASE
      WHEN _suitable >= 10 AND _suitability_rate >= 0.5 THEN TRUE
      ELSE FALSE
    END,

    -- ACHIEVED: achievement rate >= 50% (independent of suitability)
    is_achieved = CASE
      WHEN (_achieved + _not_achieved) > 0 AND _achievement_rate >= 0.5 THEN TRUE
      ELSE FALSE
    END

  WHERE id = _question_id;

  RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Step 6: Recreate trigger
CREATE TRIGGER on_vote_change
  AFTER INSERT OR UPDATE OR DELETE ON votes
  FOR EACH ROW EXECUTE PROCEDURE update_question_stats();

-- Step 7: Re-sync all questions to ensure correct values
-- Force recalculation by touching one vote per question
DO $$
DECLARE
  q RECORD;
  v_id BIGINT;
BEGIN
  FOR q IN SELECT id FROM questions LOOP
    -- Find one vote for this question
    SELECT id INTO v_id FROM votes WHERE question_id = q.id LIMIT 1;
    -- Trigger recalculation if vote exists
    IF v_id IS NOT NULL THEN
      UPDATE votes SET updated_at = NOW() WHERE id = v_id;
    END IF;
  END LOOP;
END $$;

-- ============================================
-- Verification Query (run after migration)
-- ============================================
-- SELECT
--   id,
--   content,
--   vote_count,
--   suitable_count,
--   unsuitable_count,
--   achieved_count,
--   not_achieved_count,
--   is_indexed,
--   is_achieved,
--   CASE WHEN (suitable_count + unsuitable_count) > 0
--        THEN ROUND(suitable_count::numeric / (suitable_count + unsuitable_count)::numeric * 100, 1)
--        ELSE 0 END as suitability_rate,
--   CASE WHEN (achieved_count + not_achieved_count) > 0
--        THEN ROUND(achieved_count::numeric / (achieved_count + not_achieved_count)::numeric * 100, 1)
--        ELSE 0 END as achievement_rate
-- FROM questions
-- ORDER BY vote_count DESC;
