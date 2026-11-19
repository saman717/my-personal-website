# Contact — Overview

## Flow
1. Visitor fills contact form → `sendContactMessage` validates with Zod + inserts to DB
2. Telegram notification sent (fire-and-forget, no await)
3. Admin views/manages messages in `/admin/messages`

## Tables
- `contactMessages` (see `docs/db/schema.md`)

## File Map
| File | Type |
|------|------|
| `src/actions/contact.ts` | Public submit action |
| `src/actions/messages.ts` | Admin message management |
| `src/hooks/useMessages.ts` | Admin list/filter hook |
| `src/hooks/useMessageMutations.ts` | Admin mutation hook |
| `src/types/contact.ts` | Types |
| `src/components/forms/ContactForm.tsx` | Public form |
| `src/components/forms/ContactInfo.tsx` | Contact info display |
| `src/components/forms/ContactSection.tsx` | Form + info wrapper |
| `src/components/contact/*` | Public page components |
| `src/components/admin/messages/*` | Admin components |
| `src/app/[locale]/(public)/contact/page.tsx` | Public page |
| `src/app/[locale]/admin/messages/page.tsx` | Admin page |
