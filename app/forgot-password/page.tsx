"use client"

import { useState } from "react"
import { useAuth } from "@/lib/auth-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useI18n } from "@/lib/i18n-context"
import Link from "next/link"
import { ArrowLeft, Mail } from "lucide-react"

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState("")
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("")
    const [success, setSuccess] = useState(false)

    const { resetPassword } = useAuth()
    const { t } = useI18n()

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError("")

        const { error } = await resetPassword(email)

        if (error) {
            setError(error.message)
        } else {
            setSuccess(true)
        }
        setLoading(false)
    }

    return (
        <div className="container flex items-center justify-center min-h-[calc(100vh-4rem)] py-8">
            <Card className="w-full max-w-md">
                <CardHeader className="space-y-1">
                    <CardTitle className="text-2xl font-bold text-center">
                        {t('forgot_password.title')}
                    </CardTitle>
                    <CardDescription className="text-center">
                        {t('forgot_password.description')}
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    {success ? (
                        <div className="space-y-4">
                            <div className="flex flex-col items-center gap-4 py-4">
                                <div className="rounded-full bg-primary/10 p-3">
                                    <Mail className="h-6 w-6 text-primary" />
                                </div>
                                <p className="text-sm text-center text-muted-foreground">
                                    {t('forgot_password.success')}
                                </p>
                            </div>
                            <Button asChild variant="outline" className="w-full">
                                <Link href="/login">
                                    <ArrowLeft className="mr-2 h-4 w-4" />
                                    {t('forgot_password.back_to_login')}
                                </Link>
                            </Button>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="email">{t('login.email')}</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="name@example.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    disabled={loading}
                                />
                            </div>

                            {error && (
                                <div className="text-sm text-destructive bg-destructive/10 p-3 rounded-md">
                                    {error}
                                </div>
                            )}

                            <Button type="submit" className="w-full" disabled={loading}>
                                {loading ? t('common.loading') : t('forgot_password.submit')}
                            </Button>

                            <Button asChild variant="ghost" className="w-full">
                                <Link href="/login">
                                    <ArrowLeft className="mr-2 h-4 w-4" />
                                    {t('forgot_password.back_to_login')}
                                </Link>
                            </Button>
                        </form>
                    )}
                </CardContent>
            </Card>
        </div>
    )
}
