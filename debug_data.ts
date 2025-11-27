
import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

dotenv.config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
    console.error('Missing Supabase environment variables')
    process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseAnonKey)

async function checkData() {
    const { data, error } = await supabase
        .from('daily_metrics')
        .select('*')
        .order('date', { ascending: true })

    if (error) {
        console.error('Error fetching data:', error)
    } else {
        console.log('Daily Metrics Data:')
        console.log(JSON.stringify(data, null, 2))
    }
}

checkData()
