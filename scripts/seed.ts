import { config } from 'dotenv'
import { createClient } from '@supabase/supabase-js'

// Load .env.local file
config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

console.log('Supabase URL:', supabaseUrl ? '✓ Loaded' : '✗ Missing')
console.log('Supabase Key:', supabaseAnonKey ? '✓ Loaded' : '✗ Missing')

const supabase = createClient(supabaseUrl, supabaseAnonKey)

const SEED_QUESTIONS = [
    {
        content: "Can an AI model consistently solve International Math Olympiad (IMO) problems at a gold medal level?",
        category: "linguistic",
        author_id: null,
    },
    {
        content: "Can an AI agent independently navigate the open web to book a complex travel itinerary including flights, hotels, and reservations?",
        category: "multimodal",
        author_id: null,
    },
    {
        content: "Can an AI model generate a coherent, 90-minute movie with consistent characters and plot from a simple text prompt?",
        category: "multimodal",
        author_id: null,
    },
    {
        content: "Can an AI translate a previously unknown language by learning solely from a small corpus of text without parallel data?",
        category: "linguistic",
        author_id: null,
    },
    {
        content: "Can an AI write a novel that wins a major literary award (e.g., Pulitzer, Booker) without human editing?",
        category: "linguistic",
        author_id: null,
    },
    {
        content: "Can an AI diagnose complex medical cases with higher accuracy than a board-certified specialist across multiple domains?",
        category: "multimodal",
        author_id: null,
    },
    {
        content: "Can an AI agent successfully found and run a profitable dropshipping business with $100 starting capital?",
        category: "multimodal",
        author_id: null,
    },
    {
        content: "Can an AI compose a symphony that is indistinguishable from a human master's work to expert critics?",
        category: "multimodal",
        author_id: null,
    },
    {
        content: "Can an AI perfectly replicate a specific human's voice from a 3-second sample?",
        category: "multimodal",
        author_id: null,
    }
]

async function seedDatabase() {
    console.log('🌱 Starting database seeding...')

    // Insert questions
    const { data: questions, error: questionsError } = await supabase
        .from('questions')
        .insert(SEED_QUESTIONS)
        .select()

    if (questionsError) {
        console.error('❌ Error inserting questions:', questionsError)
        return
    }

    console.log(`✅ Inserted ${questions.length} questions`)

    // Add some sample votes to make questions indexed
    if (questions && questions.length > 0) {
        const sampleVotes = []

        // Make first 6 questions "indexed" by adding enough suitable votes
        for (let i = 0; i < Math.min(6, questions.length); i++) {
            const questionId = questions[i].id

            // Add 15 suitable votes with varying achieved status
            for (let j = 0; j < 15; j++) {
                sampleVotes.push({
                    question_id: questionId,
                    user_id: `00000000-0000-0000-0000-00000000000${j}`, // Mock user IDs
                    is_suitable: true,
                    is_achieved: i < 2 ? (j < 8) : (j < 5), // First 2 questions more achieved
                    weight: (j % 3) + 1, // Rotate between 1, 2, 3
                })
            }
        }

        // Add unsuitable votes to remaining questions
        for (let i = 6; i < questions.length; i++) {
            const questionId = questions[i].id
            const reasons = ['too_broad', 'too_narrow', 'duplicate']

            for (let j = 0; j < 5; j++) {
                sampleVotes.push({
                    question_id: questionId,
                    user_id: `00000000-0000-0000-0000-00000000000${j}`,
                    is_suitable: false,
                    unsuitable_reason: reasons[j % reasons.length],
                    is_achieved: null,
                    weight: null,
                })
            }
        }

        const { error: votesError } = await supabase
            .from('votes')
            .insert(sampleVotes)

        if (votesError) {
            console.error('❌ Error inserting votes:', votesError)
            return
        }

        console.log(`✅ Inserted ${sampleVotes.length} sample votes`)
    }

    console.log('🎉 Database seeding completed!')
}

seedDatabase()
