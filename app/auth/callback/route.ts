import { NextResponse } from 'next/server'

export async function GET(request: Request) {
    const requestUrl = new URL(request.url)
    const code = requestUrl.searchParams.get('code')

    if (code) {
        // Exchange code for session (handled by Supabase automatically)
        // Redirect to home page
        return NextResponse.redirect(new URL('/', request.url))
    }

    // If no code, redirect to login
    return NextResponse.redirect(new URL('/login', request.url))
}
