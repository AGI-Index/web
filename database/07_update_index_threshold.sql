-- ============================================
-- 인덱스 질문 임계값 변경 스크립트
-- ============================================
-- 사용법: 아래 숫자 10을 원하는 값으로 변경 후 실행
-- 예: 초기에는 3, 나중에 10으로 변경
-- 총 3곳의 숫자를 동일하게 변경해야 함
-- ============================================

-- 1. 트리거 함수 재생성 (새 임계값 적용)
-- ★★★ 아래 >= 10 부분의 숫자를 변경 ★★★
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
  IF (TG_OP = 'DELETE') THEN
    _question_id := OLD.question_id;
  ELSE
    _question_id := NEW.question_id;
  END IF;

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

  SELECT unsuitable_reason
  INTO _top_reason
  FROM votes
  WHERE question_id = _question_id AND is_suitable = false
  GROUP BY unsuitable_reason
  ORDER BY COUNT(*) DESC
  LIMIT 1;

  IF (_suitable + _unsuitable) > 0 THEN
    _suitability_rate := _suitable::float / (_suitable + _unsuitable)::float;
  ELSE
    _suitability_rate := 0;
  END IF;

  IF (_achieved + _not_achieved) > 0 THEN
    _achievement_rate := _achieved::float / (_achieved + _not_achieved)::float;
  ELSE
    _achievement_rate := 0;
  END IF;

  UPDATE questions
  SET
    vote_count = _total,
    suitable_count = _suitable,
    unsuitable_count = _unsuitable,
    achieved_count = _achieved,
    not_achieved_count = _not_achieved,
    current_weight = CASE WHEN _suitable > 0 THEN ROUND(_weight_sum::numeric / _suitable::numeric, 2) ELSE 0 END,
    dominant_unsuitable_reason = _top_reason,
    is_indexed = CASE
      WHEN _suitable >= 10 AND _suitability_rate >= 0.5 THEN TRUE  -- ★ 여기 숫자 변경
      ELSE FALSE
    END,
    is_achieved = CASE
      WHEN (_achieved + _not_achieved) > 0 AND _achievement_rate >= 0.5 THEN TRUE
      ELSE FALSE
    END
  WHERE id = _question_id;

  RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- 2. 모든 질문의 is_indexed 상태 재계산
-- ★★★ 아래 >= 10 부분의 숫자를 변경 ★★★
UPDATE questions q
SET is_indexed = CASE
  WHEN q.suitable_count >= 10  -- ★ 여기 숫자 변경
    AND (q.suitable_count + q.unsuitable_count) > 0
    AND (q.suitable_count::float / (q.suitable_count + q.unsuitable_count)::float) >= 0.5
  THEN TRUE
  ELSE FALSE
END
WHERE status = 'approved';

-- 3. AGI stats 재계산
SELECT do_recalculate_agi_stats();

-- 4. 결과 확인
SELECT
  'Index Questions' as type,
  COUNT(*) as count
FROM questions
WHERE is_indexed = true AND status = 'approved'
UNION ALL
SELECT
  'Candidate Questions' as type,
  COUNT(*) as count
FROM questions
WHERE is_indexed = false AND status = 'approved';
