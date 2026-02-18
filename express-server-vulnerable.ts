/**
 * SAMPLE: Vulnerable Express Server
 *
 * Issues this file demonstrates (for VibeSafe scanning):
 *  1. Missing Helmet.js security headers middleware (CWE-693)
 *  2. No rate limiting on auth endpoints (CWE-770)
 *  3. SQL injection via template literal concatenation (CWE-89)
 *  4. Hardcoded JWT secret (CWE-321)
 *  5. Path traversal via user-controlled file path (CWE-22)
 */

import express from 'express'
import jwt from 'jsonwebtoken'
import fs from 'fs'
import path from 'path'
import { Pool } from 'pg'

// ISSUE 1: No helmet() call — security headers missing
const app = express()
app.use(express.json())

const db = new Pool({ connectionString: process.env.DATABASE_URL })

// ISSUE 4: Hardcoded JWT secret — should be a long random env variable
const JWT_SECRET = 'super-secret-key-123'

// ISSUE 2: No rate limiting on the login route
app.post('/api/login', async (req, res) => {
  const { username, password } = req.body

  // ISSUE 3: SQL injection — template literal with user input
  const result = await db.query(
    `SELECT * FROM users WHERE username = '${username}' AND password = '${password}'`
  )

  if (result.rows.length === 0) {
    return res.status(401).json({ error: 'Invalid credentials' })
  }

  // ISSUE 4: Signing with hardcoded secret
  const token = jwt.sign({ userId: result.rows[0].id }, JWT_SECRET, {
    expiresIn: '7d',
  })

  res.json({ token })
})

// ISSUE 5: Path traversal — user controls filename directly
app.get('/api/files', (req, res) => {
  const filename = req.query.file as string
  const filePath = path.join('/var/uploads', filename)

  // An attacker can pass filename = '../../etc/passwd'
  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) return res.status(404).json({ error: 'File not found' })
    res.send(data)
  })
})

// ISSUE 2: No rate limiting on password reset either
app.post('/api/reset-password', async (req, res) => {
  const { email } = req.body

  // ISSUE 3: Another SQL injection
  const result = await db.query(
    "SELECT id FROM users WHERE email = '" + email + "'"
  )

  if (result.rows.length === 0) {
    return res.status(404).json({ error: 'User not found' })
  }

  res.json({ message: 'Password reset email sent' })
})

app.listen(3001, () => {
  console.log('Server running on port 3001')
})
