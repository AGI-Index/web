# Discord Webhook Notification System

AGI Index의 마일스톤 달성 및 일일 통계를 Discord로 전송하는 시스템입니다.

## 기능

### 1. Milestone Notifications (실시간)
- `total_users`: 50의 배수 도달 시 알림
- `index_question_count`: 10의 배수 도달 시 알림
- `total_votes`: 100의 배수 도달 시 알림
- `candidate_question_count`: 20 초과 시 알림 (최초 1회)

### 2. Daily Stats (매일 UTC 0시 / KST 9시)
- Overall/Linguistic/Multimodal Rate
- Total Users, Total Votes
- Index Questions, Candidate Questions

## 설정 방법

### Step 1: Discord Webhook 생성
1. Discord 서버에서 채널 설정 > 연동 > 웹후크 > 새 웹후크
2. 이름 설정 (예: "AGI Index Bot")
3. **웹후크 URL 복사** (나중에 사용)

### Step 2: Supabase Extensions 활성화
Supabase Dashboard에서:
1. **Database > Extensions**로 이동
2. **pg_net** 활성화 (HTTP 요청용)
3. **pg_cron** 활성화 (스케줄링용)

### Step 3: Edge Function 배포
```bash
# 프로젝트 루트에서
supabase functions deploy discord-webhook
```

### Step 4: Edge Function 시크릿 설정
```bash
# Discord Webhook URL 설정
supabase secrets set DISCORD_WEBHOOK_URL="https://discord.com/api/webhooks/..."
```

### Step 5: SQL 마이그레이션 실행
1. `database/03_discord_webhook.sql` 파일에서 `<PROJECT_REF>`와 `<SERVICE_ROLE_KEY>`를 실제 값으로 교체
2. Supabase SQL Editor에서 실행

### Step 6: pg_cron 스케줄 등록
SQL Editor에서 실행:
```sql
SELECT cron.schedule(
  'daily-discord-stats',
  '0 0 * * *',
  'SELECT send_daily_discord_stats()'
);
```

## 테스트

### Milestone 테스트
```sql
SELECT test_milestone_notification('total_users', 100);
```

### Daily Stats 테스트
```sql
SELECT test_daily_notification();
```

## 메시지 예시

### Milestone
```
🎉 **Milestone!** Total Users reached 100!
🎉 **Milestone!** Index Questions reached 20!
🎉 **Milestone!** Total Votes reached 500!
🎉 **Milestone!** Candidate Questions exceeded 20 (current: 21).
```

### Daily Stats
```
📊 **Daily Stats (2024-01-15)**

**AGI Progress**
• Overall Rate: 45.2%
• Linguistic Rate: 52.1%
• Multimodal Rate: 38.3%

**Community**
• Total Users: 127
• Total Votes: 1,523
• Index Questions: 15
• Candidate Questions: 23
```

## 트러블슈팅

### pg_net이 작동하지 않는 경우
- Extension이 활성화되어 있는지 확인
- Supabase 프로젝트가 실행 중인지 확인

### pg_cron이 작동하지 않는 경우
- Extension이 활성화되어 있는지 확인
- 스케줄이 등록되어 있는지 확인: `SELECT * FROM cron.job;`

### Discord 메시지가 안 오는 경우
1. Edge Function 로그 확인: `supabase functions logs discord-webhook`
2. DISCORD_WEBHOOK_URL이 올바른지 확인
3. 테스트 함수로 직접 호출해보기

## 파일 구조
```
supabase/functions/discord-webhook/index.ts  # Edge Function
database/03_discord_webhook.sql              # SQL 마이그레이션
database/README_discord_webhook.md           # 이 문서
```
