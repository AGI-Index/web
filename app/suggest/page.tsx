"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Lightbulb, CheckCircle2 } from "lucide-react"

export default function SuggestPage() {
    const [category, setCategory] = useState<string>("")
    const [question, setQuestion] = useState<string>("")
    const [submitted, setSubmitted] = useState(false)

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        if (category && question.trim()) {
            // Mock submission - In real app, this would call an API
            console.log({ category, question })
            setSubmitted(true)
            setTimeout(() => {
                setSubmitted(false)
                setCategory("")
                setQuestion("")
            }, 3000)
        }
    }

    return (
        <div className="container mx-auto px-4 py-8 max-w-7xl">
            <div className="mb-8">
                <h1 className="text-3xl md:text-4xl font-bold mb-3">Suggest a Question</h1>
                <p className="text-muted-foreground text-lg">
                    Help us build better benchmarks for AGI by proposing meaningful questions.
                </p>
            </div>

            <div className="grid lg:grid-cols-2 gap-8">
                {/* Guide Section */}
                <Card className="border-primary/20">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Lightbulb className="w-5 h-5 text-primary" />
                            How to Write a Good Question
                        </CardTitle>
                        <CardDescription>
                            We don't need complex theories. Think of moments when you thought "If AI can't do this, can we call it intelligent?"
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div>
                            <h3 className="font-semibold mb-2 text-green-700 dark:text-green-400">✓ Good Question</h3>
                            <p className="text-sm bg-green-50 dark:bg-green-950/20 p-3 rounded-md border border-green-200 dark:border-green-900">
                                "Can it explain directions by drawing on a map?"
                            </p>
                        </div>

                        <div>
                            <h3 className="font-semibold mb-2 text-red-700 dark:text-red-400">✗ Difficult Question</h3>
                            <p className="text-sm bg-red-50 dark:bg-red-950/20 p-3 rounded-md border border-red-200 dark:border-red-900">
                                "Is the error rate below 5%?"
                            </p>
                        </div>

                        <div className="bg-primary/5 p-4 rounded-lg border border-primary/20">
                            <h3 className="font-semibold mb-2 flex items-center gap-2">
                                ⭐ Key Check
                            </h3>
                            <p className="text-sm mb-2">
                                "If AI lacks this ability... could I work with it? Could I spend my life with it?"
                            </p>
                            <ul className="text-sm space-y-1 ml-4">
                                <li>→ If "it would be difficult", that's a great question!</li>
                                <li>→ Best if answerable with "Yes" or "No"!</li>
                            </ul>
                        </div>

                        <div className="space-y-3 pt-2 border-t">
                            <h3 className="font-semibold">Categories</h3>
                            <div className="space-y-2">
                                <div className="p-3 bg-blue-50 dark:bg-blue-950/20 rounded-md border border-blue-200 dark:border-blue-900">
                                    <h4 className="font-medium text-sm mb-1">Linguistic</h4>
                                    <p className="text-xs text-muted-foreground">
                                        Abilities that can be judged through text conversation only
                                    </p>
                                </div>
                                <div className="p-3 bg-purple-50 dark:bg-purple-950/20 rounded-md border border-purple-200 dark:border-purple-900">
                                    <h4 className="font-medium text-sm mb-1">Multimodal</h4>
                                    <p className="text-xs text-muted-foreground">
                                        All abilities requiring sound, expressions, images, actions, etc. beyond text
                                    </p>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Form Section */}
                <Card>
                    <CardHeader>
                        <CardTitle>Submit Your Question</CardTitle>
                        <CardDescription>
                            Your question will be reviewed and added to the public vote.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="space-y-3">
                                <Label>Category *</Label>
                                <RadioGroup value={category} onValueChange={setCategory}>
                                    <div className="flex items-start space-x-3 p-3 rounded-lg border hover:bg-accent transition-colors">
                                        <RadioGroupItem value="Linguistic" id="linguistic" className="mt-0.5" />
                                        <div className="flex-1">
                                            <Label htmlFor="linguistic" className="font-medium cursor-pointer">
                                                Linguistic
                                            </Label>
                                            <p className="text-xs text-muted-foreground mt-1">
                                                Text-based abilities only
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-start space-x-3 p-3 rounded-lg border hover:bg-accent transition-colors">
                                        <RadioGroupItem value="Multimodal" id="multimodal" className="mt-0.5" />
                                        <div className="flex-1">
                                            <Label htmlFor="multimodal" className="font-medium cursor-pointer">
                                                Multimodal
                                            </Label>
                                            <p className="text-xs text-muted-foreground mt-1">
                                                Requires images, sound, actions, etc.
                                            </p>
                                        </div>
                                    </div>
                                </RadioGroup>
                            </div>

                            <div className="space-y-3">
                                <Label htmlFor="question">Your Question *</Label>
                                <Textarea
                                    id="question"
                                    value={question}
                                    onChange={(e) => setQuestion(e.target.value)}
                                    placeholder="Can an AI...?"
                                    className="min-h-[120px] resize-none"
                                    required
                                />
                                <p className="text-xs text-muted-foreground">
                                    Try to phrase it as a yes/no question starting with "Can an AI..."
                                </p>
                            </div>

                            <Button
                                type="submit"
                                className="w-full"
                                disabled={!category || !question.trim() || submitted}
                            >
                                {submitted ? (
                                    <>
                                        <CheckCircle2 className="w-4 h-4 mr-2" />
                                        Question Submitted!
                                    </>
                                ) : (
                                    "Submit Question"
                                )}
                            </Button>

                            {submitted && (
                                <p className="text-sm text-center text-green-600 dark:text-green-400 animate-in fade-in">
                                    Thank you! Your question will be reviewed by the community.
                                </p>
                            )}
                        </form>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
