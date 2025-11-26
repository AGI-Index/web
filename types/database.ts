export type Json =
    | string
    | number
    | boolean
    | null
    | { [key: string]: Json | undefined }
    | Json[]

export interface Database {
    public: {
        Tables: {
            questions: {
                Row: {
                    id: string
                    author_id: string | null
                    content: string
                    category: string
                    status: 'pending' | 'approved' | 'rejected'
                    vote_count: number
                    suitable_count: number
                    unsuitable_count: number
                    achieved_count: number
                    not_achieved_count: number
                    current_weight: number
                    is_indexed: boolean
                    is_achieved: boolean
                    dominant_unsuitable_reason: string | null
                    created_at?: string
                }
                Insert: {
                    id?: string
                    author_id?: string | null
                    content: string
                    category: string
                    status?: 'pending' | 'approved' | 'rejected'
                    vote_count?: number
                    suitable_count?: number
                    unsuitable_count?: number
                    achieved_count?: number
                    not_achieved_count?: number
                    current_weight?: number
                    is_indexed?: boolean
                    is_achieved?: boolean
                    dominant_unsuitable_reason?: string | null
                    created_at?: string
                }
                Update: {
                    id?: string
                    author_id?: string | null
                    content?: string
                    category?: string
                    status?: 'pending' | 'approved' | 'rejected'
                    vote_count?: number
                    suitable_count?: number
                    unsuitable_count?: number
                    achieved_count?: number
                    not_achieved_count?: number
                    current_weight?: number
                    is_indexed?: boolean
                    is_achieved?: boolean
                    dominant_unsuitable_reason?: string | null
                    created_at?: string
                }
            }
            votes: {
                Row: {
                    id: string
                    user_id: string
                    question_id: string
                    is_suitable: boolean | null  // NULL 허용: 적합도 미투표
                    is_achieved: boolean | null  // NULL 허용: 달성도 미투표
                    weight: number | null
                    unsuitable_reason: string | null
                    updated_at?: string
                }
                Insert: {
                    id?: string
                    user_id: string
                    question_id: string
                    is_suitable?: boolean | null
                    is_achieved?: boolean | null
                    weight?: number | null
                    unsuitable_reason?: string | null
                    updated_at?: string
                }
                Update: {
                    id?: string
                    user_id?: string
                    question_id?: string
                    is_suitable?: boolean | null
                    is_achieved?: boolean | null
                    weight?: number | null
                    unsuitable_reason?: string | null
                    updated_at?: string
                }
            }
            daily_metrics: {
                Row: {
                    date: string
                    total_agi_percentage: number
                    linguistic_percentage: number
                    multimodal_percentage: number
                    snapshot_data?: Json
                    created_at?: string
                }
                Insert: {
                    date: string
                    total_agi_percentage: number
                    linguistic_percentage: number
                    multimodal_percentage: number
                    snapshot_data?: Json
                    created_at?: string
                }
                Update: {
                    date?: string
                    total_agi_percentage?: number
                    linguistic_percentage?: number
                    multimodal_percentage?: number
                    snapshot_data?: Json
                    created_at?: string
                }
            }
            agi_stats: {
                Row: {
                    id: number
                    overall_rate: number
                    linguistic_rate: number
                    multimodal_rate: number
                    updated_at?: string
                }
                Insert: {
                    id?: number
                    overall_rate?: number
                    linguistic_rate?: number
                    multimodal_rate?: number
                    updated_at?: string
                }
                Update: {
                    id?: number
                    overall_rate?: number
                    linguistic_rate?: number
                    multimodal_rate?: number
                    updated_at?: string
                }
            }
            profiles: {
                Row: {
                    id: string
                    nickname: string | null
                    is_admin: boolean
                    created_at?: string
                }
                Insert: {
                    id: string
                    nickname?: string | null
                    is_admin?: boolean
                    created_at?: string
                }
                Update: {
                    id?: string
                    nickname?: string | null
                    is_admin?: boolean
                    created_at?: string
                }
            }
        }
    }
}
