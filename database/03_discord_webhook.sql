-- ============================================
-- Discord Webhook Notification System
-- ============================================
-- Prerequisites:
-- 1. Enable pg_net extension: Dashboard > Database > Extensions > pg_net
-- 2. Enable pg_cron extension: Dashboard > Database > Extensions > pg_cron
-- 3. Deploy Edge Function: supabase functions deploy discord-webhook
-- 4. Set secret: supabase secrets set DISCORD_WEBHOOK_URL="your_url"
-- ============================================

-- ============================================
-- Configuration (REPLACE THESE VALUES)
-- ============================================
-- <PROJECT_REF>: Your Supabase project reference (e.g., tuzaanusuisvqgeolksa)
-- <SERVICE_ROLE_KEY>: Your Supabase service role key

-- ============================================
-- 1. Milestone Trigger Function
-- ============================================
CREATE OR REPLACE FUNCTION check_milestone_and_notify()
RETURNS TRIGGER AS $$
DECLARE
  edge_url TEXT := 'https://<PROJECT_REF>.supabase.co/functions/v1/discord-webhook';
  service_key TEXT := '<SERVICE_ROLE_KEY>';
BEGIN
  -- total_users: 50의 배수 도달
  IF (OLD.total_users / 50) < (NEW.total_users / 50) THEN
    PERFORM net.http_post(
      url := edge_url,
      headers := jsonb_build_object('Authorization', 'Bearer ' || service_key, 'Content-Type', 'application/json'),
      body := jsonb_build_object('type', 'milestone', 'metric', 'total_users', 'value', (NEW.total_users / 50) * 50)
    );
  END IF;

  -- index_question_count: 10의 배수 도달
  IF (OLD.index_question_count / 10) < (NEW.index_question_count / 10) THEN
    PERFORM net.http_post(
      url := edge_url,
      headers := jsonb_build_object('Authorization', 'Bearer ' || service_key, 'Content-Type', 'application/json'),
      body := jsonb_build_object('type', 'milestone', 'metric', 'index_question_count', 'value', (NEW.index_question_count / 10) * 10)
    );
  END IF;

  -- total_votes: 100의 배수 도달
  IF (OLD.total_votes / 100) < (NEW.total_votes / 100) THEN
    PERFORM net.http_post(
      url := edge_url,
      headers := jsonb_build_object('Authorization', 'Bearer ' || service_key, 'Content-Type', 'application/json'),
      body := jsonb_build_object('type', 'milestone', 'metric', 'total_votes', 'value', (NEW.total_votes / 100) * 100)
    );
  END IF;

  -- candidate_question_count: 20 초과 (최초 1회만)
  IF OLD.candidate_question_count <= 20 AND NEW.candidate_question_count > 20 THEN
    PERFORM net.http_post(
      url := edge_url,
      headers := jsonb_build_object('Authorization', 'Bearer ' || service_key, 'Content-Type', 'application/json'),
      body := jsonb_build_object('type', 'milestone', 'metric', 'candidate_question_count', 'value', NEW.candidate_question_count, 'exceeded', true)
    );
  END IF;

  RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger
DROP TRIGGER IF EXISTS trigger_check_milestone ON agi_stats;
CREATE TRIGGER trigger_check_milestone
  AFTER UPDATE ON agi_stats
  FOR EACH ROW
  EXECUTE FUNCTION check_milestone_and_notify();

-- ============================================
-- 2. Daily Stats Function
-- ============================================
CREATE OR REPLACE FUNCTION send_daily_discord_stats()
RETURNS void AS $$
DECLARE
  edge_url TEXT := 'https://<PROJECT_REF>.supabase.co/functions/v1/discord-webhook';
  service_key TEXT := '<SERVICE_ROLE_KEY>';
  stats RECORD;
BEGIN
  SELECT * INTO stats FROM agi_stats WHERE id = 1;

  PERFORM net.http_post(
    url := edge_url,
    headers := jsonb_build_object('Authorization', 'Bearer ' || service_key, 'Content-Type', 'application/json'),
    body := jsonb_build_object(
      'type', 'daily',
      'stats', jsonb_build_object(
        'overall_rate', stats.overall_rate,
        'linguistic_rate', stats.linguistic_rate,
        'multimodal_rate', stats.multimodal_rate,
        'total_users', stats.total_users,
        'total_votes', stats.total_votes,
        'index_question_count', stats.index_question_count,
        'candidate_question_count', stats.candidate_question_count
      )
    )
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================
-- 3. Schedule the Cron Job (pg_cron)
-- ============================================
-- Run this AFTER enabling pg_cron extension in Supabase Dashboard
-- Schedule: Every day at UTC 00:00 (KST 09:00)
--
-- Uncomment and run manually:
-- SELECT cron.schedule(
--   'daily-discord-stats',
--   '0 0 * * *',
--   'SELECT send_daily_discord_stats()'
-- );

-- To check scheduled jobs:
-- SELECT * FROM cron.job;

-- To unschedule:
-- SELECT cron.unschedule('daily-discord-stats');

-- ============================================
-- 4. Test Functions
-- ============================================

-- Test milestone notification
CREATE OR REPLACE FUNCTION test_milestone_notification(
  p_metric TEXT DEFAULT 'total_users',
  p_value INT DEFAULT 100
)
RETURNS void AS $$
DECLARE
  edge_url TEXT := 'https://<PROJECT_REF>.supabase.co/functions/v1/discord-webhook';
  service_key TEXT := '<SERVICE_ROLE_KEY>';
BEGIN
  PERFORM net.http_post(
    url := edge_url,
    headers := jsonb_build_object('Authorization', 'Bearer ' || service_key, 'Content-Type', 'application/json'),
    body := jsonb_build_object('type', 'milestone', 'metric', p_metric, 'value', p_value)
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Test daily stats notification
CREATE OR REPLACE FUNCTION test_daily_notification()
RETURNS void AS $$
BEGIN
  PERFORM send_daily_discord_stats();
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================
-- Usage:
-- ============================================
--
-- 1. Deploy Edge Function:
--    supabase functions deploy discord-webhook
--
-- 2. Set Discord webhook secret:
--    supabase secrets set DISCORD_WEBHOOK_URL="https://discord.com/api/webhooks/..."
--
-- 3. Replace <PROJECT_REF> and <SERVICE_ROLE_KEY> in this file
--
-- 4. Run this SQL in Supabase SQL Editor
--
-- 5. Test milestone notification:
--    SELECT test_milestone_notification('total_users', 100);
--
-- 6. Test daily stats notification:
--    SELECT test_daily_notification();
--
-- 7. Schedule daily cron job (run once after enabling pg_cron):
--    SELECT cron.schedule('daily-discord-stats', '0 0 * * *', 'SELECT send_daily_discord_stats()');
