"use client"

import { useState, useEffect, useMemo } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { QuestionCard } from "@/components/feature/question-card"
import { supabase } from "@/lib/supabase"
import { useAuth } from "@/lib/auth-context"
import { ChevronDown, ChevronUp, MessageSquare, Eye } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { ProfileListSkeleton } from "@/components/ui/loading-skeletons"
import { useI18n } from "@/lib/i18n-context"

interface Translation {
    question_id: number
    lang_code: string
    content: string
}

export default function ProfilePage() {
    const { user, signOut } = useAuth()
    const { t, language } = useI18n()
    const router = useRouter()
    const [votedQuestions, setVotedQuestions] = useState<any[]>([])
    const [authoredQuestions, setAuthoredQuestions] = useState<any[]>([])
    const [translations, setTranslations] = useState<Translation[]>([])
    const [expandedVotes, setExpandedVotes] = useState<Set<number>>(new Set())
    const [expandedAuthored, setExpandedAuthored] = useState<Set<number>>(new Set())
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        if (!user) {
            router.push('/login')
            return
        }

        const currentUser = user

        async function fetchUserData() {
            setLoading(true)

            // Fetch user's votes with question details
            const { data: votes } = await supabase
                .from('votes')
                .select(`
                    *,
                    questions (*)
                `)
                .eq('user_id', currentUser.id)
                .order('updated_at', { ascending: false })

            if (votes) {
                setVotedQuestions((votes as any[]).filter(v => v.questions).map(v => v.questions))
            }

            // Fetch user's authored questions
            const { data: authored } = await supabase
                .from('questions')
                .select('*')
                .eq('author_id', currentUser.id)
                .order('created_at', { ascending: false })

            if (authored) {
                setAuthoredQuestions(authored)
            }

            // Fetch translations for current language (skip if English)
            if (language !== 'en') {
                const { data: transData } = await supabase
                    .from('question_translations')
                    .select('question_id, lang_code, content')
                    .eq('lang_code', language)
                if (transData) {
                    setTranslations(transData)
                }
            } else {
                setTranslations([])
            }

            setLoading(false)
        }

        fetchUserData()
    }, [user, router, language])

    const toggleVoteExpand = (id: number) => {
        const newExpanded = new Set(expandedVotes)
        if (newExpanded.has(id)) {
            newExpanded.delete(id)
        } else {
            newExpanded.add(id)
        }
        setExpandedVotes(newExpanded)
    }

    const toggleAuthoredExpand = (id: number) => {
        const newExpanded = new Set(expandedAuthored)
        if (newExpanded.has(id)) {
            newExpanded.delete(id)
        } else {
            newExpanded.add(id)
        }
        setExpandedAuthored(newExpanded)
    }

    const getCategoryIcon = (category: string) => {
        if (category.toLowerCase() === 'linguistic') return <MessageSquare className="w-4 h-4 text-blue-600" />
        if (category.toLowerCase() === 'multimodal') return <Eye className="w-4 h-4 text-purple-600" />
        return null
    }

    const getCategoryColor = (category: string) => {
        if (category.toLowerCase() === 'linguistic') return "bg-blue-100 text-blue-800 border-blue-200"
        if (category.toLowerCase() === 'multimodal') return "bg-purple-100 text-purple-800 border-purple-200"
        return "bg-secondary text-secondary-foreground"
    }

    // Create translation map for efficient lookup
    const translationMap = useMemo(() => {
        const map = new Map<number, string>()
        translations.forEach(t => map.set(t.question_id, t.content))
        return map
    }, [translations])

    // Apply translations to questions
    const translatedVotedQuestions = useMemo(() => {
        return votedQuestions.map(q => ({
            ...q,
            content: translationMap.get(q.id) || q.content
        }))
    }, [votedQuestions, translationMap])

    const translatedAuthoredQuestions = useMemo(() => {
        return authoredQuestions.map(q => ({
            ...q,
            content: translationMap.get(q.id) || q.content
        }))
    }, [authoredQuestions, translationMap])

    if (!user) {
        return null
    }

    return (
        <div className="container py-8 max-w-4xl">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">{t('profile.title')}</h1>
                    <p className="text-muted-foreground">{user.email}</p>
                </div>
                <Button variant="outline" onClick={() => signOut()}>{t('profile.sign_out')}</Button>
            </div>

            <Tabs defaultValue="votes">
                <TabsList className="mb-4">
                    <TabsTrigger value="votes">{t('profile.tabs.votes')} ({votedQuestions.length})</TabsTrigger>
                    <TabsTrigger value="questions">{t('profile.tabs.questions')} ({authoredQuestions.length})</TabsTrigger>
                </TabsList>

                <TabsContent value="votes" className="space-y-2">
                    {loading ? (
                        <ProfileListSkeleton />
                    ) : translatedVotedQuestions.length > 0 ? (
                        <div className="space-y-2">
                            {translatedVotedQuestions.map((question) => (
                                <div key={question.id} className="border rounded-lg overflow-hidden">
                                    <button
                                        onClick={() => toggleVoteExpand(question.id)}
                                        className="w-full px-4 py-3 flex items-center justify-between hover:bg-secondary/50 transition-colors text-left"
                                    >
                                        <div className="flex items-center gap-3 flex-1 min-w-0">
                                            {getCategoryIcon(question.category)}
                                            <span className="font-medium truncate">{question.content}</span>
                                        </div>
                                        <div className="flex items-center gap-2 flex-shrink-0">
                                            <Badge variant="outline" className={getCategoryColor(question.category)}>
                                                {question.category}
                                            </Badge>
                                            {expandedVotes.has(question.id) ?
                                                <ChevronUp className="w-5 h-5" /> :
                                                <ChevronDown className="w-5 h-5" />
                                            }
                                        </div>
                                    </button>
                                    {expandedVotes.has(question.id) && (
                                        <div className="border-t p-4 bg-secondary/20">
                                            <QuestionCard
                                                question={question}
                                                isEditMode={true}
                                            />
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="border border-dashed rounded-lg p-8 text-center">
                            <p className="text-muted-foreground mb-4">{t('profile.empty.votes')}</p>
                            <Button asChild>
                                <Link href="/questions">{t('profile.empty.browse')}</Link>
                            </Button>
                        </div>
                    )}
                </TabsContent>

                <TabsContent value="questions" className="space-y-2">
                    {loading ? (
                        <ProfileListSkeleton />
                    ) : translatedAuthoredQuestions.length > 0 ? (
                        <div className="space-y-2">
                            {translatedAuthoredQuestions.map((question) => (
                                <div key={question.id} className="border rounded-lg overflow-hidden">
                                    <button
                                        onClick={() => toggleAuthoredExpand(question.id)}
                                        className="w-full px-4 py-3 flex items-center justify-between hover:bg-secondary/50 transition-colors text-left"
                                    >
                                        <div className="flex items-center gap-3 flex-1 min-w-0">
                                            {getCategoryIcon(question.category)}
                                            <span className="font-medium truncate">{question.content}</span>
                                        </div>
                                        <div className="flex items-center gap-2 flex-shrink-0">
                                            <Badge variant="outline" className={getCategoryColor(question.category)}>
                                                {question.category}
                                            </Badge>
                                            {expandedAuthored.has(question.id) ?
                                                <ChevronUp className="w-5 h-5" /> :
                                                <ChevronDown className="w-5 h-5" />
                                            }
                                        </div>
                                    </button>
                                    {expandedAuthored.has(question.id) && (
                                        <div className="border-t p-4 bg-secondary/20">
                                            <QuestionCard question={question} />
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="border border-dashed rounded-lg p-8 text-center">
                            <p className="text-muted-foreground mb-4">{t('profile.empty.questions')}</p>
                            <Button asChild>
                                <Link href="/suggest">{t('profile.empty.suggest')}</Link>
                            </Button>
                        </div>
                    )}
                </TabsContent>
            </Tabs>
        </div>
    )
}
