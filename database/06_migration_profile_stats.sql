-- ============================================
-- Migration: Profile 유저 통계 컬럼 추가
-- ============================================

-- 1. profiles 테이블에 통계 컬럼 추가
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS total_vote_count INT DEFAULT 0;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS total_question_count INT DEFAULT 0;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS total_approved_question_count INT DEFAULT 0;

-- 2. 투표 시 profile 통계 업데이트 트리거 함수
CREATE OR REPLACE FUNCTION update_profile_vote_count()
RETURNS TRIGGER AS $$
DECLARE
  _user_id UUID;
BEGIN
  IF (TG_OP = 'DELETE') THEN
    _user_id := OLD.user_id;
  ELSE
    _user_id := NEW.user_id;
  END IF;

  UPDATE profiles
  SET total_vote_count = (SELECT COUNT(*) FROM votes WHERE user_id = _user_id)
  WHERE id = _user_id;

  RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- 기존 트리거 삭제 후 재생성
DROP TRIGGER IF EXISTS on_vote_update_profile ON votes;
CREATE TRIGGER on_vote_update_profile
  AFTER INSERT OR DELETE ON votes
  FOR EACH ROW EXECUTE PROCEDURE update_profile_vote_count();

-- 3. 질문 제출/승인 시 profile 통계 업데이트 트리거 함수
CREATE OR REPLACE FUNCTION update_profile_question_count()
RETURNS TRIGGER AS $$
DECLARE
  _author_id UUID;
BEGIN
  IF (TG_OP = 'DELETE') THEN
    _author_id := OLD.author_id;
  ELSE
    _author_id := NEW.author_id;
  END IF;

  IF _author_id IS NOT NULL THEN
    UPDATE profiles
    SET
      total_question_count = (SELECT COUNT(*) FROM questions WHERE author_id = _author_id),
      total_approved_question_count = (SELECT COUNT(*) FROM questions WHERE author_id = _author_id AND status = 'approved')
    WHERE id = _author_id;
  END IF;

  RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- 기존 트리거 삭제 후 재생성
DROP TRIGGER IF EXISTS on_question_update_profile ON questions;
CREATE TRIGGER on_question_update_profile
  AFTER INSERT OR UPDATE OF status OR DELETE ON questions
  FOR EACH ROW EXECUTE PROCEDURE update_profile_question_count();

-- 4. 기존 데이터 기반으로 초기값 계산
UPDATE profiles p
SET
  total_vote_count = COALESCE((SELECT COUNT(*) FROM votes WHERE user_id = p.id), 0),
  total_question_count = COALESCE((SELECT COUNT(*) FROM questions WHERE author_id = p.id), 0),
  total_approved_question_count = COALESCE((SELECT COUNT(*) FROM questions WHERE author_id = p.id AND status = 'approved'), 0);
