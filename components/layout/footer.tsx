"use client"

import Link from "next/link"
import { useI18n } from "@/lib/i18n-context"

export function Footer() {
    const { t, language, setLanguage } = useI18n()

    return (
        <footer className="border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container py-10 md:py-16">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    {/* Brand & Description */}
                    <div className="md:col-span-1 space-y-4">
                        <Link href="/" className="flex items-center space-x-2">
                            <span className="font-bold text-xl">AGI Index</span>
                        </Link>
                        <p className="text-sm text-muted-foreground leading-relaxed">
                            {t('home.hero.subtitle')}
                        </p>
                    </div>

                    {/* Menu Links */}
                    <div>
                        <h3 className="font-semibold mb-4">{t('footer.menu')}</h3>
                        <ul className="space-y-3 text-sm text-muted-foreground">
                            <li>
                                <Link href="/manifesto" className="hover:text-foreground transition-colors">
                                    {t('nav.manifesto')}
                                </Link>
                            </li>
                            <li>
                                <Link href="/questions" className="hover:text-foreground transition-colors">
                                    {t('nav.questions')}
                                </Link>
                            </li>
                            <li>
                                <Link href="/history" className="hover:text-foreground transition-colors">
                                    {t('nav.history')}
                                </Link>
                            </li>
                            <li>
                                <Link href="mailto:partner@agiindex.org" className="hover:text-foreground transition-colors text-primary font-medium">
                                    {t('footer.become_partner')}
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Legal & Social */}
                    <div>
                        <h3 className="font-semibold mb-4">{t('footer.social')}</h3>
                        <ul className="space-y-3 text-sm text-muted-foreground">
                            <li>
                                <Link href="https://twitter.com" target="_blank" rel="noreferrer" className="hover:text-foreground transition-colors flex items-center gap-2">
                                    {t('footer.twitter')}
                                </Link>
                            </li>
                            <li>
                                <Link href="https://discord.com" target="_blank" rel="noreferrer" className="hover:text-foreground transition-colors flex items-center gap-2">
                                    {t('footer.discord')}
                                </Link>
                            </li>
                            <li>
                                <Link href="https://github.com/yourusername/agiindex" target="_blank" rel="noreferrer" className="hover:text-foreground transition-colors flex items-center gap-2">
                                    {t('footer.github')}
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Language Selector */}
                    <div>
                        <h3 className="font-semibold mb-4">{t('footer.language')}</h3>
                        <div className="flex flex-col gap-2">
                            <select
                                className="h-9 w-full md:w-[140px] rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
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
                </div>

                <div className="border-t mt-10 pt-6 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-muted-foreground">
                    <p>
                        © 2025 {t('footer.community')}. {t('footer.built_by')} <a href="https://github.com/yourusername/agiindex" className="underline underline-offset-4 hover:text-foreground">AGI Index Community</a>.
                    </p>
                    <div className="flex gap-6">
                        <Link href="/terms" className="hover:text-foreground transition-colors">{t('footer.terms')}</Link>
                        <Link href="/privacy" className="hover:text-foreground transition-colors">{t('footer.privacy')}</Link>
                    </div>
                </div>
            </div>
        </footer>
    )
}
