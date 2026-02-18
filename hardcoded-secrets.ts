/**
 * SAMPLE: Hardcoded Secrets & Credentials
 *
 * Issues this file demonstrates (for VibeSafe scanning via Gitleaks / Semgrep):
 *  1. Hardcoded OpenAI API key (CWE-798)
 *  2. Hardcoded Anthropic API key (CWE-798)
 *  3. Hardcoded Stripe live secret key (CWE-798)
 *  4. Hardcoded JWT secret (CWE-321)
 *  5. Hardcoded database password (CWE-798)
 *  6. Supabase service role key hardcoded in frontend code (CWE-522)
 */

import OpenAI from 'openai'
import Anthropic from '@anthropic-ai/sdk'
import Stripe from 'stripe'
import jwt from 'jsonwebtoken'
import { createClient } from '@supabase/supabase-js'

// ISSUE 1: Hardcoded OpenAI key — should be process.env.OPENAI_API_KEY
const openai = new OpenAI({
  apiKey: 'sk-proj-aBcDeFgHiJkLmNoPqRsTuVwXyZ1234567890abcdef',
})

// ISSUE 2: Hardcoded Anthropic key — should be process.env.ANTHROPIC_API_KEY
const anthropic = new Anthropic({
  apiKey: 'sk-ant-api03-SAMPLE_KEY_DO_NOT_USE_abcdefghijklmnopqrstuvwxyz',
})

// ISSUE 3: Hardcoded Stripe live key — should be process.env.STRIPE_SECRET_KEY
const stripe = new Stripe('sk_live_SAMPLE_KEY_DO_NOT_USE_abcdefghijklmnop', {
  apiVersion: '2023-10-16',
})

// ISSUE 4: Hardcoded JWT secret
function generateToken(userId: string): string {
  return jwt.sign({ userId }, 'my-hardcoded-jwt-secret-dont-do-this', {
    expiresIn: '24h',
  })
}

function verifyToken(token: string) {
  return jwt.verify(token, 'my-hardcoded-jwt-secret-dont-do-this')
}

// ISSUE 5: Database connection with hardcoded password
const dbConfig = {
  host: 'db.example.com',
  port: 5432,
  database: 'production_db',
  user: 'admin',
  password: 'Passw0rd!SuperSecret123',  // hardcoded DB password
}

// ISSUE 6: Supabase service role key hardcoded and used in (simulated) client context
const supabase = createClient(
  'https://xyzcompany.supabase.co',
  process.env.SUPABASE_SERVICE_ROLE_KEY!  // bypasses RLS — use anon key
)

export { openai, anthropic, stripe, generateToken, verifyToken, supabase }
