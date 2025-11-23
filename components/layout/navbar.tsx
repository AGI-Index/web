"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { User, LogOut, Menu, X } from "lucide-react"
import { useAuth } from "@/lib/auth-context"
import { cn } from "@/lib/utils"

export function Navbar() {
    const { user, signOut, loading } = useAuth()
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
                        Manifesto
                    </Link>
                    <Link href="/questions" className="transition-colors hover:text-foreground/80 text-foreground/60">
                        Questions
                    </Link>
                    <Link href="/history" className="transition-colors hover:text-foreground/80 text-foreground/60">
                        History
                    </Link>
                </nav>

                {/* Spacer for mobile */}
                <div className="flex-1 md:hidden" />

                {/* Desktop Auth Buttons */}
                <div className="hidden md:flex items-center gap-2">
                    {loading ? (
                        <div className="h-9 w-20 bg-secondary animate-pulse rounded-md" />
                    ) : user ? (
                        <>
                            <Button variant="ghost" size="sm" asChild>
                                <Link href="/profile">
                                    <User className="mr-2 h-4 w-4" />
                                    Profile
                                </Link>
                            </Button>
                            <Button variant="ghost" size="sm" onClick={() => signOut()}>
                                <LogOut className="mr-2 h-4 w-4" />
                                Sign Out
                            </Button>
                        </>
                    ) : (
                        <Button size="sm" asChild>
                            <Link href="/login">
                                Sign In
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
                                    Sign In
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
                            Manifesto
                        </Link>
                        <Link
                            href="/questions"
                            className="text-sm font-medium transition-colors hover:text-foreground/80 text-foreground/60 py-2"
                            onClick={() => setMobileMenuOpen(false)}
                        >
                            Questions
                        </Link>
                        <Link
                            href="/history"
                            className="text-sm font-medium transition-colors hover:text-foreground/80 text-foreground/60 py-2"
                            onClick={() => setMobileMenuOpen(false)}
                        >
                            History
                        </Link>
                        {user && (
                            <>
                                <div className="border-t pt-3 mt-2" />
                                <Link
                                    href="/profile"
                                    className="text-sm font-medium transition-colors hover:text-foreground/80 text-foreground/60 py-2"
                                    onClick={() => setMobileMenuOpen(false)}
                                >
                                    Profile
                                </Link>
                                <button
                                    onClick={() => {
                                        signOut()
                                        setMobileMenuOpen(false)
                                    }}
                                    className="text-sm font-medium transition-colors hover:text-foreground/80 text-foreground/60 py-2 text-left"
                                >
                                    Sign Out
                                </button>
                            </>
                        )}
                    </nav>
                </div>
            )}
        </header>
    )
}
