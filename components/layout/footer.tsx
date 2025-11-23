"use client"

import Link from "next/link"
import { useI18n } from "@/lib/i18n-context"

export function Footer() {
    const { t, language, setLanguage } = useI18n()

    return (
        <footer className="border-t py-6 md:py-0">
            <div className="container flex flex-col items-center justify-between gap-4 md:h-24 md:flex-row">
                <div className="flex flex-col items-center gap-4 px-8 md:flex-row md:gap-2 md:px-0">
                    <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
                        {t('footer.built_by')} <span className="font-medium underline underline-offset-4">{t('footer.community')}</span>.
                        {" "}{t('footer.source_code')}{" "}
                        <Link
                            href="https://github.com/yourusername/agiindex"
                            target="_blank"
                            rel="noreferrer"
                            className="font-medium underline underline-offset-4"
                        >
                            GitHub
                        </Link>
                        .
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">{t('footer.language')}:</span>
                    <select
                        className="h-8 w-[100px] rounded-md border border-input bg-background px-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                        value={language}
                        onChange={(e) => setLanguage(e.target.value as 'en' | 'ko')}
                    >
                        <option value="en">English</option>
                        <option value="ko">한국어</option>
                    </select>
                </div>
            </div>
        </footer>
    )
}
