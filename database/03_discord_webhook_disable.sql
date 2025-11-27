-- ============================================
-- Discord Webhook - DISABLE
-- ============================================
-- Run this to disable all Discord webhook notifications

-- 1. Remove the milestone trigger
DROP TRIGGER IF EXISTS trigger_check_milestone ON agi_stats;

-- 2. Remove the cron job (if exists)
-- SELECT cron.unschedule('daily-discord-stats');

-- 3. Drop functions (optional - keeps them for re-enabling later)
-- DROP FUNCTION IF EXISTS check_milestone_and_notify();
-- DROP FUNCTION IF EXISTS send_daily_discord_stats();
-- DROP FUNCTION IF EXISTS test_milestone_notification(TEXT, INT);
-- DROP FUNCTION IF EXISTS test_daily_notification();

-- ============================================
-- To re-enable, run 03_discord_webhook.sql again
-- ============================================
