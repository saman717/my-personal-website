# Auth System

## Architecture
Stateless JWT using HMAC-SHA256 via Web Crypto API (Edge-compatible).
Single admin user. No registration. No NextAuth.

## Files

| File | Role |
|------|------|
| `src/lib/auth.ts` | Token create/verify + constants |
| `src/middleware.ts` | Locale redirect + admin guard |
| `src/app/[locale]/api/auth/login/route.ts` | Login API |
| `src/app/[locale]/api/auth/logout/route.ts` | Logout API |

---

## `src/lib/auth.ts`

### Constants
```ts
const PAYLOAD = 'admin-authenticated-v1'
export const SESSION_COOKIE = 'admin_session'
export const SESSION_MAX_AGE = 60 * 60 * 24 * 30 // 30 days
```

### Functions
```ts
export async function createSessionToken(): Promise<string>
// Signs PAYLOAD with ADMIN_SECRET via HMAC-SHA256, returns base64url

export async function verifySessionToken(token: string): Promise<boolean>
// Constant-time verify via crypto.subtle.verify
```

**Env:** `ADMIN_SECRET` — required in production, fallback in dev.

---

## `src/middleware.ts`

**Matcher:** Excludes `api`, `_next`, static files (`svg|png|jpg|...`)

### Step 1 — Locale Redirect
If path missing locale prefix → redirect to `/${defaultLocale}${path}` with **307** (not 301).

### Step 2 — Admin Auth Guard
If path matches `/${locale}/admin/*`:
- Login page → skip guard
- No valid token → redirect to `/${locale}/admin/login?from=${path}`
- Authenticated + on login page → redirect to `/${locale}/admin`

---

## API Routes

### POST `/api/auth/login`
- Body: `{ password: string }`
- Checks against `ADMIN_SECRET`
- Sets `admin_session` cookie (httpOnly, secure, sameSite: lax, 30 days)

### POST `/api/auth/logout`
- Deletes `admin_session` cookie
- Redirects to `/${locale}/admin/login`
