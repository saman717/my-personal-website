# SEO

## Files

| File | Role |
|------|------|
| `src/components/seo/JsonLd.tsx` | JSON-LD structured data component |
| `src/app/sitemap.ts` | Dynamic sitemap generation |
| `src/app/robots.ts` | Robots.txt config |
| `src/app/[locale]/(public)/layout.tsx` | Metadata exports per locale |

## JsonLd Component
**File:** `src/components/seo/JsonLd.tsx`
Renders `<script type="application/ld+json">` with structured data. Used in layout for site-wide schema.

## Metadata
Next.js `generateMetadata` in layout files. Locale-aware titles and descriptions from `next-intl` messages.
