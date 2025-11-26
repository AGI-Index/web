"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Lightbulb, CheckCircle2, Loader2 } from "lucide-react"
import { useI18n } from "@/lib/i18n-context"
import { useAuth } from "@/lib/auth-context"
import { supabase } from "@/lib/supabase"

export default function SuggestPage() {
    const { t } = useI18n()
    const { user, loading: authLoading } = useAuth()
    const router = useRouter()
    const [category, setCategory] = useState<string>("")
    const [question, setQuestion] = useState<string>("")
    const [submitted, setSubmitted] = useState(false)
    const [submitting, setSubmitting] = useState(false)
    const [error, setError] = useState<string | null>(null)

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

            // Call submit-question Edge Function
            const response = await supabase.functions.invoke('submit-question', {
                body: {
                    content: question.trim(),
                    category: category,
                },
            })

            if (response.error) {
                console.error('Function error:', response.error)
                setError(response.error.message || 'Failed to submit question')
            } else if (response.data?.error) {
                console.error('Submit error:', response.data.error)
                setError(response.data.error)
            } else {
                setSubmitted(true)
                setTimeout(() => {
                    setSubmitted(false)
                    setCategory("")
                    setQuestion("")
                }, 3000)
            }
        } catch (err) {
            console.error('Submit error:', err)
            setError('An unexpected error occurred')
        } finally {
            setSubmitting(false)
        }
    }

    return (
        <div className="container mx-auto px-4 py-8 max-w-7xl">
            <div className="mb-8">
                <h1 className="text-3xl md:text-4xl font-bold mb-3">{t('suggest.title')}</h1>
                <p className="text-muted-foreground text-lg">
                    {t('suggest.description')}
                </p>
            </div>

            <div className="grid lg:grid-cols-2 gap-8">
                {/* Guide Section */}
                <Card className="border-primary/20">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Lightbulb className="w-5 h-5 text-primary" />
                            {t('suggest.guide.title')}
                        </CardTitle>
                        <CardDescription>
                            {t('suggest.guide.description')}
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div>
                            <h3 className="font-semibold mb-2 text-green-700 dark:text-green-400">✓ {t('suggest.guide.good_title')}</h3>
                            <p className="text-sm bg-green-50 dark:bg-green-950/20 p-3 rounded-md border border-green-200 dark:border-green-900">
                                {t('suggest.guide.good_example')}
                            </p>
                        </div>

                        <div>
                            <h3 className="font-semibold mb-2 text-red-700 dark:text-red-400">✗ {t('suggest.guide.bad_title')}</h3>
                            <p className="text-sm bg-red-50 dark:bg-red-950/20 p-3 rounded-md border border-red-200 dark:border-red-900">
                                {t('suggest.guide.bad_example')}
                            </p>
                        </div>

                        <div className="bg-primary/5 p-4 rounded-lg border border-primary/20">
                            <h3 className="font-semibold mb-2 flex items-center gap-2">
                                ⭐ {t('suggest.guide.key_check_title')}
                            </h3>
                            <p className="text-sm mb-2">
                                {t('suggest.guide.key_check_question')}
                            </p>
                            <ul className="text-sm space-y-1 ml-4">
                                <li>→ {t('suggest.guide.key_check_tip1')}</li>
                                <li>→ {t('suggest.guide.key_check_tip2')}</li>
                            </ul>
                        </div>

                        <div className="space-y-3 pt-2 border-t">
                            <h3 className="font-semibold">{t('suggest.categories.title')}</h3>
                            <div className="space-y-2">
                                <div className="p-3 bg-blue-50 dark:bg-blue-950/20 rounded-md border border-blue-200 dark:border-blue-900">
                                    <h4 className="font-medium text-sm mb-1">{t('suggest.categories.linguistic_title')}</h4>
                                    <p className="text-xs text-muted-foreground">
                                        {t('suggest.categories.linguistic_desc')}
                                    </p>
                                </div>
                                <div className="p-3 bg-purple-50 dark:bg-purple-950/20 rounded-md border border-purple-200 dark:border-purple-900">
                                    <h4 className="font-medium text-sm mb-1">{t('suggest.categories.multimodal_title')}</h4>
                                    <p className="text-xs text-muted-foreground">
                                        {t('suggest.categories.multimodal_desc')}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Form Section */}
                <Card>
                    <CardHeader>
                        <CardTitle>{t('suggest.form.title')}</CardTitle>
                        <CardDescription>
                            {t('suggest.form.description')}
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="space-y-3">
                                <Label>{t('suggest.form.category_label')} *</Label>
                                <RadioGroup value={category} onValueChange={setCategory}>
                                    <div className="flex items-start space-x-3 p-3 rounded-lg border hover:bg-accent transition-colors">
                                        <RadioGroupItem value="linguistic" id="linguistic" className="mt-0.5" />
                                        <div className="flex-1">
                                            <Label htmlFor="linguistic" className="font-medium cursor-pointer">
                                                {t('suggest.form.linguistic_label')}
                                            </Label>
                                            <p className="text-xs text-muted-foreground mt-1">
                                                {t('suggest.form.linguistic_desc')}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-start space-x-3 p-3 rounded-lg border hover:bg-accent transition-colors">
                                        <RadioGroupItem value="multimodal" id="multimodal" className="mt-0.5" />
                                        <div className="flex-1">
                                            <Label htmlFor="multimodal" className="font-medium cursor-pointer">
                                                {t('suggest.form.multimodal_label')}
                                            </Label>
                                            <p className="text-xs text-muted-foreground mt-1">
                                                {t('suggest.form.multimodal_desc')}
                                            </p>
                                        </div>
                                    </div>
                                </RadioGroup>
                            </div>

                            <div className="space-y-3">
                                <Label htmlFor="question">{t('suggest.form.question_label')} *</Label>
                                <Textarea
                                    id="question"
                                    value={question}
                                    onChange={(e) => setQuestion(e.target.value)}
                                    placeholder={t('suggest.form.question_placeholder')}
                                    className="min-h-[120px] resize-none"
                                    required
                                />
                                <p className="text-xs text-muted-foreground">
                                    {t('suggest.form.question_hint')}
                                </p>
                            </div>

                            <Button
                                type="submit"
                                className="w-full"
                                disabled={!category || !question.trim() || submitted || submitting}
                            >
                                {submitting ? (
                                    <>
                                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                        {t('suggest.form.submitting_button') || 'Submitting...'}
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
    )
}
