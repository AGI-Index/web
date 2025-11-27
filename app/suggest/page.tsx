"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Progress } from "@/components/ui/progress"
import { CheckCircle2, Loader2, CircleCheck, MapPin, Search, MessageSquare, Eye, Vote } from "lucide-react"
import { useI18n } from "@/lib/i18n-context"
import { useAuth } from "@/lib/auth-context"
import { useBadge, BADGE_DEFINITIONS } from "@/lib/badge-context"
import { supabase } from "@/lib/supabase"
import { cn } from "@/lib/utils"

const REQUIRED_VOTES = 5

export default function SuggestPage() {
    const { t, tArray } = useI18n()
    const { user, profile, loading: authLoading } = useAuth()
    const { showBadge } = useBadge()
    const router = useRouter()
    const [category, setCategory] = useState<"linguistic" | "multimodal" | "">("")
    const [question, setQuestion] = useState<string>("")
    const [submitted, setSubmitted] = useState(false)
    const [submitting, setSubmitting] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const voteCount = profile?.total_vote_count || 0
    const canSuggest = voteCount >= REQUIRED_VOTES

    // Redirect to login if not authenticated
    useEffect(() => {
        if (!authLoading && !user) {
            router.push('/login')
        }
    }, [user, authLoading, router])

    // Show loading state while checking auth
    if (authLoading || !user) {
        return (
            <div className="container mx-auto px-4 py-8 max-w-7xl flex items-center justify-center min-h-[50vh]">
                <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
            </div>
        )
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!category || !question.trim() || !user) return

        setSubmitting(true)
        setError(null)

        try {
            // Get current session for authorization
            const { data: { session } } = await supabase.auth.getSession()
            if (!session) {
                throw new Error('No active session')
            }

            // Fire-and-forget: Call Edge Function without waiting for response
            supabase.functions.invoke('submit-question', {
                body: {
                    content: question.trim(),
                    category: category,
                },
            }).catch(err => {
                // Log error but don't show to user - processing happens in background
                console.error('Background processing error:', err)
            })

            // Immediately show success - review happens in background
            setSubmitted(true)

            // Show first_question badge if this is user's first question
            if (profile?.total_question_count === 0) {
                const firstQuestionBadge = BADGE_DEFINITIONS.find(b => b.id === 'first_question')
                if (firstQuestionBadge) {
                    showBadge(firstQuestionBadge)
                }
            }

            setTimeout(() => {
                setSubmitted(false)
                setCategory("")
                setQuestion("")
            }, 3000)
        } catch (err) {
            console.error('Submit error:', err)
            setError('An unexpected error occurred')
        } finally {
            setSubmitting(false)
        }
    }

    // 번역 파일에서 예시 가져오기
    const examples = category ? tArray(`suggest.examples.${category}`) : []

    return (
        <div className="relative">
            {/* Vote Required Overlay Modal */}
            {!canSuggest && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    {/* Backdrop */}
                    <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" />

                    {/* Modal */}
                    <Card className="relative z-10 w-full max-w-md animate-in fade-in zoom-in-95 duration-300">
                        <CardContent className="pt-6 text-center space-y-4">
                            <div className="w-16 h-16 mx-auto rounded-full bg-primary/10 flex items-center justify-center">
                                <Vote className="w-8 h-8 text-primary" />
                            </div>

                            <div className="space-y-2">
                                <h2 className="text-xl font-semibold">{t('suggest.vote_required.title')}</h2>
                                <p className="text-muted-foreground text-sm">
                                    {t('suggest.vote_required.description')}
                                </p>
                            </div>

                            <div className="space-y-2 pt-2">
                                <div className="flex justify-between text-sm">
                                    <span className="text-muted-foreground">{t('suggest.vote_required.current')}</span>
                                    <span className="font-medium">{voteCount} / {REQUIRED_VOTES}</span>
                                </div>
                                <Progress value={(voteCount / REQUIRED_VOTES) * 100} className="h-2" />
                            </div>

                            <Button asChild className="w-full mt-4">
                                <Link href="/questions">
                                    {t('suggest.vote_required.cta')}
                                </Link>
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            )}

            <div className={cn(
                "container mx-auto px-4 py-8 max-w-6xl",
                !canSuggest && "blur-sm pointer-events-none select-none"
            )}>
                <div className="mb-8">
                    <h1 className="text-3xl md:text-4xl font-bold mb-3">{t('suggest.title')}</h1>
                    <p className="text-muted-foreground text-lg">
                        {t('suggest.description')}
                    </p>
                </div>

                <div className="grid lg:grid-cols-2 gap-8">
                {/* Left Panel: Guide */}
                <Card className="h-fit">
                    <CardHeader>
                        <CardTitle>{t('suggest.guide.title')}</CardTitle>
                        <p className="text-muted-foreground text-sm mt-2">
                            {t('suggest.guide.description')}
                        </p>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {/* 3 Principles */}
                        <div className="space-y-3">
                            <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
                                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                                    <CircleCheck className="w-4 h-4 text-primary" />
                                </div>
                                <div>
                                    <h4 className="font-medium text-sm">{t('suggest.guide.principles.clear_answer.title')}</h4>
                                    <p className="text-xs text-muted-foreground mt-0.5">
                                        {t('suggest.guide.principles.clear_answer.desc')}
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
                                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                                    <MapPin className="w-4 h-4 text-primary" />
                                </div>
                                <div>
                                    <h4 className="font-medium text-sm">{t('suggest.guide.principles.map_point.title')}</h4>
                                    <p className="text-xs text-muted-foreground mt-0.5">
                                        {t('suggest.guide.principles.map_point.desc')}
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
                                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                                    <Search className="w-4 h-4 text-primary" />
                                </div>
                                <div>
                                    <h4 className="font-medium text-sm">{t('suggest.guide.principles.new_perspective.title')}</h4>
                                    <p className="text-xs text-muted-foreground mt-0.5">
                                        {t('suggest.guide.principles.new_perspective.desc')}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Footer */}
                        <p className="text-sm text-center text-muted-foreground pt-4 border-t italic">
                            {t('suggest.guide.footer')}
                        </p>
                    </CardContent>
                </Card>

                {/* Right Panel: Form */}
                <Card>
                    <CardHeader>
                        <CardTitle>{t('suggest.form.title')}</CardTitle>
                        <p className="text-muted-foreground text-sm">
                            {t('suggest.form.description')}
                        </p>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* Step 1: Category Selection */}
                            <div className="space-y-3">
                                <Label className="text-base font-medium">{t('suggest.form.category_select')}</Label>
                                <div className="grid grid-cols-2 gap-3">
                                    <button
                                        type="button"
                                        onClick={() => setCategory("linguistic")}
                                        className={cn(
                                            "p-4 rounded-lg border-2 text-left transition-all",
                                            category === "linguistic"
                                                ? "border-blue-500 bg-blue-50 dark:bg-blue-950/30"
                                                : "border-border hover:border-blue-300 hover:bg-blue-50/50 dark:hover:bg-blue-950/20"
                                        )}
                                    >
                                        <div className="flex items-center gap-2 mb-2">
                                            <MessageSquare className="w-5 h-5 text-blue-600" />
                                            <span className="font-semibold">{t('suggest.categories.linguistic_title')}</span>
                                        </div>
                                        <p className="text-xs text-muted-foreground">
                                            {t('suggest.categories.linguistic_desc')}
                                        </p>
                                    </button>

                                    <button
                                        type="button"
                                        onClick={() => setCategory("multimodal")}
                                        className={cn(
                                            "p-4 rounded-lg border-2 text-left transition-all",
                                            category === "multimodal"
                                                ? "border-purple-500 bg-purple-50 dark:bg-purple-950/30"
                                                : "border-border hover:border-purple-300 hover:bg-purple-50/50 dark:hover:bg-purple-950/20"
                                        )}
                                    >
                                        <div className="flex items-center gap-2 mb-2">
                                            <Eye className="w-5 h-5 text-purple-600" />
                                            <span className="font-semibold">{t('suggest.categories.multimodal_title')}</span>
                                        </div>
                                        <p className="text-xs text-muted-foreground">
                                            {t('suggest.categories.multimodal_desc')}
                                        </p>
                                    </button>
                                </div>
                            </div>

                            {/* Step 2: Dynamic Examples */}
                            {category && (
                                <div className="space-y-3 animate-in fade-in slide-in-from-top-2 duration-300">
                                    <Label className="text-base font-medium">
                                        {category === "linguistic"
                                            ? t('suggest.examples.linguistic_title')
                                            : t('suggest.examples.multimodal_title')
                                        }
                                    </Label>
                                    <div className={cn(
                                        "rounded-lg p-4 space-y-2",
                                        category === "linguistic"
                                            ? "bg-blue-50/50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-900"
                                            : "bg-purple-50/50 dark:bg-purple-950/20 border border-purple-200 dark:border-purple-900"
                                    )}>
                                        {examples.map((example, index) => (
                                            <div key={index} className="flex items-start gap-2 text-sm">
                                                <span className="text-muted-foreground">•</span>
                                                <span>{example}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Step 3: Question Input */}
                            <div className="space-y-3">
                                <div className="flex items-center justify-between">
                                    <Label htmlFor="question" className="text-base font-medium">
                                        {t('suggest.form.question_label')}
                                    </Label>
                                    <span className={cn(
                                        "text-xs",
                                        question.length > 200 ? "text-red-500" : "text-muted-foreground"
                                    )}>
                                        {question.length}/200
                                    </span>
                                </div>
                                <Textarea
                                    id="question"
                                    value={question}
                                    onChange={(e) => setQuestion(e.target.value.slice(0, 200))}
                                    placeholder={t('suggest.form.question_placeholder')}
                                    className="min-h-[120px] resize-none"
                                    required
                                    maxLength={200}
                                />
                            </div>

                            {/* Submit Button */}
                            <Button
                                type="submit"
                                className="w-full"
                                disabled={!category || !question.trim() || submitted || submitting}
                            >
                                {submitting ? (
                                    <>
                                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                        {t('suggest.form.submitting_button')}
                                    </>
                                ) : submitted ? (
                                    <>
                                        <CheckCircle2 className="w-4 h-4 mr-2" />
                                        {t('suggest.form.submitted_button')}
                                    </>
                                ) : (
                                    t('suggest.form.submit_button')
                                )}
                            </Button>

                            {error && (
                                <p className="text-sm text-center text-red-600 dark:text-red-400 animate-in fade-in">
                                    {error}
                                </p>
                            )}

                            {submitted && (
                                <p className="text-sm text-center text-green-600 dark:text-green-400 animate-in fade-in">
                                    {t('suggest.form.success_message')}
                                </p>
                            )}
                        </form>
                    </CardContent>
                </Card>
            </div>
            </div>
        </div>
    )
}
