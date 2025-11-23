"use client"

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import en from '@/messages/en.json'
import ko from '@/messages/ko.json'

type Language = 'en' | 'ko'
type Translations = typeof en

interface I18nContextType {
    language: Language
    setLanguage: (lang: Language) => void
    t: (key: string) => string
}

const I18nContext = createContext<I18nContextType | undefined>(undefined)

const translations: Record<Language, Translations> = {
    en,
    ko
}

export function I18nProvider({ children }: { children: ReactNode }) {
    const [language, setLanguage] = useState<Language>('en')

    useEffect(() => {
        const savedLang = localStorage.getItem('language') as Language
        if (savedLang && (savedLang === 'en' || savedLang === 'ko')) {
            setLanguage(savedLang)
        }
    }, [])

    const handleSetLanguage = (lang: Language) => {
        setLanguage(lang)
        localStorage.setItem('language', lang)
    }

    const t = (key: string): string => {
        const keys = key.split('.')
        let value: any = translations[language]

        for (const k of keys) {
            if (value && typeof value === 'object' && k in value) {
                value = value[k as keyof typeof value]
            } else {
                // Fallback to English if translation missing
                let fallback: any = translations['en']
                for (const fk of keys) {
                    if (fallback && typeof fallback === 'object' && fk in fallback) {
                        fallback = fallback[fk as keyof typeof fallback]
                    } else {
                        return key
                    }
                }
                return fallback as string
            }
        }

        return value as string
    }

    return (
        <I18nContext.Provider value={{ language, setLanguage: handleSetLanguage, t }}>
            {children}
        </I18nContext.Provider>
    )
}

export function useI18n() {
    const context = useContext(I18nContext)
    if (context === undefined) {
        throw new Error('useI18n must be used within an I18nProvider')
    }
    return context
}
