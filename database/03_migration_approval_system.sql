-- 1. 새로운 상태 타입 생성 (pending, approved, rejected)
DO $$ BEGIN
    CREATE TYPE question_status AS ENUM ('pending', 'approved', 'rejected');
EXCEPTION
    WHEN duplicate_object THEN null; -- 이미 존재하면 패스
END $$;

-- 2. Questions 테이블에 status 컬럼 추가
-- 기본값은 'pending'이지만, 기존 질문들은 노출되어야 하므로 잠시 'approved'로 업데이트합니다.
ALTER TABLE questions 
ADD COLUMN IF NOT EXISTS status question_status DEFAULT 'pending';

-- 3. 기존 데이터 마이그레이션
-- (이미 올라와 있던 질문들은 '승인됨'으로 처리하여 사이트에서 사라지지 않게 함)
UPDATE questions 
SET status = 'approved' 
WHERE status IS NULL OR status = 'pending';

-- 4. 기존 RLS 정책 삭제 (충돌 방지)
-- (이전에 설정한 정책 이름과 동일해야 삭제됩니다. init.sql 기준 이름입니다.)
DROP POLICY IF EXISTS "Questions are viewable by everyone" ON questions;
DROP POLICY IF EXISTS "Questions are viewable by everyone." ON questions; -- 혹시 모를 오타 대비
DROP POLICY IF EXISTS "Only admins can update questions" ON questions;

-- 5. 새로운 RLS 정책 적용 (승인 시스템 반영)

-- 5.1. [일반 공개] 누구나 'approved' 상태인 질문만 볼 수 있음
CREATE POLICY "Public read approved" ON questions FOR SELECT 
  USING (status = 'approved');

-- 5.2. [작성자] 내 질문은 상태 상관없이(pending, rejected 포함) 볼 수 있음
CREATE POLICY "Authors read own" ON questions FOR SELECT 
  USING (auth.uid() = author_id);

-- 5.3. [관리자] 관리자는 모든 질문을 보고, 수정(승인/거절)할 수 있음
CREATE POLICY "Admin full access" ON questions FOR ALL 
  USING ((SELECT is_admin FROM profiles WHERE id = auth.uid()) = true);

-- (참고: INSERT 정책은 기존과 동일하므로 건드리지 않았습니다)