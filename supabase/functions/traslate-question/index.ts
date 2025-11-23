import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

// OpenAI API Key 설정 필요
const openAiKey = Deno.env.get('OPENAI_API_KEY')

serve(async (req) => {
    try {
        // 1. 입력 데이터 받기
        const { content, category, author_id } = await req.json()

        if (!content) throw new Error('Content is required')

        // 2. AI에게 [검수] + [언어 감지] + [번역] 통합 요청
        const prompt = `
      You are an administrator for an AGI Benchmark System.
      Input text: "${content}"
      
      Your Goal:
      1. [Moderation]: Decide if this is a valid question about Artificial Intelligence/Human Intelligence capabilities.
         - Status 'approved': Clear, relevant question about AI capabilities, logic, or behavior.
         - Status 'rejected': Spam, hate speech, sexual content, advertising, or nonsense unrelated to AI.
         - Status 'pending': Ambiguous, borderline, or if you are unsure.
      
      2. [Language Detection]: Detect the source language.
      
      3. [Translation]: Translate the input text into:
         - English (en)
         - Korean (ko)
         - Japanese (ja)
         - Chinese (zh)
         - Spanish (es)
         - German (de)
         - French (fr)

      Output Schema (Strict JSON):
      {
        "moderation": {
          "status": "approved" | "rejected" | "pending",
          "reason": "short reason string"
        },
        "detected_lang": "iso_code",
        "translations": { "en": "...", "ko": "...", ... }
      }
    `

        const aiResponse = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${openAiKey}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                model: 'gpt-5-mini', // gpt-4o가 판단력이 좋으므로 추천
                messages: [
                    { role: 'system', content: 'You are a strict AI moderator and translator. Output JSON only.' },
                    { role: 'user', content: prompt }
                ],
                response_format: { type: "json_object" }
            }),
        })

        const aiData = await aiResponse.json()
        const result = JSON.parse(aiData.choices[0].message.content)

        const detectedLang = result.detected_lang
        const translations = result.translations
        const moderation = result.moderation

        // ---------------------------------------------------------
        // 3. 입력 언어 Override (사용자 원본 보존)
        // ---------------------------------------------------------
        if (translations[detectedLang]) {
            translations[detectedLang] = content
        }

        // 4. Supabase 클라이언트 생성
        const supabase = createClient(
            Deno.env.get('SUPABASE_URL') ?? '',
            Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
        )

        // 5. 메인 Questions 테이블 저장
        // [핵심] AI가 판단한 status를 그대로 적용합니다.
        const mainContent = translations['en'] || content

        const { data: questionData, error: qError } = await supabase
            .from('questions')
            .insert({
                content: mainContent,
                category: category,
                author_id: author_id,
                status: moderation.status, // AI의 판단 결과 (approved/rejected/pending)
                dominant_unsuitable_reason: moderation.status === 'rejected' ? 'other' : null // 거절된 경우 사유 기록용(임시)
            })
            .select()
            .single()

        if (qError) throw qError

        // 6. Translations 테이블 저장
        // (Reject 되었더라도 사용자가 "내 질문" 목록에서 볼 수 있게 번역본은 저장해두는 것이 좋습니다)
        const translationRows = Object.entries(translations)
            .filter(([lang]) => lang !== 'en')
            .map(([lang, transContent]) => ({
                question_id: questionData.id,
                lang_code: lang,
                content: transContent,
                is_verified: lang === detectedLang ? true : false
            }))

        if (translationRows.length > 0) {
            const { error: tError } = await supabase
                .from('question_translations')
                .insert(translationRows)

            if (tError) throw tError
        }

        return new Response(
            JSON.stringify({
                success: true,
                questionId: questionData.id,
                status: moderation.status,
                reason: moderation.reason
            }),
            { headers: { "Content-Type": "application/json" } },
        )

    } catch (error) {
        return new Response(
            JSON.stringify({ error: error.message }),
            { status: 500, headers: { "Content-Type": "application/json" } },
        )
    }
})