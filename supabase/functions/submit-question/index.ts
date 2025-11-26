import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const openAiKey = Deno.env.get('OPENAI_API_KEY')

// CORS headers for browser requests
const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
}

serve(async (req) => {
    // Handle CORS preflight requests
    if (req.method === 'OPTIONS') {
        return new Response('ok', { headers: corsHeaders })
    }

    try {
        // 1. Extract user from Authorization header (secure way)
        const authHeader = req.headers.get('Authorization')
        if (!authHeader) {
            throw new Error('Missing Authorization header')
        }

        // Create Supabase client with user's JWT for auth
        const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? ''
        const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY') ?? ''
        const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''

        // Client with user's token to get user info
        const supabaseAuth = createClient(supabaseUrl, supabaseAnonKey, {
            global: { headers: { Authorization: authHeader } }
        })

        // Get the authenticated user
        const { data: { user }, error: userError } = await supabaseAuth.auth.getUser()
        if (userError || !user) {
            throw new Error('Unauthorized: Invalid token')
        }

        const author_id = user.id

        // 2. Parse request body
        const { content, category } = await req.json()

        if (!content) {
            throw new Error('Content is required')
        }

        if (!category) {
            throw new Error('Category is required')
        }

        // 3. AI moderation + translation request
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
        "translations": { "en": "...", "ko": "...", "ja": "...", "zh": "...", "es": "...", "de": "...", "fr": "..." }
      }
    `

        const aiResponse = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${openAiKey}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                model: 'gpt-5-mini',
                messages: [
                    { role: 'system', content: 'You are a strict AI moderator and translator. Output JSON only.' },
                    { role: 'user', content: prompt }
                ],
                response_format: { type: "json_object" }
            }),
        })

        // 4. Handle OpenAI API errors
        if (!aiResponse.ok) {
            const errorText = await aiResponse.text()
            console.error('OpenAI API error:', errorText)
            throw new Error(`OpenAI API error: ${aiResponse.status}`)
        }

        const aiData = await aiResponse.json()

        // Validate AI response structure
        if (!aiData.choices || !aiData.choices[0] || !aiData.choices[0].message) {
            console.error('Unexpected AI response:', aiData)
            throw new Error('Invalid response from AI')
        }

        let result
        try {
            result = JSON.parse(aiData.choices[0].message.content)
        } catch (parseError) {
            console.error('Failed to parse AI response:', aiData.choices[0].message.content)
            throw new Error('Failed to parse AI response as JSON')
        }

        const detectedLang = result.detected_lang
        const translations = result.translations
        const moderation = result.moderation

        // 5. Override detected language translation with original content
        if (translations && translations[detectedLang]) {
            translations[detectedLang] = content
        }

        // 6. Supabase client with service role for database operations
        const supabase = createClient(supabaseUrl, supabaseServiceKey)

        // 7. Insert into questions table
        const mainContent = translations?.['en'] || content

        const { data: questionData, error: qError } = await supabase
            .from('questions')
            .insert({
                content: mainContent,
                category: category,
                author_id: author_id,
                status: moderation.status,
                dominant_unsuitable_reason: moderation.status === 'rejected' ? 'other' : null
            })
            .select()
            .single()

        if (qError) {
            console.error('Question insert error:', qError)
            throw qError
        }

        // 8. Insert translations (excluding English which is the main content)
        if (translations) {
            const translationRows = Object.entries(translations)
                .filter(([lang]) => lang !== 'en')
                .map(([lang, transContent]) => ({
                    question_id: questionData.id,
                    lang_code: lang,
                    content: transContent as string,
                    is_verified: lang === detectedLang
                }))

            if (translationRows.length > 0) {
                const { error: tError } = await supabase
                    .from('question_translations')
                    .insert(translationRows)

                if (tError) {
                    console.error('Translation insert error:', tError)
                    // Don't throw - question was created successfully
                }
            }
        }

        return new Response(
            JSON.stringify({
                success: true,
                questionId: questionData.id,
                status: moderation.status,
                reason: moderation.reason
            }),
            { headers: { ...corsHeaders, "Content-Type": "application/json" } },
        )

    } catch (error) {
        console.error('Edge function error:', error)
        return new Response(
            JSON.stringify({ error: error.message }),
            { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
        )
    }
})
