"use client"

import { createContext, useContext, useEffect, useState } from 'react'
import { User } from '@supabase/supabase-js'
import { supabase } from '@/lib/supabase'
import type { Database } from '@/types/database'

type Profile = {
    nickname: string | null
    total_vote_count: number
    total_question_count: number
    total_approved_question_count: number
}

type RefreshProfileResult = {
    prevProfile: Profile | null
    newProfile: Profile | null
}

type AuthContextType = {
    user: User | null
    profile: Profile | null
    loading: boolean
    signIn: (email: string, password: string) => Promise<{ error: any }>
    signUp: (email: string, password: string) => Promise<{ error: any }>
    signInWithOAuth: (provider: 'google' | 'apple' | 'discord' | 'github') => Promise<void>
    signOut: () => Promise<void>
    resetPassword: (email: string) => Promise<{ error: any }>
    refreshProfile: () => Promise<RefreshProfileResult>
    updateNickname: (nickname: string) => Promise<{ error: any }>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null)
    const [profile, setProfile] = useState<Profile | null>(null)
    const [loading, setLoading] = useState(true)

    const fetchProfile = async (userId: string) => {
        const { data } = await supabase
            .from('profiles')
            .select('nickname, total_vote_count, total_question_count, total_approved_question_count')
            .eq('id', userId)
            .single()

        if (data) {
            setProfile(data)
        }
    }

    const refreshProfile = async (): Promise<RefreshProfileResult> => {
        const prevProfile = profile
        if (user) {
            const { data } = await supabase
                .from('profiles')
                .select('nickname, total_vote_count, total_question_count, total_approved_question_count')
                .eq('id', user.id)
                .single()

            if (data) {
                setProfile(data)
                return { prevProfile, newProfile: data }
            }
        }
        return { prevProfile, newProfile: null }
    }

    useEffect(() => {
        // Check active session
        supabase.auth.getSession().then(({ data: { session } }) => {
            setUser(session?.user ?? null)
            if (session?.user) {
                fetchProfile(session.user.id)
            }
            setLoading(false)
        })

        // Listen for auth changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setUser(session?.user ?? null)
            if (session?.user) {
                fetchProfile(session.user.id)
            } else {
                setProfile(null)
            }
            setLoading(false)
        })

        return () => subscription.unsubscribe()
    }, [])

    const signIn = async (email: string, password: string) => {
        const { error } = await supabase.auth.signInWithPassword({
            email,
            password,
        })
        return { error }
    }

    const signUp = async (email: string, password: string) => {
        const { error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                emailRedirectTo: `${window.location.origin}/auth/callback`,
            },
        })
        return { error }
    }

    const signInWithOAuth = async (provider: 'google' | 'apple' | 'discord' | 'github') => {
        await supabase.auth.signInWithOAuth({
            provider,
            options: {
                redirectTo: `${window.location.origin}/auth/callback`,
            },
        })
    }

    const signOut = async () => {
        await supabase.auth.signOut()
    }

    const resetPassword = async (email: string) => {
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
            redirectTo: `${window.location.origin}/reset-password`,
        })
        return { error }
    }

    const updateNickname = async (nickname: string) => {
        if (!user) return { error: new Error('Not logged in') }

        // Using type assertion to work around Supabase client type inference issue
        const { error } = await (supabase
            .from('profiles') as any)
            .update({ nickname })
            .eq('id', user.id)

        if (!error) {
            setProfile(prev => prev ? { ...prev, nickname } : null)
        }

        return { error }
    }

    const value = {
        user,
        profile,
        loading,
        signIn,
        signUp,
        signInWithOAuth,
        signOut,
        resetPassword,
        refreshProfile,
        updateNickname,
    }

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
    const context = useContext(AuthContext)
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider')
    }
    return context
}
