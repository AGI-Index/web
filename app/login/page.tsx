"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Chrome, Github, Apple, Disc } from "lucide-react"
import { useI18n } from "@/lib/i18n-context"

export default function LoginPage() {
    const [isSignUp, setIsSignUp] = useState(false)
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("")
    const [message, setMessage] = useState("")

    const { signIn, signUp, signInWithOAuth } = useAuth()
    const { t } = useI18n()
    const router = useRouter()

    const handleEmailAuth = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError("")
        setMessage("")

        const { error } = isSignUp
            ? await signUp(email, password)
            : await signIn(email, password)

        if (error) {
            setError(error.message)
        } else {
            if (isSignUp) {
                setMessage(t('login.check_email'))
            } else {
                router.push("/")
            }
        }
        setLoading(false)
    }

    const handleOAuthSignIn = async (provider: 'google' | 'apple' | 'discord' | 'github') => {
        setLoading(true)
        await signInWithOAuth(provider)
        setLoading(false)
    }

    return (
        <div className="container flex items-center justify-center min-h-[calc(100vh-4rem)] py-8">
            <Card className="w-full max-w-md">
                <CardHeader className="space-y-1">
                    <CardTitle className="text-2xl font-bold text-center">
                        {isSignUp ? t('login.title_signup') : t('login.title_signin')}
                    </CardTitle>
                    <CardDescription className="text-center">
                        {isSignUp
                            ? t('login.desc_signup')
                            : t('login.desc_signin')}
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    {/* OAuth Buttons */}
                    <div className="grid grid-cols-2 gap-3">
                        <Button
                            variant="outline"
                            onClick={() => handleOAuthSignIn('google')}
                            disabled={loading}
                        >
                            <Chrome className="mr-2 h-4 w-4" />
                            Google
                        </Button>
                        <Button
                            variant="outline"
                            onClick={() => handleOAuthSignIn('github')}
                            disabled={loading}
                        >
                            <Github className="mr-2 h-4 w-4" />
                            GitHub
                        </Button>

                        <Button
                            variant="outline"
                            onClick={() => handleOAuthSignIn('discord')}
                            disabled={loading}
                        >
                            <Disc className="mr-2 h-4 w-4" />
                            Discord
                        </Button>
                        <Button
                            variant="outline"
                            onClick={() => handleOAuthSignIn('apple')}
                            disabled={loading}
                        >
                            <Apple className="mr-2 h-4 w-4" />
                            Apple
                        </Button>
                    </div>

                    <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                            <Separator />
                        </div>
                        <div className="relative flex justify-center text-xs uppercase">
                            <span className="bg-background px-2 text-muted-foreground">
                                {t('login.or_continue')}
                            </span>
                        </div>
                    </div>

                    {/* Email/Password Form */}
                    <form onSubmit={handleEmailAuth} className="space-y-4">
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
                        <div className="space-y-2">
                            <Label htmlFor="password">{t('login.password')}</Label>
                            <Input
                                id="password"
                                type="password"
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                disabled={loading}
                                minLength={6}
                            />
                        </div>

                        {error && (
                            <div className="text-sm text-destructive bg-destructive/10 p-3 rounded-md">
                                {error}
                            </div>
                        )}

                        {message && (
                            <div className="text-sm text-primary bg-primary/10 p-3 rounded-md">
                                {message}
                            </div>
                        )}

                        <Button type="submit" className="w-full" disabled={loading}>
                            {loading ? t('common.loading') : isSignUp ? t('login.submit_signup') : t('login.submit_signin')}
                        </Button>
                    </form>

                    <div className="text-center text-sm">
                        <button
                            type="button"
                            onClick={() => {
                                setIsSignUp(!isSignUp)
                                setError("")
                                setMessage("")
                            }}
                            className="text-primary hover:underline"
                            disabled={loading}
                        >
                            {isSignUp
                                ? t('login.toggle_signin')
                                : t('login.toggle_signup')}
                        </button>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
