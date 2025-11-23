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
                    content: string
                    category: string
                    vote_count: number
                    suitable_votes: number
                    unsuitable_votes: number
                    current_weight: number
                    is_indexed: boolean
                    is_achieved: boolean
                    dominant_unsuitable_reason: string | null
                    created_at?: string
                }
                Insert: {
                    id?: string
                    content: string
                    category: string
                    vote_count?: number
                    current_weight?: number
                    is_indexed?: boolean
                    is_achieved?: boolean
                    dominant_unsuitable_reason?: string | null
                    created_at?: string
                }
                Update: {
                    id?: string
                    content?: string
                    category?: string
                    vote_count?: number
                    current_weight?: number
                    is_indexed?: boolean
                    is_achieved?: boolean
                    dominant_unsuitable_reason?: string | null
                    created_at?: string
                }
            }
            votes: {
                Row: {
                    user_id: string
                    question_id: string
                    is_suitable: boolean
                    is_achieved: boolean | null
                    weight: number | null
                    unsuitable_reason: string | null
                    created_at?: string
                }
                Insert: {
                    user_id: string
                    question_id: string
                    is_suitable: boolean
                    is_achieved?: boolean | null
                    weight?: number | null
                    unsuitable_reason?: string | null
                    created_at?: string
                }
                Update: {
                    user_id?: string
                    question_id?: string
                    is_suitable?: boolean
                    is_achieved?: boolean | null
                    weight?: number | null
                    unsuitable_reason?: string | null
                    created_at?: string
                }
            }
            daily_metrics: {
                Row: {
                    date: string
                    total_agi_percentage: number
                    linguistic_percentage: number
                    multimodal_percentage: number
                }
                Insert: {
                    date: string
                    total_agi_percentage: number
                    linguistic_percentage: number
                    multimodal_percentage: number
                }
                Update: {
                    date?: string
                    total_agi_percentage?: number
                    linguistic_percentage?: number
                    multimodal_percentage?: number
                }
            }
        }
    }
}
