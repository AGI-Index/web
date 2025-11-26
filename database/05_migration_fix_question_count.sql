-- Migration: Fix question count to only include approved questions
-- Issue: index_question_count and candidate_question_count were counting pending/rejected questions

-- Update recalculate_agi_stats() function
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

  -- Metrics Calculations
  SELECT COALESCE(SUM(vote_count), 0) INTO v_total_votes FROM questions;
  SELECT COUNT(DISTINCT user_id) INTO v_total_users FROM votes;

  -- FIX: Only count approved questions
  SELECT COUNT(*) INTO v_index_question_count FROM questions WHERE is_indexed = true AND status = 'approved';
  SELECT COUNT(*) INTO v_candidate_question_count FROM questions WHERE is_indexed = false AND status = 'approved';

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
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Update do_recalculate_agi_stats() function (callable version)
CREATE OR REPLACE FUNCTION do_recalculate_agi_stats()
RETURNS VOID AS $$
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

  -- FIX: Only count approved questions
  SELECT COUNT(*) INTO v_index_question_count FROM questions WHERE is_indexed = true AND status = 'approved';
  SELECT COUNT(*) INTO v_candidate_question_count FROM questions WHERE is_indexed = false AND status = 'approved';

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
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Recalculate stats immediately to fix current data
SELECT do_recalculate_agi_stats();
