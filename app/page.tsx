"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { QuestionCard } from "@/components/feature/question-card"
import { ArrowRight, MessageSquare, Eye, Plus, Users, Activity, FileCheck, FileQuestion } from "lucide-react"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { supabase } from "@/lib/supabase"
import { useAuth } from "@/lib/auth-context"
import { QuestionListSkeleton } from "@/components/ui/loading-skeletons"
import { useI18n } from "@/lib/i18n-context"
import { Trans } from "@/components/ui/trans"
import { CountUp } from "@/components/ui/count-up"

export default function Home() {
  const { user } = useAuth()
  const { t, language } = useI18n()
  const [indexQuestions, setIndexQuestions] = useState<any[]>([])
  const [candidateQuestions, setCandidateQuestions] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [agiStats, setAgiStats] = useState({
    overall: 0,
    linguistic: 0,
    multimodal: 0,
    total_users: 0,
    total_votes: 0,
    index_question_count: 0,
    candidate_question_count: 0
  })

  const fetchQuestions = async () => {
    setLoading(true)

    // Fetch user's votes if logged in
    let userVotedIds: number[] = []
    if (user) {
      const { data: votes } = await supabase
        .from('votes')
        .select('question_id')
        .eq('user_id', user.id)

      if (votes) {
        userVotedIds = votes.map((v: any) => v.question_id)
      }
    }

    // Fetch AGI stats from pre-calculated table
    const { data: statsData } = await supabase
      .from('agi_stats')
      .select('*')
      .eq('id', 1)
      .single()

    if (statsData) {
      const stats = statsData as any
      setAgiStats({
        overall: Math.round(stats.overall_rate || 0),
        linguistic: Math.round(stats.linguistic_rate || 0),
        multimodal: Math.round(stats.multimodal_rate || 0),
        total_users: stats.total_users || 0,
        total_votes: stats.total_votes || 0,
        index_question_count: stats.index_question_count || 0,
        candidate_question_count: stats.candidate_question_count || 0
      })
    }

    // Fetch Index Questions
    const { data: allIndexQuestions } = await supabase
      .from('questions')
      .select('*')
      .eq('is_indexed', true)
      .neq('status', 'rejected')

    // Fetch Candidate Questions
    const { data: allCandidateQuestions } = await supabase
      .from('questions')
      .select('*')
      .eq('is_indexed', false)
      .neq('status', 'rejected')

    // Fetch translations for current language (skip if English)
    let translationMap = new Map<number, string>()
    if (language !== 'en') {
      const { data: transData } = await supabase
        .from('question_translations')
        .select('question_id, content')
        .eq('lang_code', language)

      if (transData) {
        transData.forEach((t: any) => translationMap.set(t.question_id, t.content))
      }
    }

    // Helper to apply translations
    const applyTranslations = (questions: any[]) => {
      return questions.map(q => ({
        ...q,
        content: translationMap.get(q.id) || q.content
      }))
    }

    // Filter and randomize
    if (allIndexQuestions) {
      const translated = applyTranslations(allIndexQuestions)
      const unvoted = translated.filter((q: any) => !userVotedIds.includes(q.id))
      const toShow = unvoted.length >= 3 ? unvoted : translated
      const shuffled = toShow.sort(() => Math.random() - 0.5)
      setIndexQuestions(shuffled.slice(0, 3))
    }

    if (allCandidateQuestions) {
      const translated = applyTranslations(allCandidateQuestions)
      const unvoted = translated.filter((q: any) => !userVotedIds.includes(q.id))
      const toShow = unvoted.length >= 3 ? unvoted : translated
      const shuffled = toShow.sort(() => Math.random() - 0.5)
      setCandidateQuestions(shuffled.slice(0, 3))
    }

    setLoading(false)
  }

  useEffect(() => {
    fetchQuestions()
  }, [user, language])

  return (
    <main className="min-h-screen bg-background flex flex-col">
      {/* Hero Section */}
      <section className="relative py-20 md:py-32 overflow-hidden border-b">
        <div className="container px-4 md:px-6 mx-auto flex flex-col items-center text-center z-10 relative">
          <div className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80 mb-6">
            AGI Index Beta
          </div>
          <h1 className="text-4xl md:text-6xl font-bold tracking-tighter mb-4 max-w-6xl">
            <Trans
              i18nKey="home.hero.title"
              components={{
                br: <br className="hidden md:block" />,
                highlight: <span className="text-primary" />
              }}
            />
          </h1>
          <p className="text-muted-foreground max-w-[700px] text-lg md:text-xl mb-10">
            {t('home.hero.subtitle')}
          </p>

          {/* AGI Progress Display */}
          <div className="flex flex-col md:flex-row items-center gap-8 md:gap-16 mb-12">
            <div className="flex flex-col items-center">
              <div className="relative flex items-center justify-center w-40 h-40 md:w-48 md:h-48 rounded-full border-8 border-primary/20">
                <div className="absolute inset-0 flex items-center justify-center flex-col">
                  <span className="text-4xl md:text-5xl font-bold">{agiStats.overall}%</span>
                  <span className="text-sm text-muted-foreground uppercase tracking-wider mt-1">{t('home.hero.agi_level')}</span>
                </div>
                {/* SVG Circle for progress visualization */}
                <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r="46" fill="none" stroke="currentColor" strokeWidth="8" className="text-primary" strokeDasharray="289" strokeDashoffset={289 - (289 * agiStats.overall / 100)} strokeLinecap="round" />
                </svg>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-x-12 gap-y-6 text-left">
              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <MessageSquare className="w-4 h-4" />
                  <span className="text-sm font-medium">{t('home.hero.linguistic')}</span>
                </div>
                <span className="text-2xl font-bold">{agiStats.linguistic}%</span>
                <div className="h-1.5 w-24 bg-secondary rounded-full overflow-hidden">
                  <div className="h-full bg-blue-500 transition-all duration-500" style={{ width: `${agiStats.linguistic}%` }} />
                </div>
              </div>
              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Eye className="w-4 h-4" />
                  <span className="text-sm font-medium">{t('home.hero.multimodal')}</span>
                </div>
                <span className="text-2xl font-bold">{agiStats.multimodal}%</span>
                <div className="h-1.5 w-24 bg-secondary rounded-full overflow-hidden">
                  <div className="h-full bg-green-500 transition-all duration-500" style={{ width: `${agiStats.multimodal}%` }} />
                </div>
              </div>

            </div>
          </div>

          <div className="flex gap-4">
            <Button size="lg" asChild>
              <Link href="/questions">
                {t('home.hero.view_milestones')} <ArrowRight className="ml-2 w-4 h-4" />
              </Link>
            </Button>
            <Button variant="outline" size="lg" asChild>
              <Link href="/manifesto#how-it-works">
                {t('home.hero.how_it_works')}
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Community Stats Section */}
      <section className="py-12 border-b bg-muted/30">
        <div className="container px-4 mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div className="flex flex-col items-center gap-2">
              <Users className="w-6 h-6 text-muted-foreground" />
              <div className="text-3xl font-bold">
                <CountUp end={agiStats.total_users} />
              </div>
              <div className="text-sm text-muted-foreground">Total Participants</div>
            </div>
            <div className="flex flex-col items-center gap-2">
              <Activity className="w-6 h-6 text-muted-foreground" />
              <div className="text-3xl font-bold">
                <CountUp end={agiStats.total_votes} />
              </div>
              <div className="text-sm text-muted-foreground">Total Votes</div>
            </div>
            <div className="flex flex-col items-center gap-2">
              <FileCheck className="w-6 h-6 text-muted-foreground" />
              <div className="text-3xl font-bold">
                <CountUp end={agiStats.index_question_count} />
              </div>
              <div className="text-sm text-muted-foreground">Index Questions</div>
            </div>
            <div className="flex flex-col items-center gap-2">
              <FileQuestion className="w-6 h-6 text-muted-foreground" />
              <div className="text-3xl font-bold">
                <CountUp end={agiStats.candidate_question_count} />
              </div>
              <div className="text-sm text-muted-foreground">Candidate Questions</div>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Vote Section */}
      <section className="py-16 bg-secondary/20">
        <div className="container px-4 mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 mb-8">
            <div>
              <h2 className="text-3xl font-bold tracking-tight">{t('home.quick_vote.title')}</h2>
            </div>
            <div className="flex gap-2">
              <Button variant="ghost" size="sm" onClick={fetchQuestions}>{t('home.quick_vote.refresh')}</Button>
              <Button size="sm" asChild>
                <Link href="/suggest">
                  <Plus className="mr-2 h-4 w-4" /> {t('nav.suggest')}
                </Link>
              </Button>
            </div>
          </div>

          <div className="space-y-12">
            {/* Index Questions */}
            <div>
              <div className="mb-4">
                <div className="flex items-center gap-2 mb-2">
                  <h3 className="text-xl font-semibold">{t('home.index_questions.title')}</h3>
                  <Badge variant="outline" className="bg-primary/5 text-primary border-primary/20">{t('home.index_questions.badge')}</Badge>
                </div>
                <p className="text-sm text-muted-foreground">{t('home.index_questions.description')}</p>
              </div>
              {loading ? (
                <QuestionListSkeleton />
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {indexQuestions && indexQuestions.length > 0 ? (
                    indexQuestions.map((q) => (
                      <QuestionCard key={q.id} question={q} />
                    ))
                  ) : (
                    <p className="col-span-3 text-center text-muted-foreground">{t('home.index_questions.empty')}</p>
                  )}
                </div>
              )}
            </div>

            {/* Candidate Questions */}
            <div>
              <div className="mb-4">
                <div className="flex items-center gap-2 mb-2">
                  <h3 className="text-xl font-semibold">{t('home.candidate_questions.title')}</h3>
                  <Badge variant="outline" className="bg-secondary text-secondary-foreground">{t('home.candidate_questions.badge')}</Badge>
                </div>
                <p className="text-sm text-muted-foreground">{t('home.candidate_questions.description')}</p>
              </div>
              {loading ? (
                <QuestionListSkeleton />
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {candidateQuestions && candidateQuestions.length > 0 ? (
                    candidateQuestions.map((q) => (
                      <QuestionCard key={q.id} question={q} />
                    ))
                  ) : (
                    <p className="col-span-3 text-center text-muted-foreground">{t('home.candidate_questions.empty')}</p>
                  )}
                </div>
              )}
            </div>
          </div>

          <div className="mt-10 text-center">
            <Button variant="secondary" size="lg" asChild>
              <Link href="/questions">
                {t('home.contribute_more')}
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </main>
  )
}
