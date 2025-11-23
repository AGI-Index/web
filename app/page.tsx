"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { QuestionCard } from "@/components/feature/question-card"
import { ArrowRight, MessageSquare, Eye } from "lucide-react"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { supabase } from "@/lib/supabase"
import { useAuth } from "@/lib/auth-context"
import { QuestionListSkeleton } from "@/components/ui/loading-skeletons"

export default function Home() {
  const { user } = useAuth()
  const [indexQuestions, setIndexQuestions] = useState<any[]>([])
  const [candidateQuestions, setCandidateQuestions] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchQuestions() {
      setLoading(true)

      // Fetch user's votes if logged in
      let userVotedIds: number[] = []
      if (user) {
        const { data: votes } = await supabase
          .from('votes')
          .select('question_id')
          .eq('user_id', user.id)

        if (votes) {
          userVotedIds = votes.map(v => v.question_id)
        }
      }

      // Fetch Index Questions
      const { data: allIndexQuestions } = await supabase
        .from('questions')
        .select('*')
        .eq('is_indexed', true)

      // Fetch Candidate Questions
      const { data: allCandidateQuestions } = await supabase
        .from('questions')
        .select('*')
        .eq('is_indexed', false)

      // Filter and randomize
      if (allIndexQuestions) {
        const unvoted = allIndexQuestions.filter(q => !userVotedIds.includes(q.id))
        const toShow = unvoted.length >= 3 ? unvoted : allIndexQuestions
        const shuffled = toShow.sort(() => Math.random() - 0.5)
        setIndexQuestions(shuffled.slice(0, 3))
      }

      if (allCandidateQuestions) {
        const unvoted = allCandidateQuestions.filter(q => !userVotedIds.includes(q.id))
        const toShow = unvoted.length >= 3 ? unvoted : allCandidateQuestions
        const shuffled = toShow.sort(() => Math.random() - 0.5)
        setCandidateQuestions(shuffled.slice(0, 3))
      }

      setLoading(false)
    }

    fetchQuestions()
  }, [user])

  return (
    <main className="min-h-screen bg-background flex flex-col">
      {/* Hero Section */}
      <section className="relative py-20 md:py-32 overflow-hidden border-b">
        <div className="container px-4 md:px-6 mx-auto flex flex-col items-center text-center z-10 relative">
          <div className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80 mb-6">
            AGI Index Beta
          </div>
          <h1 className="text-4xl md:text-6xl font-bold tracking-tighter mb-4">
            Tracking the Arrival of <br className="hidden md:block" />
            <span className="text-primary">Artificial General Intelligence</span>
          </h1>
          <p className="text-muted-foreground max-w-[700px] text-lg md:text-xl mb-10">
            A community-driven platform defining and tracking AGI milestones through collective intelligence.
          </p>

          {/* AGI Progress Display */}
          <div className="flex flex-col md:flex-row items-center gap-8 md:gap-16 mb-12">
            <div className="flex flex-col items-center">
              <div className="relative flex items-center justify-center w-40 h-40 md:w-48 md:h-48 rounded-full border-8 border-primary/20">
                <div className="absolute inset-0 flex items-center justify-center flex-col">
                  <span className="text-4xl md:text-5xl font-bold">34%</span>
                  <span className="text-sm text-muted-foreground uppercase tracking-wider mt-1">AGI Level</span>
                </div>
                {/* Simple SVG Circle for progress visualization (static for now) */}
                <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r="46" fill="none" stroke="currentColor" strokeWidth="8" className="text-primary" strokeDasharray="289" strokeDashoffset="190" strokeLinecap="round" />
                </svg>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-x-12 gap-y-6 text-left">
              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <MessageSquare className="w-4 h-4" />
                  <span className="text-sm font-medium">Linguistic</span>
                </div>
                <span className="text-2xl font-bold">68%</span>
                <div className="h-1.5 w-24 bg-secondary rounded-full overflow-hidden">
                  <div className="h-full bg-blue-500 w-[68%]" />
                </div>
              </div>
              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Eye className="w-4 h-4" />
                  <span className="text-sm font-medium">Multimodal</span>
                </div>
                <span className="text-2xl font-bold">42%</span>
                <div className="h-1.5 w-24 bg-secondary rounded-full overflow-hidden">
                  <div className="h-full bg-green-500 w-[42%]" />
                </div>
              </div>

            </div>
          </div>

          <div className="flex gap-4">
            <Button size="lg" asChild>
              <Link href="/questions">
                View All Milestones <ArrowRight className="ml-2 w-4 h-4" />
              </Link>
            </Button>
            <Button variant="outline" size="lg">
              How it Works
            </Button>
          </div>
        </div>
      </section>

      {/* Quick Vote Section */}
      <section className="py-16 bg-secondary/20">
        <div className="container px-4 mx-auto">
          <div className="flex justify-between items-end mb-8">
            <div>
              <h2 className="text-3xl font-bold tracking-tight mb-2">Quick Vote</h2>
              <p className="text-muted-foreground">Help define the boundary of AGI by voting on these random questions.</p>
            </div>
            <Button variant="ghost" className="hidden md:flex">Refresh Questions</Button>
          </div>

          <div className="space-y-12">
            {/* Index Questions */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <h3 className="text-xl font-semibold">Index Questions</h3>
                <Badge variant="outline" className="bg-primary/5 text-primary border-primary/20">AGI Milestones</Badge>
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
                    <p className="col-span-3 text-center text-muted-foreground">No index questions yet. Start voting to create them!</p>
                  )}
                </div>
              )}
            </div>

            {/* Candidate Questions */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <h3 className="text-xl font-semibold">Candidate Questions</h3>
                <Badge variant="outline" className="bg-secondary text-secondary-foreground">Under Review</Badge>
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
                    <p className="col-span-3 text-center text-muted-foreground">No candidate questions yet.</p>
                  )}
                </div>
              )}
            </div>
          </div>

          <div className="mt-10 text-center">
            <Button variant="secondary" size="lg" asChild>
              <Link href="/questions">
                Contribute More Votes
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </main>
  )
}
