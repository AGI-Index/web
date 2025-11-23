"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { ThumbsUp, ThumbsDown, CheckCircle, XCircle, BarChart2, AlertCircle, Check, ChevronDown, ChevronUp } from "lucide-react"
import { Database } from "@/types/database"
import { cn } from "@/lib/utils"
import { Label } from "@/components/ui/label"
import { supabase } from "@/lib/supabase"
import { useAuth } from "@/lib/auth-context"
import { isIndexQuestion } from "@/lib/utils"
import { useI18n } from "@/lib/i18n-context"

type Question = Database['public']['Tables']['questions']['Row'] & {
    achieved_count?: number
    suitable_votes?: number
    unsuitable_votes?: number
}

interface QuestionCardProps {
    question: Question
    isEditMode?: boolean
}

export function QuestionCard({ question, isEditMode = false }: QuestionCardProps) {
    const { user } = useAuth()
    const { t } = useI18n()
    const router = useRouter()
    const [showDetails, setShowDetails] = useState(false)
    const [isEditing, setIsEditing] = useState(isEditMode)
    const [userVote, setUserVote] = useState<any>(null)
    const [loading, setLoading] = useState(false)

    // Voting State
    const [selectedSuitable, setSelectedSuitable] = useState<boolean | null>(null)
    const [selectedAchieved, setSelectedAchieved] = useState<boolean | null>(null)
    const [selectedWeight, setSelectedWeight] = useState<number | null>(null)
    const [unsuitableReason, setUnsuitableReason] = useState<string | null>(null)
    const [customReason, setCustomReason] = useState("")

    const isIndex = isIndexQuestion(question)
    const achievedCount = question.achieved_count || 0
    const voteCount = question.vote_count || 1
    const achievedPercentage = Math.round((achievedCount / voteCount) * 100)

    // Fetch user's existing vote
    useEffect(() => {
        async function fetchUserVote() {
            if (!user) return

            const { data } = await supabase
                .from('votes')
                .select('*')
                .eq('question_id', question.id)
                .eq('user_id', user.id)
                .single()

            if (data) {
                const voteData = data as any
                setUserVote(voteData)
                if (isEditMode) {
                    setSelectedSuitable(voteData.is_suitable)
                    setSelectedAchieved(voteData.is_achieved)
                    setSelectedWeight(voteData.weight)
                    setUnsuitableReason(voteData.unsuitable_reason)
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
                    voteData.is_suitable = true
                    voteData.is_achieved = selectedAchieved
                    voteData.weight = selectedWeight
                }
            } else {
                // Candidate Question Logic
                if (selectedSuitable === true && selectedAchieved !== null) {
                    voteData.is_suitable = true
                    voteData.is_achieved = selectedAchieved
                    voteData.weight = selectedWeight
                } else if (selectedSuitable === false) {
                    const finalReason = unsuitableReason === "other" ? customReason : unsuitableReason
                    voteData.is_suitable = false
                    voteData.unsuitable_reason = finalReason
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
                // Optimistic update: Update local state instead of reloading
                setUserVote(voteData)
                setIsEditing(false)

                // Reset voting state to show the vote was saved
                setSelectedSuitable(null)
                setSelectedAchieved(null)
                setSelectedWeight(null)
                setUnsuitableReason(null)
                setCustomReason("")
            }
        } catch (err) {
            console.error('Vote error:', err)
            alert('An error occurred while saving your vote. Please try again.')
        } finally {
            setLoading(false)
        }
    }

    const toggleWeight = (weight: number) => {
        setSelectedWeight(prev => prev === weight ? null : weight)
    }

    // Render Advanced Options (Shared between Index and Candidate-Suitable)
    const renderAdvancedOptions = () => (
        <div className="border-t pt-2">
            <Button
                variant="ghost"
                size="sm"
                className="w-full flex justify-between text-xs text-muted-foreground h-8"
                onClick={() => setShowDetails(!showDetails)}
            >
                <span>{t('question_card.advanced_options')}</span>
                {showDetails ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
            </Button>

            {showDetails && (
                <div className="pt-3 space-y-4 animate-in fade-in slide-in-from-top-1">
                    <div className="space-y-2">
                        <div className="flex justify-between">
                            <Label className="text-xs">{t('question_card.importance_weight')}</Label>
                        </div>
                        <div className="flex gap-2">
                            {[1, 2, 3].map((w) => (
                                <Button
                                    key={w}
                                    variant={selectedWeight === w ? "default" : "outline"}
                                    size="sm"
                                    className={cn(
                                        "flex-1 text-xs h-7",
                                        selectedWeight === w && "bg-primary text-primary-foreground"
                                    )}
                                    onClick={() => toggleWeight(w)}
                                >
                                    {w === 1 ? t('question_card.weight.low') : w === 2 ? t('question_card.weight.med') : t('question_card.weight.high')}
                                </Button>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    )

    return (
        <Card className="w-full hover:shadow-md transition-shadow duration-200 border-l-4 border-l-primary/20 flex flex-col h-full">
            <CardHeader className="pb-3">
                <div className="flex justify-between items-start gap-4 mb-2">
                    <div className="flex gap-2">
                        <Badge variant="outline" className={cn("text-xs border-0", getCategoryColor(question.category))}>
                            {question.category}
                        </Badge>
                        {isIndex && (
                            <Badge variant="outline" className="text-xs border-primary/50 text-primary bg-primary/5">
                                {t('question_card.index_badge')}
                            </Badge>
                        )}
                    </div>
                    <div className="flex gap-2">
                        <Badge variant="secondary" className="flex gap-1 items-center text-xs">
                            <BarChart2 className="w-3 h-3" />
                            {question.vote_count}
                        </Badge>
                    </div>
                </div>
                <CardTitle className="text-base md:text-lg font-medium leading-snug min-h-[3.5rem]">
                    {question.content}
                </CardTitle>
            </CardHeader>

            <CardContent className="pb-3 flex-grow">
                <div className="space-y-2">
                    <div className="flex justify-between text-xs text-muted-foreground">
                        <span>{t('question_card.consensus')}</span>
                        <span>{achievedPercentage}% {t('question_card.achieved')}</span>
                    </div>
                    <Progress value={achievedPercentage} className="h-2" indicatorClassName={cn(achievedPercentage >= 50 ? "bg-green-500" : "bg-blue-500")} />
                </div>
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
                            // Index Question Voting Flow
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

                                {renderAdvancedOptions()}

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
                                        onClick={() => { setSelectedSuitable(true); setUnsuitableReason(null); }}
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

                                        {renderAdvancedOptions()}

                                        {selectedAchieved !== null && (
                                            <Button className="w-full" onClick={handleVoteSubmit}>
                                                {t('question_card.submit_vote')}
                                            </Button>
                                        )}
                                    </div>
                                )}

                                {selectedSuitable === false && (
                                    <div className="space-y-3 animate-in fade-in slide-in-from-top-2">
                                        <Label className="text-xs">{t('question_card.why_unsuitable')}</Label>
                                        <div className="flex flex-wrap gap-2">
                                            {["too_broad", "too_narrow", "duplicate", "other"].map((reason) => (
                                                <Button
                                                    key={reason}
                                                    type="button"
                                                    variant={unsuitableReason === reason ? "default" : "outline"}
                                                    size="sm"
                                                    onClick={() => setUnsuitableReason(reason)}
                                                >
                                                    {reason === "too_broad" ? t('question_card.reasons.too_broad') :
                                                        reason === "too_narrow" ? t('question_card.reasons.too_narrow') :
                                                            reason === "duplicate" ? t('question_card.reasons.duplicate') : t('question_card.reasons.other')}
                                                </Button>
                                            ))}
                                        </div>

                                        {unsuitableReason === "other" && (
                                            <input
                                                type="text"
                                                className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                                                placeholder={t('question_card.specify_placeholder')}
                                                value={customReason}
                                                onChange={(e) => setCustomReason(e.target.value)}
                                            />
                                        )}

                                        {unsuitableReason && (unsuitableReason !== "Other" || customReason.length > 0) && (
                                            <Button className="w-full" onClick={handleVoteSubmit}>
                                                {t('question_card.submit_vote')}
                                            </Button>
                                        )}
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                )}
            </CardFooter>
        </Card>
    )
}
