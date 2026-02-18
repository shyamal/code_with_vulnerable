# VibeSafe Sample — Vulnerable Code for Scanner Testing

This folder contains **intentionally vulnerable** code samples. They exist solely to test and demonstrate VibeSafe's security scanner. Do not use any of this code in production.

---

## Files & Vulnerabilities Covered

### `api-route-vulnerable.ts` — Next.js API Route
| Issue | CWE | Severity |
|---|---|---|
| No authentication check on GET/POST | CWE-306 | WARNING |
| No rate limiting | CWE-770 | WARNING |
| SQL injection via string concat | CWE-89 | ERROR |
| Supabase service role key in client context | CWE-522 | ERROR |
| IDOR — no ownership check on user ID | CWE-639 | WARNING |

### `express-server-vulnerable.ts` — Express Server
| Issue | CWE | Severity |
|---|---|---|
| Missing Helmet.js security headers | CWE-693 | WARNING |
| No rate limiting on `/api/login` and `/api/reset-password` | CWE-770 | WARNING |
| SQL injection (template literal + string concat) | CWE-89 | ERROR |
| Hardcoded JWT secret | CWE-321 | ERROR |
| Path traversal via user-controlled file path | CWE-22 | ERROR |

### `hardcoded-secrets.ts` — Hardcoded Credentials
| Issue | CWE | Severity |
|---|---|---|
| Hardcoded OpenAI API key (`sk-proj-...`) | CWE-798 | ERROR |
| Hardcoded Anthropic API key (`sk-ant-...`) | CWE-798 | ERROR |
| Hardcoded Stripe live secret key (`sk_live_...`) | CWE-798 | ERROR |
| Hardcoded JWT secret in `jwt.sign` / `jwt.verify` | CWE-321 | ERROR |
| Hardcoded database password | CWE-798 | ERROR |
| Supabase service role key used on client | CWE-522 | ERROR |

### `react-component-vulnerable.tsx` — React Components
| Issue | CWE | Severity |
|---|---|---|
| `dangerouslySetInnerHTML` with unsanitized input (3 instances) | CWE-79 | WARNING |
| Prototype pollution via `Object.assign({}, userInput)` | CWE-1321 | INFO |
| Prototype pollution via spread `{ ...userInput }` | CWE-1321 | INFO |

---

## Expected VibeSafe Scan Results

Running VibeSafe on this folder should produce:

- **Stage 1 (Static Analysis)**: ~15+ findings across Semgrep and Gitleaks
- **Stage 2 (AI Triage)**: Most should be classified as `true_positive`
- **Stage 3 (Repair)**: Template fixes available for secrets and SQL injection
- **Stage 4 (Policy Gate)**: Decision should be `BLOCK` due to critical/high findings

---

## OWASP Top 10 Coverage

| OWASP Category | Demonstrated By |
|---|---|
| A01 Broken Access Control | IDOR, path traversal |
| A02 Cryptographic Failures | Hardcoded JWT secret |
| A03 Injection | SQL injection, XSS |
| A05 Security Misconfiguration | Missing Helmet headers |
| A07 Auth & Authentication Failures | No auth checks, service role key |
| A09 Security Logging & Monitoring | No rate limiting |
