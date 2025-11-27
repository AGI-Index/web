"use client"

import { createContext, useContext, useState, useCallback } from 'react'

export type BadgeId = 'first_vote' | 'five_votes' | 'first_question' | 'ten_votes' | 'three_questions'

export interface BadgeDefinition {
    id: BadgeId
    titleKey: string
    descriptionKey: string
    conditionKey: string
    image: string
    check: (stats: BadgeStats) => boolean
}

export interface BadgeStats {
    votes: number
    questions: number
    approvedQuestions: number
}

export const BADGE_DEFINITIONS: BadgeDefinition[] = [
    {
        id: 'first_vote',
        titleKey: 'profile.badges.first_vote.title',
        descriptionKey: 'profile.badges.first_vote.description',
        conditionKey: 'profile.badges.first_vote.condition',
        image: '/trophies/first-vote.webp',
        check: (stats) => stats.votes >= 1,
    },
    {
        id: 'five_votes',
        titleKey: 'profile.badges.five_votes.title',
        descriptionKey: 'profile.badges.five_votes.description',
        conditionKey: 'profile.badges.five_votes.condition',
        image: '/trophies/five-votes.webp',
        check: (stats) => stats.votes >= 5,
    },
    {
        id: 'first_question',
        titleKey: 'profile.badges.first_question.title',
        descriptionKey: 'profile.badges.first_question.description',
        conditionKey: 'profile.badges.first_question.condition',
        image: '/trophies/first-question.webp',
        check: (stats) => stats.questions >= 1,
    },
    {
        id: 'ten_votes',
        titleKey: 'profile.badges.ten_votes.title',
        descriptionKey: 'profile.badges.ten_votes.description',
        conditionKey: 'profile.badges.ten_votes.condition',
        image: '/trophies/ten-votes.webp',
        check: (stats) => stats.votes >= 10,
    },
    {
        id: 'three_questions',
        titleKey: 'profile.badges.three_questions.title',
        descriptionKey: 'profile.badges.three_questions.description',
        conditionKey: 'profile.badges.three_questions.condition',
        image: '/trophies/three-questions.webp',
        check: (stats) => stats.approvedQuestions >= 3,
    },
]

type BadgeContextType = {
    unlockedBadge: BadgeDefinition | null
    showBadge: (badge: BadgeDefinition) => void
    hideBadge: () => void
    checkNewBadges: (prevStats: BadgeStats | null, newStats: BadgeStats) => void
}

const BadgeContext = createContext<BadgeContextType | undefined>(undefined)

export function BadgeProvider({ children }: { children: React.ReactNode }) {
    const [unlockedBadge, setUnlockedBadge] = useState<BadgeDefinition | null>(null)

    const showBadge = useCallback((badge: BadgeDefinition) => {
        setUnlockedBadge(badge)
    }, [])

    const hideBadge = useCallback(() => {
        setUnlockedBadge(null)
    }, [])

    const checkNewBadges = useCallback((prevStats: BadgeStats | null, newStats: BadgeStats) => {
        // If no previous stats, this is initial load - don't show popup
        if (!prevStats) return

        // Check each badge to see if it was just unlocked
        for (const badge of BADGE_DEFINITIONS) {
            const wasUnlocked = badge.check(prevStats)
            const isNowUnlocked = badge.check(newStats)

            if (!wasUnlocked && isNowUnlocked) {
                // Badge was just unlocked!
                showBadge(badge)
                // Only show one badge at a time (first one found)
                break
            }
        }
    }, [showBadge])

    return (
        <BadgeContext.Provider value={{ unlockedBadge, showBadge, hideBadge, checkNewBadges }}>
            {children}
        </BadgeContext.Provider>
    )
}

export function useBadge() {
    const context = useContext(BadgeContext)
    if (context === undefined) {
        throw new Error('useBadge must be used within a BadgeProvider')
    }
    return context
}
