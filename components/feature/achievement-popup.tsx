"use client"

import Image from "next/image"
import { X, Twitter, Linkedin } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useI18n } from "@/lib/i18n-context"

interface AchievementPopupProps {
    isOpen: boolean
    onClose: () => void
    title: string
    description: string
    image: string
    stats?: { votes: number; questions: number }
}

export function AchievementPopup({
    isOpen,
    onClose,
    title,
    description,
    image,
    stats,
}: AchievementPopupProps) {
    const { t } = useI18n()

    const getShareText = () => {
        const template = t('profile.badges.share_text')
        const hashtags = t('profile.badges.share_hashtags')
        const text = template
            .replace('{title}', title)
            .replace('{votes}', String(stats?.votes ?? 0))
            .replace('{questions}', String(stats?.questions ?? 0))
        return `${text}\n\n${hashtags}`
    }

    const shareToX = () => {
        const text = getShareText()
        const url = 'https://agiindex.org'
        window.open(
            `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`,
            '_blank'
        )
    }

    const shareToLinkedIn = () => {
        const url = 'https://agiindex.org'
        window.open(
            `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
            '_blank'
        )
    }

    if (!isOpen) return null

    return (
        <div
            onClick={onClose}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        >
            <div
                onClick={(e) => e.stopPropagation()}
                className="relative bg-background rounded-2xl shadow-2xl max-w-md w-full animate-in fade-in zoom-in-95 duration-300"
            >
                {/* Elegant Gold Frame */}
                <div className="absolute inset-4 border-2 border-yellow-600/30 rounded-xl pointer-events-none" />
                <div className="absolute inset-6 border border-yellow-500/20 rounded-lg pointer-events-none" />

                {/* Gold Corner Accents */}
                <div className="absolute top-8 left-8 w-8 h-8 border-t-2 border-l-2 border-yellow-600/40" />
                <div className="absolute top-8 right-8 w-8 h-8 border-t-2 border-r-2 border-yellow-600/40" />
                <div className="absolute bottom-8 left-8 w-8 h-8 border-b-2 border-l-2 border-yellow-600/40" />
                <div className="absolute bottom-8 right-8 w-8 h-8 border-b-2 border-r-2 border-yellow-600/40" />

                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 z-10 p-2 rounded-full bg-muted hover:bg-muted/80 transition-colors"
                >
                    <X className="w-5 h-5 text-muted-foreground" />
                </button>

                {/* Content */}
                <div className="relative px-12 py-12 flex flex-col items-center text-center">
                    {/* Gold decoration above character */}
                    <div className="relative mb-6">
                        {/* Small gold star */}
                        <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="text-yellow-600">
                                <path d="M12 2L14.09 8.26L20 9.27L15.82 13.14L17.18 19.02L12 15.77L6.82 19.02L8.18 13.14L4 9.27L9.91 8.26L12 2Z" fill="currentColor" fillOpacity="0.6" />
                            </svg>
                        </div>

                        {/* Small diamonds */}
                        <div className="absolute top-8 -left-8 w-3 h-3 bg-yellow-600/40 transform rotate-45" />
                        <div className="absolute top-8 -right-8 w-3 h-3 bg-yellow-600/40 transform rotate-45" />

                        {/* Subtle gold glow behind character */}
                        <div className="absolute inset-0 bg-gradient-to-b from-yellow-50/50 to-transparent rounded-full blur-2xl dark:from-yellow-900/20" />

                        <div className="relative z-10 w-48 h-48">
                            <Image
                                src={image}
                                alt={title}
                                fill
                                className="object-contain drop-shadow-xl"
                            />
                        </div>
                    </div>

                    {/* Title with subtle gold underline */}
                    <div className="relative mb-4">
                        <h2 className="text-2xl font-bold mb-2">
                            {title}
                        </h2>
                        <div className="mx-auto w-24 h-0.5 bg-gradient-to-r from-transparent via-yellow-600/50 to-transparent" />
                    </div>

                    {/* Description */}
                    <p className="text-base text-muted-foreground mb-8 max-w-sm">
                        {description}
                    </p>

                    {/* Share Buttons */}
                    <div className="flex items-center gap-3">
                        <span className="text-sm text-muted-foreground">{t('profile.badges.share')}</span>
                        <Button
                            onClick={shareToX}
                            size="icon"
                            variant="outline"
                            className="rounded-full w-10 h-10 hover:bg-black hover:text-white transition-colors"
                        >
                            <Twitter className="w-5 h-5" />
                        </Button>
                        <Button
                            onClick={shareToLinkedIn}
                            size="icon"
                            variant="outline"
                            className="rounded-full w-10 h-10 hover:bg-[#0077B5] hover:text-white transition-colors"
                        >
                            <Linkedin className="w-5 h-5" />
                        </Button>
                    </div>

                    {/* Small gold accent under button */}
                    <div className="mt-4 w-16 h-0.5 bg-gradient-to-r from-transparent via-yellow-600/30 to-transparent" />
                </div>
            </div>
        </div>
    )
}
