"use client"

import { useState, useEffect, useMemo } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { QuestionCard } from "@/components/feature/question-card"
import { BadgeCard, Badge as BadgeType } from "@/components/feature/badge-card"
import { AchievementPopup } from "@/components/feature/achievement-popup"
import { supabase } from "@/lib/supabase"
import { useAuth } from "@/lib/auth-context"
import { BADGE_DEFINITIONS } from "@/lib/badge-context"
import { ChevronDown, ChevronUp, MessageSquare, Eye, Clock, CheckCircle, XCircle, Pencil, Check, X, Vote, HelpCircle, Award } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { ProfileListSkeleton } from "@/components/ui/loading-skeletons"
import { useI18n } from "@/lib/i18n-context"
import { cn } from "@/lib/utils"

interface Translation {
    question_id: number
    lang_code: string
    content: string
}

export default function ProfilePage() {
    const { user, profile, loading, signOut, updateNickname, refreshProfile } = useAuth()
    const { t, language } = useI18n()
    const router = useRouter()

    // Nickname editing
    const [isEditingNickname, setIsEditingNickname] = useState(false)
    const [nicknameInput, setNicknameInput] = useState("")
    const [nicknameSaving, setNicknameSaving] = useState(false)

    // Badge popup
    const [selectedBadge, setSelectedBadge] = useState<BadgeType | null>(null)

    // Tab data (lazy loaded)
    const [activeTab, setActiveTab] = useState("achievements")
    const [votedQuestions, setVotedQuestions] = useState<any[]>([])
    const [authoredQuestions, setAuthoredQuestions] = useState<any[]>([])
    const [translations, setTranslations] = useState<Translation[]>([])
    const [expandedVotes, setExpandedVotes] = useState<Set<number>>(new Set())
    const [expandedAuthored, setExpandedAuthored] = useState<Set<number>>(new Set())
    const [votesLoading, setVotesLoading] = useState(false)
    const [questionsLoading, setQuestionsLoading] = useState(false)
    const [votesLoaded, setVotesLoaded] = useState(false)
    const [questionsLoaded, setQuestionsLoaded] = useState(false)

    useEffect(() => {
        if (loading) return
        if (!user) {
            router.push('/login')
            return
        }
        refreshProfile()
    }, [user, loading, router])

    // Load votes when tab is selected
    useEffect(() => {
        if (activeTab === 'votes' && !votesLoaded && user) {
            loadVotes()
        }
    }, [activeTab, votesLoaded, user])

    // Load questions when tab is selected
    useEffect(() => {
        if (activeTab === 'questions' && !questionsLoaded && user) {
            loadQuestions()
        }
    }, [activeTab, questionsLoaded, user])

    const loadVotes = async () => {
        if (!user) return
        setVotesLoading(true)

        const { data: votes } = await supabase
            .from('votes')
            .select(`*, questions (*)`)
            .eq('user_id', user.id)
            .order('updated_at', { ascending: false })

        if (votes) {
            setVotedQuestions((votes as any[]).filter(v => v.questions).map(v => v.questions))
        }

        // Fetch translations
        if (language !== 'en') {
            const { data: transData } = await supabase
                .from('question_translations')
                .select('question_id, lang_code, content')
                .eq('lang_code', language)
            if (transData) {
                setTranslations(transData)
            }
        }

        setVotesLoading(false)
        setVotesLoaded(true)
    }

    const loadQuestions = async () => {
        if (!user) return
        setQuestionsLoading(true)

        const { data: authored } = await supabase
            .from('questions')
            .select('*')
            .eq('author_id', user.id)
            .order('created_at', { ascending: false })

        if (authored) {
            setAuthoredQuestions(authored)
        }

        // Fetch translations if not already loaded
        if (language !== 'en' && translations.length === 0) {
            const { data: transData } = await supabase
                .from('question_translations')
                .select('question_id, lang_code, content')
                .eq('lang_code', language)
            if (transData) {
                setTranslations(transData)
            }
        }

        setQuestionsLoading(false)
        setQuestionsLoaded(true)
    }

    const handleNicknameEdit = () => {
        setNicknameInput(profile?.nickname || "")
        setIsEditingNickname(true)
    }

    const handleNicknameSave = async () => {
        if (!nicknameInput.trim()) return
        setNicknameSaving(true)
        await updateNickname(nicknameInput.trim())
        setNicknameSaving(false)
        setIsEditingNickname(false)
    }

    const handleNicknameCancel = () => {
        setIsEditingNickname(false)
        setNicknameInput("")
    }

    // Compute badges based on profile stats
    const badges = useMemo((): BadgeType[] => {
        const stats = {
            votes: profile?.total_vote_count || 0,
            questions: profile?.total_question_count || 0,
            approvedQuestions: profile?.total_approved_question_count || 0,
        }

        return BADGE_DEFINITIONS.map(badge => ({
            id: badge.id,
            titleKey: badge.titleKey,
            descriptionKey: badge.descriptionKey,
            conditionKey: badge.conditionKey,
            image: badge.image,
            isUnlocked: badge.check(stats),
        }))
    }, [profile])

    const unlockedCount = badges.filter(b => b.isUnlocked).length

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

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'pending':
                return (
                    <Badge variant="outline" className="bg-yellow-100 text-yellow-800 border-yellow-300 gap-1">
                        <Clock className="w-3 h-3" />
                        {t('profile.status.pending')}
                    </Badge>
                )
            case 'approved':
                return (
                    <Badge variant="outline" className="bg-green-100 text-green-800 border-green-300 gap-1">
                        <CheckCircle className="w-3 h-3" />
                        {t('profile.status.approved')}
                    </Badge>
                )
            case 'rejected':
                return (
                    <Badge variant="outline" className="bg-red-100 text-red-800 border-red-300 gap-1">
                        <XCircle className="w-3 h-3" />
                        {t('profile.status.rejected')}
                    </Badge>
                )
            default:
                return null
        }
    }

    // Create translation map for efficient lookup
    const translationMap = useMemo(() => {
        const map = new Map<number, string>()
        translations.forEach(t => map.set(t.question_id, t.content))
        return map
    }, [translations])

    // Apply translations to questions
    const translatedVotedQuestions = useMemo(() => {
        return votedQuestions
            .map(q => ({
                ...q,
                content: translationMap.get(q.id) || q.content
            }))
            .sort((a, b) => {
                if (a.is_indexed && !b.is_indexed) return -1
                if (!a.is_indexed && b.is_indexed) return 1
                return 0
            })
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
            {/* Header with nickname and logout */}
            <div className="flex justify-between items-start mb-8">
                <div className="space-y-1">
                    {/* Nickname */}
                    <div className="flex items-center gap-2">
                        {isEditingNickname ? (
                            <div className="flex items-center gap-2">
                                <Input
                                    value={nicknameInput}
                                    onChange={(e) => setNicknameInput(e.target.value)}
                                    className="h-9 w-48"
                                    placeholder={t('profile.nickname_placeholder')}
                                    disabled={nicknameSaving}
                                    maxLength={30}
                                />
                                <Button
                                    size="icon"
                                    variant="ghost"
                                    onClick={handleNicknameSave}
                                    disabled={nicknameSaving || !nicknameInput.trim()}
                                >
                                    <Check className="w-4 h-4 text-green-600" />
                                </Button>
                                <Button
                                    size="icon"
                                    variant="ghost"
                                    onClick={handleNicknameCancel}
                                    disabled={nicknameSaving}
                                >
                                    <X className="w-4 h-4 text-red-600" />
                                </Button>
                            </div>
                        ) : (
                            <>
                                <h1 className="text-3xl font-bold tracking-tight">
                                    {profile?.nickname || t('profile.anonymous')}
                                </h1>
                                <Button
                                    size="icon"
                                    variant="ghost"
                                    onClick={handleNicknameEdit}
                                    className="h-8 w-8"
                                >
                                    <Pencil className="w-4 h-4 text-muted-foreground" />
                                </Button>
                            </>
                        )}
                    </div>
                    <p className="text-muted-foreground">{user.email}</p>
                </div>
                <Button variant="outline" onClick={() => signOut()}>{t('profile.sign_out')}</Button>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-3 gap-4 mb-6">
                <Card>
                    <CardContent className="pt-6 text-center">
                        <Vote className="w-6 h-6 mx-auto mb-2 text-primary" />
                        <p className="text-2xl font-bold">{profile?.total_vote_count || 0}</p>
                        <p className="text-sm text-muted-foreground">{t('profile.stats.votes')}</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="pt-6 text-center">
                        <HelpCircle className="w-6 h-6 mx-auto mb-2 text-primary" />
                        <p className="text-2xl font-bold">{profile?.total_question_count || 0}</p>
                        <p className="text-sm text-muted-foreground">{t('profile.stats.questions')}</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="pt-6 text-center">
                        <Award className="w-6 h-6 mx-auto mb-2 text-primary" />
                        <p className="text-2xl font-bold">{unlockedCount}/{badges.length}</p>
                        <p className="text-sm text-muted-foreground">{t('profile.stats.badges')}</p>
                    </CardContent>
                </Card>
            </div>

            {/* Badges Section */}
            <div className="mb-8">
                <h2 className="text-xl font-semibold mb-4">{t('profile.badges.title')}</h2>
                <div className="grid grid-cols-5 gap-3">
                    {badges.map((badge) => (
                        <BadgeCard
                            key={badge.id}
                            badge={badge}
                            title={t(badge.titleKey)}
                            description={t(badge.descriptionKey)}
                            condition={t(badge.conditionKey)}
                            onClick={() => badge.isUnlocked && setSelectedBadge(badge)}
                        />
                    ))}
                </div>
            </div>

            {/* Tabs for Votes and Questions */}
            <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="mb-4">
                    <TabsTrigger value="votes">{t('profile.tabs.votes')}</TabsTrigger>
                    <TabsTrigger value="questions">{t('profile.tabs.questions')}</TabsTrigger>
                </TabsList>

                <TabsContent value="votes" className="space-y-2">
                    {votesLoading ? (
                        <ProfileListSkeleton />
                    ) : translatedVotedQuestions.length > 0 ? (
                        <div className="space-y-2">
                            {translatedVotedQuestions.map((question) => (
                                <div
                                    key={question.id}
                                    className={cn(
                                        "border rounded-lg overflow-hidden",
                                        !question.is_indexed && "bg-muted/50"
                                    )}
                                >
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
                    ) : !votesLoading && votesLoaded ? (
                        <div className="border border-dashed rounded-lg p-8 text-center">
                            <p className="text-muted-foreground mb-4">{t('profile.empty.votes')}</p>
                            <Button asChild>
                                <Link href="/questions">{t('profile.empty.browse')}</Link>
                            </Button>
                        </div>
                    ) : null}
                </TabsContent>

                <TabsContent value="questions" className="space-y-2">
                    {questionsLoading ? (
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
                                            {getStatusBadge(question.status)}
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
                                            {question.status === 'approved' ? (
                                                <QuestionCard question={question} />
                                            ) : (
                                                <div className="text-sm text-muted-foreground p-4 text-center">
                                                    {question.status === 'pending'
                                                        ? t('profile.status.pending_message')
                                                        : t('profile.status.rejected_message')
                                                    }
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    ) : !questionsLoading && questionsLoaded ? (
                        <div className="border border-dashed rounded-lg p-8 text-center">
                            <p className="text-muted-foreground mb-4">{t('profile.empty.questions')}</p>
                            <Button asChild>
                                <Link href="/suggest">{t('profile.empty.suggest')}</Link>
                            </Button>
                        </div>
                    ) : null}
                </TabsContent>
            </Tabs>

            {/* Achievement Popup */}
            {selectedBadge && (
                <AchievementPopup
                    isOpen={!!selectedBadge}
                    onClose={() => setSelectedBadge(null)}
                    title={t(selectedBadge.titleKey)}
                    description={t(selectedBadge.descriptionKey)}
                    image={selectedBadge.image}
                    stats={{
                        votes: profile?.total_vote_count || 0,
                        questions: profile?.total_question_count || 0
                    }}
                />
            )}
        </div>
    )
}
