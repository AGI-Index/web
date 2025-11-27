"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { CheckCircle, XCircle, BarChart2, Check, ChevronDown, ChevronUp, Info } from "lucide-react"
import { Database } from "@/types/database"
import { cn } from "@/lib/utils"
import { supabase } from "@/lib/supabase"
import { useAuth } from "@/lib/auth-context"
import { isIndexQuestion } from "@/lib/utils"
import { useI18n } from "@/lib/i18n-context"
import { useBadge, BadgeStats } from "@/lib/badge-context"

type Question = Database['public']['Tables']['questions']['Row']

interface QuestionCardProps {
    question: Question
    isEditMode?: boolean
}

export function QuestionCard({ question, isEditMode = false }: QuestionCardProps) {
    const { user, profile, refreshProfile } = useAuth()
    const { t } = useI18n()
    const { checkNewBadges } = useBadge()
    const router = useRouter()
    const [isEditing, setIsEditing] = useState(isEditMode)
    const [userVote, setUserVote] = useState<any>(null)
    const [loading, setLoading] = useState(false)
    const [localQuestion, setLocalQuestion] = useState(question)

    // Voting State
    const [selectedSuitable, setSelectedSuitable] = useState<boolean | null>(null)
    const [selectedAchieved, setSelectedAchieved] = useState<boolean | null>(null)
    const [showSuitabilityOption, setShowSuitabilityOption] = useState(false)
    const [showCategoryInfo, setShowCategoryInfo] = useState(false)

    const isIndex = isIndexQuestion(localQuestion)

    // Calculate achievement rate for Index questions
    const achievedTotal = (localQuestion.achieved_count || 0) + (localQuestion.not_achieved_count || 0)
    const achievedPercentage = achievedTotal > 0
        ? Math.round((localQuestion.achieved_count || 0) / achievedTotal * 100)
        : 0

    // Calculate suitability rate for Candidate questions
    const suitableTotal = (localQuestion.suitable_count || 0) + (localQuestion.unsuitable_count || 0)
    const suitablePercentage = suitableTotal > 0
        ? Math.round((localQuestion.suitable_count || 0) / suitableTotal * 100)
        : 0

    // Display percentage based on question type
    const displayPercentage = isIndex ? achievedPercentage : suitablePercentage

    // Fetch user's existing vote
    useEffect(() => {
        async function fetchUserVote() {
            if (!user) return

            const { data } = await supabase
                .from('votes')
                .select('*')
                .eq('question_id', question.id)
                .eq('user_id', user.id)
                .maybeSingle()

            if (data) {
                const voteData = data as any
                setUserVote(voteData)
                if (isEditMode) {
                    setSelectedSuitable(voteData.is_suitable)
                    setSelectedAchieved(voteData.is_achieved)
                }
            }
        }

        fetchUserVote()
    }, [user, question.id, isEditMode])

    const getCategoryColor = (category: string) => {
        if (category.toLowerCase() === 'linguistic') return "bg-blue-100 text-blue-800 border-blue-200 hover:bg-blue-100"
        if (category.toLowerCase() === 'multimodal') return "bg-purple-100 text-purple-800 border-purple-200 hover:bg-purple-100"
        return "bg-secondary text-secondary-foreground"
    }

    const handleVoteSubmit = async () => {
        if (!user) {
            router.push('/login')
            return
        }

        setLoading(true)

        try {
            let voteData: any = {
                user_id: user.id,
                question_id: question.id,
            }

            if (isIndex) {
                if (selectedAchieved !== null) {
                    // Index question: default to suitable=true, but allow override
                    voteData.is_suitable = selectedSuitable !== null ? selectedSuitable : true
                    voteData.is_achieved = selectedAchieved
                }
            } else {
                // Candidate Question Logic
                if (selectedSuitable === true && selectedAchieved !== null) {
                    voteData.is_suitable = true
                    voteData.is_achieved = selectedAchieved
                } else if (selectedSuitable === false) {
                    voteData.is_suitable = false
                }
            }

            const { error } = await supabase
                .from('votes')
                .upsert(voteData, {
                    onConflict: 'user_id,question_id'
                })

            if (error) {
                console.error('Vote error:', error)
                alert('Failed to save vote: ' + error.message)
            } else {
                // Check for new badge unlocks
                const prevStats: BadgeStats | null = profile ? {
                    votes: profile.total_vote_count,
                    questions: profile.total_question_count,
                    approvedQuestions: profile.total_approved_question_count,
                } : null

                const { newProfile } = await refreshProfile()

                if (newProfile) {
                    const newStats: BadgeStats = {
                        votes: newProfile.total_vote_count,
                        questions: newProfile.total_question_count,
                        approvedQuestions: newProfile.total_approved_question_count,
                    }
                    checkNewBadges(prevStats, newStats)
                }

                // Optimistic update: Update local state instead of reloading
                setUserVote(voteData)
                setIsEditing(false)

                // Optimistic update for counts
                setLocalQuestion(prev => {
                    const updated = { ...prev }

                    // If previous vote exists, subtract old values first
                    if (userVote) {
                        if (userVote.is_achieved === true) {
                            updated.achieved_count = Math.max(0, (prev.achieved_count || 0) - 1)
                        } else if (userVote.is_achieved === false) {
                            updated.not_achieved_count = Math.max(0, (prev.not_achieved_count || 0) - 1)
                        }

                        if (userVote.is_suitable === true) {
                            updated.suitable_count = Math.max(0, (prev.suitable_count || 0) - 1)
                        } else if (userVote.is_suitable === false) {
                            updated.unsuitable_count = Math.max(0, (prev.unsuitable_count || 0) - 1)
                        }
                    }

                    // Add new vote values
                    if (voteData.is_achieved === true) {
                        updated.achieved_count = (updated.achieved_count || 0) + 1
                    } else if (voteData.is_achieved === false) {
                        updated.not_achieved_count = (updated.not_achieved_count || 0) + 1
                    }

                    if (voteData.is_suitable === true) {
                        updated.suitable_count = (updated.suitable_count || 0) + 1
                    } else if (voteData.is_suitable === false) {
                        updated.unsuitable_count = (updated.unsuitable_count || 0) + 1
                    }

                    return updated
                })

                // Reset voting state to show the vote was saved
                setSelectedSuitable(null)
                setSelectedAchieved(null)
                setShowSuitabilityOption(false)
            }
        } catch (err) {
            console.error('Vote error:', err)
            alert('An error occurred while saving your vote. Please try again.')
        } finally {
            setLoading(false)
        }
    }

    // Render Suitability Option for Index Questions
    const renderSuitabilityOption = () => (
        <div className="border-t pt-2">
            <Button
                variant="ghost"
                size="sm"
                className="w-full flex justify-between text-xs text-muted-foreground h-8"
                onClick={() => setShowSuitabilityOption(!showSuitabilityOption)}
            >
                <span>{t('question_card.suitability_option')}</span>
                {showSuitabilityOption ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
            </Button>

            {showSuitabilityOption && (
                <div className="pt-3 animate-in fade-in slide-in-from-top-1">
                    <div className="grid grid-cols-2 gap-2">
                        <Button
                            variant={selectedSuitable === true ? "default" : "outline"}
                            size="sm"
                            className={cn("w-full gap-1 text-xs", selectedSuitable === true && "bg-primary text-primary-foreground")}
                            onClick={() => setSelectedSuitable(true)}
                        >
                            <Check className="w-3 h-3" /> {t('question_card.suitable')}
                        </Button>
                        <Button
                            variant={selectedSuitable === false ? "destructive" : "outline"}
                            size="sm"
                            className={cn("w-full gap-1 text-xs", selectedSuitable === false && "bg-destructive text-destructive-foreground")}
                            onClick={() => setSelectedSuitable(false)}
                        >
                            <XCircle className="w-3 h-3" /> {t('question_card.unsuitable')}
                        </Button>
                    </div>
                </div>
            )}
        </div>
    )

    const getCategoryLabel = (category: string) => {
        if (category.toLowerCase() === 'linguistic') return t('questions.category.linguistic')
        if (category.toLowerCase() === 'multimodal') return t('questions.category.multimodal')
        return category
    }

    const getCategoryDescription = (category: string) => {
        if (category.toLowerCase() === 'linguistic') return t('suggest.categories.linguistic_desc')
        if (category.toLowerCase() === 'multimodal') return t('suggest.categories.multimodal_desc')
        return ''
    }

    return (
        <Card className={cn(
            "w-full hover:shadow-md transition-shadow duration-200 border-l-4 flex flex-col h-full",
            isIndex ? "border-l-primary/30" : "border-l-muted-foreground/30 bg-muted/40"
        )}>
            <CardHeader className="pb-3">
                <div className="flex justify-between items-start gap-4 mb-2">
                    <div className="flex items-center gap-2">
                        <Badge variant="outline" className={cn("text-xs border-0", getCategoryColor(question.category))}>
                            {getCategoryLabel(question.category)}
                        </Badge>
                        <button
                            type="button"
                            onClick={() => setShowCategoryInfo(!showCategoryInfo)}
                            className="text-muted-foreground hover:text-foreground transition-colors"
                        >
                            <Info className="w-3.5 h-3.5" />
                        </button>
                    </div>
                    <div className="flex gap-2">
                        <Badge variant="secondary" className="flex gap-1 items-center text-xs">
                            <BarChart2 className="w-3 h-3" />
                            {question.vote_count}
                        </Badge>
                    </div>
                </div>
                {showCategoryInfo && (
                    <p className="text-xs text-muted-foreground bg-secondary/50 p-2 rounded-md mb-2 animate-in fade-in slide-in-from-top-1">
                        {getCategoryDescription(question.category)}
                    </p>
                )}
                <CardTitle className="text-base md:text-lg font-medium leading-snug min-h-[3.5rem]">
                    {question.content}
                </CardTitle>
            </CardHeader>

            <CardContent className="pb-3 flex-grow">
                {userVote ? (
                    <div className="space-y-2">
                        <div className="flex justify-between text-xs text-muted-foreground">
                            <span>{t('question_card.consensus')}</span>
                            <span>
                                {displayPercentage}% {isIndex ? t('question_card.achieved') : t('question_card.suitable')}
                            </span>
                        </div>
                        <Progress
                            value={displayPercentage}
                            className="h-2"
                            indicatorClassName={cn(
                                isIndex
                                    ? (displayPercentage >= 50 ? "bg-green-500" : "bg-blue-500")
                                    : (displayPercentage >= 50 ? "bg-primary" : "bg-amber-500")
                            )}
                        />
                    </div>
                ) : (
                    <div className="text-xs text-muted-foreground text-center py-2">
                        {t('question_card.vote_to_see_results')}
                    </div>
                )}
            </CardContent>

            <CardFooter className="pt-0 pb-4 flex flex-col gap-3">
                {userVote && !isEditing ? (
                    <div className="w-full flex items-center justify-between text-sm text-muted-foreground bg-secondary/30 p-3 rounded-md">
                        <span className="flex items-center gap-2">
                            {t('question_card.you_voted')}
                            {userVote.is_suitable ? (
                                <span className="font-medium text-primary flex items-center gap-1">
                                    <CheckCircle className="w-4 h-4" />
                                    {userVote.is_achieved ? t('question_card.achieved') : t('question_card.not_yet')}
                                </span>
                            ) : (
                                <span className="font-medium text-destructive flex items-center gap-1"><XCircle className="w-4 h-4" /> {t('question_card.unsuitable')}</span>
                            )}
                        </span>
                        <Button variant="ghost" size="sm" className="h-auto p-0 text-xs underline" onClick={() => setIsEditing(true)}>{t('question_card.edit')}</Button>
                    </div>
                ) : (
                    <div className="w-full space-y-4">
                        {isIndex ? (
                            // Index Question Voting Flow: Achieved/Not Yet first, Suitability optional
                            <div className="flex flex-col gap-3">
                                <div className="grid grid-cols-2 gap-3">
                                    <Button
                                        variant={selectedAchieved === true ? "default" : "outline"}
                                        className={cn(
                                            "w-full gap-2 hover:bg-green-50 hover:text-green-700 hover:border-green-200",
                                            selectedAchieved === true && "bg-green-600 hover:bg-green-700 text-white hover:text-white border-transparent"
                                        )}
                                        onClick={() => setSelectedAchieved(true)}
                                    >
                                        <CheckCircle className="w-4 h-4" /> {t('question_card.achieved')}
                                    </Button>
                                    <Button
                                        variant={selectedAchieved === false ? "default" : "outline"}
                                        className={cn(
                                            "w-full gap-2 hover:bg-blue-50 hover:text-blue-700 hover:border-blue-200",
                                            selectedAchieved === false && "bg-blue-600 hover:bg-blue-700 text-white hover:text-white border-transparent"
                                        )}
                                        onClick={() => setSelectedAchieved(false)}
                                    >
                                        <div className="w-4 h-4 rounded-full border-2 border-current" /> {t('question_card.not_yet')}
                                    </Button>
                                </div>

                                {renderSuitabilityOption()}

                                {selectedAchieved !== null && (
                                    <Button className="w-full animate-in fade-in slide-in-from-top-1" onClick={handleVoteSubmit}>
                                        {t('question_card.submit_vote')}
                                    </Button>
                                )}
                            </div>
                        ) : (
                            // Candidate Question Voting Flow
                            <div className="flex flex-col gap-3">
                                <div className="grid grid-cols-2 gap-3">
                                    <Button
                                        variant={selectedSuitable === true ? "default" : "outline"}
                                        className={cn("w-full gap-2", selectedSuitable === true && "bg-primary text-primary-foreground")}
                                        onClick={() => setSelectedSuitable(true)}
                                    >
                                        <Check className="w-4 h-4" /> {t('question_card.suitable')}
                                    </Button>
                                    <Button
                                        variant={selectedSuitable === false ? "destructive" : "outline"}
                                        className={cn("w-full gap-2", selectedSuitable === false && "bg-destructive text-destructive-foreground")}
                                        onClick={() => { setSelectedSuitable(false); setSelectedAchieved(null); }}
                                    >
                                        <XCircle className="w-4 h-4" /> {t('question_card.unsuitable')}
                                    </Button>
                                </div>

                                {selectedSuitable === true && (
                                    <div className="space-y-3 animate-in fade-in slide-in-from-top-2">
                                        <div className="grid grid-cols-2 gap-3">
                                            <Button
                                                variant={selectedAchieved === true ? "default" : "secondary"}
                                                className={cn("w-full gap-2", selectedAchieved === true && "bg-green-600 hover:bg-green-700 text-white")}
                                                onClick={() => setSelectedAchieved(true)}
                                            >
                                                {t('question_card.achieved')}
                                            </Button>
                                            <Button
                                                variant={selectedAchieved === false ? "default" : "secondary"}
                                                className={cn("w-full gap-2", selectedAchieved === false && "bg-blue-600 hover:bg-blue-700 text-white")}
                                                onClick={() => setSelectedAchieved(false)}
                                            >
                                                {t('question_card.not_yet')}
                                            </Button>
                                        </div>

                                        {selectedAchieved !== null && (
                                            <Button className="w-full" onClick={handleVoteSubmit}>
                                                {t('question_card.submit_vote')}
                                            </Button>
                                        )}
                                    </div>
                                )}

                                {selectedSuitable === false && (
                                    <Button className="w-full animate-in fade-in slide-in-from-top-2" onClick={handleVoteSubmit}>
                                        {t('question_card.submit_vote')}
                                    </Button>
                                )}
                            </div>
                        )}
                    </div>
                )}
            </CardFooter>
        </Card>
    )
}
