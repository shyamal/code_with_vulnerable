/**
 * SAMPLE: Vulnerable Next.js API Route
 *
 * Issues this file demonstrates (for VibeSafe scanning):
 *  1. No authentication check (CWE-306)
 *  2. No rate limiting (CWE-770)
 *  3. SQL injection via string concatenation (CWE-89)
 *  4. Supabase service role key used in frontend context (CWE-522)
 *  5. IDOR – querying by user-supplied ID without ownership check (CWE-639)
 */

import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

// ISSUE 4: Service role key used here — bypasses all RLS policies
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!  // should be anon key on client side
)

// ISSUE 1 & 2: No auth check, no rate limiting
export async function GET(req: NextRequest) {
  const userId = req.nextUrl.searchParams.get('userId')

  // ISSUE 5: IDOR — no check that the caller owns this userId
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('id', req.params.userId)

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(data)
}

// ISSUE 1 & 2: POST also has no auth or rate limiting
export async function POST(req: NextRequest) {
  const body = await req.json()
  const { username } = body

  // ISSUE 3: SQL injection — user input concatenated directly into query string
  const { data, error } = await supabase.rpc('raw_query', {
    sql: "SELECT * FROM users WHERE username = '" + username + "'"
  })

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(data)
}
