"use client"

import { useBadge } from "@/lib/badge-context"
import { useI18n } from "@/lib/i18n-context"
import { useAuth } from "@/lib/auth-context"
import { AchievementPopup } from "./achievement-popup"

export function GlobalBadgePopup() {
    const { unlockedBadge, hideBadge } = useBadge()
    const { t } = useI18n()
    const { profile } = useAuth()

    if (!unlockedBadge) return null

    return (
        <AchievementPopup
            isOpen={true}
            onClose={hideBadge}
            title={t(unlockedBadge.titleKey)}
            description={t(unlockedBadge.descriptionKey)}
            image={unlockedBadge.image}
            stats={{
                votes: profile?.total_vote_count || 0,
                questions: profile?.total_question_count || 0
            }}
        />
    )
}
