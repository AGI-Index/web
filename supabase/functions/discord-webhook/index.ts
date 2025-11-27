import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const DISCORD_WEBHOOK_URL = Deno.env.get('DISCORD_WEBHOOK_URL')

interface MilestonePayload {
  type: 'milestone'
  metric: string
  value: number
  exceeded?: boolean
}

interface DailyPayload {
  type: 'daily'
  stats: {
    overall_rate: number
    linguistic_rate: number
    multimodal_rate: number
    total_users: number
    total_votes: number
    index_question_count: number
    candidate_question_count: number
  }
}

type WebhookPayload = MilestonePayload | DailyPayload

function formatNumber(num: number): string {
  return num.toLocaleString('en-US')
}

function formatRate(rate: number): string {
  return `${rate.toFixed(1)}%`
}

function buildMilestoneMessage(payload: MilestonePayload): string {
  const { metric, value, exceeded } = payload

  const metricLabels: Record<string, string> = {
    total_users: 'Total Users',
    index_question_count: 'Index Questions',
    total_votes: 'Total Votes',
    candidate_question_count: 'Candidate Questions'
  }

  const label = metricLabels[metric] || metric

  if (exceeded) {
    return `🎉 **Milestone!** ${label} exceeded 20 (current: ${formatNumber(value)}).`
  }

  return `🎉 **Milestone!** ${label} reached ${formatNumber(value)}!`
}

function buildDailyMessage(payload: DailyPayload): string {
  const { stats } = payload

  return `📊 **Daily Stats (${new Date().toISOString().split('T')[0]})**

**AGI Progress**
• Overall Rate: ${formatRate(stats.overall_rate)}
• Linguistic Rate: ${formatRate(stats.linguistic_rate)}
• Multimodal Rate: ${formatRate(stats.multimodal_rate)}

**Community**
• Total Users: ${formatNumber(stats.total_users)}
• Total Votes: ${formatNumber(stats.total_votes)}
• Index Questions: ${formatNumber(stats.index_question_count)}
• Candidate Questions: ${formatNumber(stats.candidate_question_count)}`
}

async function sendToDiscord(content: string): Promise<Response> {
  if (!DISCORD_WEBHOOK_URL) {
    throw new Error('DISCORD_WEBHOOK_URL is not configured')
  }

  const response = await fetch(DISCORD_WEBHOOK_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ content }),
  })

  if (!response.ok) {
    const errorText = await response.text()
    throw new Error(`Discord API error: ${response.status} - ${errorText}`)
  }

  return response
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
      }
    })
  }

  try {
    const payload: WebhookPayload = await req.json()

    let message: string

    if (payload.type === 'milestone') {
      message = buildMilestoneMessage(payload as MilestonePayload)
    } else if (payload.type === 'daily') {
      message = buildDailyMessage(payload as DailyPayload)
    } else {
      throw new Error(`Unknown payload type: ${(payload as any).type}`)
    }

    await sendToDiscord(message)

    return new Response(
      JSON.stringify({ success: true, message }),
      {
        headers: { 'Content-Type': 'application/json' },
      }
    )
  } catch (error) {
    console.error('Discord webhook error:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    )
  }
})
