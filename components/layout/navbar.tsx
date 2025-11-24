"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { User, LogOut, Menu, X, Globe } from "lucide-react"
import { useAuth } from "@/lib/auth-context"
import { cn } from "@/lib/utils"
import { useI18n } from "@/lib/i18n-context"

export function Navbar() {
    const { user, signOut, loading } = useAuth()
    const { t, language, setLanguage } = useI18n()
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

    return (
        <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container flex h-14 items-center">
                {/* Logo */}
                <Link href="/" className="flex items-center space-x-2 mr-6">
                    <Image src="/logo.png" alt="AGI Index" width={120} height={30} className="h-7 w-auto" />
                </Link>

                {/* Desktop Navigation */}
                <nav className="hidden md:flex items-center space-x-6 text-sm font-medium flex-1">
                    <Link href="/manifesto" className="transition-colors hover:text-foreground/80 text-foreground/60">
                        {t('nav.manifesto')}
                    </Link>
                    <Link href="/questions" className="transition-colors hover:text-foreground/80 text-foreground/60">
                        {t('nav.questions')}
                    </Link>
                    <Link href="/history" className="transition-colors hover:text-foreground/80 text-foreground/60">
                        {t('nav.history')}
                    </Link>
                </nav>

                {/* Spacer for mobile */}
                <div className="flex-1 md:hidden" />

                {/* Desktop Auth Buttons */}
                <div className="hidden md:flex items-center gap-2">
                    {/* Language Selector */}
                    <div className="relative">
                        <select
                            className="h-9 w-[100px] rounded-md border border-input bg-background pl-7 pr-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring appearance-none cursor-pointer"
                            value={language}
                            onChange={(e) => setLanguage(e.target.value as 'en' | 'ko' | 'ja' | 'zh' | 'es' | 'de' | 'fr')}
                        >
                            <option value="en">English</option>
                            <option value="ko">한국어</option>
                            <option value="ja">日本語</option>
                            <option value="zh">中文</option>
                            <option value="es">Español</option>
                            <option value="de">Deutsch</option>
                            <option value="fr">Français</option>
                        </select>
                        <Globe className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                    </div>

                    {loading ? (
                        <div className="h-9 w-20 bg-secondary animate-pulse rounded-md" />
                    ) : user ? (
                        <>
                            <Button variant="ghost" size="sm" asChild>
                                <Link href="/profile">
                                    <User className="mr-2 h-4 w-4" />
                                    {t('nav.profile')}
                                </Link>
                            </Button>
                            <Button variant="ghost" size="sm" onClick={() => signOut()}>
                                <LogOut className="mr-2 h-4 w-4" />
                                {t('nav.logout')}
                            </Button>
                        </>
                    ) : (
                        <Button size="sm" asChild>
                            <Link href="/login">
                                {t('nav.login')}
                            </Link>
                        </Button>
                    )}
                </div>

                {/* Mobile Menu Button */}
                <div className="flex md:hidden items-center gap-2">
                    {!loading && (
                        user ? (
                            <Button variant="ghost" size="sm" asChild>
                                <Link href="/profile">
                                    <User className="h-4 w-4" />
                                </Link>
                            </Button>
                        ) : (
                            <Button size="sm" asChild>
                                <Link href="/login">
                                    {t('nav.login')}
                                </Link>
                            </Button>
                        )
                    )}
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        className="md:hidden"
                    >
                        {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                    </Button>
                </div>
            </div>

            {/* Mobile Menu */}
            {mobileMenuOpen && (
                <div className="md:hidden border-t">
                    <nav className="container py-4 flex flex-col space-y-3">
                        <Link
                            href="/manifesto"
                            className="text-sm font-medium transition-colors hover:text-foreground/80 text-foreground/60 py-2"
                            onClick={() => setMobileMenuOpen(false)}
                        >
                            {t('nav.manifesto')}
                        </Link>
                        <Link
                            href="/questions"
                            className="text-sm font-medium transition-colors hover:text-foreground/80 text-foreground/60 py-2"
                            onClick={() => setMobileMenuOpen(false)}
                        >
                            {t('nav.questions')}
                        </Link>
                        <Link
                            href="/history"
                            className="text-sm font-medium transition-colors hover:text-foreground/80 text-foreground/60 py-2"
                            onClick={() => setMobileMenuOpen(false)}
                        >
                            {t('nav.history')}
                        </Link>
                        {user && (
                            <>
                                <div className="border-t pt-3 mt-2" />
                                <Link
                                    href="/profile"
                                    className="text-sm font-medium transition-colors hover:text-foreground/80 text-foreground/60 py-2"
                                    onClick={() => setMobileMenuOpen(false)}
                                >
                                    {t('nav.profile')}
                                </Link>
                                <button
                                    onClick={() => {
                                        signOut()
                                        setMobileMenuOpen(false)
                                    }}
                                    className="text-sm font-medium transition-colors hover:text-foreground/80 text-foreground/60 py-2 text-left"
                                >
                                    {t('nav.logout')}
                                </button>
                            </>
                        )}

                        {/* Mobile Language Selector */}
                        <div className="border-t pt-3 mt-2">
                            <div className="flex items-center gap-2">
                                <Globe className="h-4 w-4 text-muted-foreground" />
                                <select
                                    className="h-9 flex-1 rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                                    value={language}
                                    onChange={(e) => setLanguage(e.target.value as 'en' | 'ko' | 'ja' | 'zh' | 'es' | 'de' | 'fr')}
                                >
                                    <option value="en">English</option>
                                    <option value="ko">한국어</option>
                                    <option value="ja">日本語</option>
                                    <option value="zh">中文</option>
                                    <option value="es">Español</option>
                                    <option value="de">Deutsch</option>
                                    <option value="fr">Français</option>
                                </select>
                            </div>
                        </div>
                    </nav>
                </div>
            )}
        </header>
    )
}
