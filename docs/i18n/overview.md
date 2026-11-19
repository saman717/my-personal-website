# Internationalization (i18n)

## Setup
- **Library:** `next-intl`
- **Locales:** `fa` (default, Farsi), `en` (English)
- **Routing:** `[locale]` dynamic segment in all routes
- **Messages:** `messages/fa.json`, `messages/en.json`

## How it works
1. `src/middleware.ts` — if path missing locale → redirect to `/fa/...` (307)
2. `[locale]` segment in App Router captures locale
3. `next-intl` provides `useTranslations()` hook for client components
4. Server components access translations via `getTranslations()`

## Key patterns
- All pages under `src/app/[locale]/`
- Route groups: `(public)` for public pages, `admin` (no group) for admin
- Messages organized by feature namespace in JSON files
- Direction: `fa` = RTL, `en` = LTR (handled via `dir` attribute on `<html>`)

## Files
| File | Role |
|------|------|
| `messages/fa.json` | Farsi translations |
| `messages/en.json` | English translations |
| `src/middleware.ts` | Locale detection + redirect |
| `src/i18n.ts` | next-intl config (if exists) |
