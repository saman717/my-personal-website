# Portfolio — Overview

## Architecture
Multi-table portfolio system with i18n translations, HTML content, images, technologies, and links per project.

## Tables (5)
- `portfolioProjects` — base record (slug, status, sortOrder)
- `portfolioProjectTranslations` — per-locale text (fa/en): title, brief, badge, meta fields, challenge/solution/results sections
- `portfolioProjectContent` — free HTML per locale
- `portfolioTechnologies` — global tech catalog
- `portfolioProjectTechnologies` — junction: project ↔ technology
- `portfolioProjectImages` — images with isPrimary and sortOrder
- `portfolioProjectLinks` — links (github, demo, etc)

## File Map
| File | Type |
|------|------|
| `src/actions/admin-portfolio.ts` | Admin CRUD actions |
| `src/lib/queries/projects.ts` | Public read queries (`getPublishedProjects`, `getProjectBySlug`) |
| `src/components/projects/ProjectDetail.tsx` | Detail page UI (async Server Component) |
| `src/components/projects/ProjectCard.tsx` | Card component with real image support |
| `src/components/projects/ProjectsSection.tsx` | Home page grid (3 cards) |
| `src/components/admin/portfolio/*` | Admin components |
| `src/app/[locale]/(public)/portfolio/page.tsx` | Public list page |
| `src/app/[locale]/(public)/portfolio/[slug]/page.tsx` | Public detail page (thin, delegates to ProjectDetail) |
| `src/app/[locale]/admin/portfolio/page.tsx` | Admin list |
| `src/app/[locale]/admin/portfolio/new/page.tsx` | Create form |
| `src/app/[locale]/admin/portfolio/[id]/edit/page.tsx` | Edit form |

## i18n Keys (messages/*.json)
```
portfolio.detail.back
portfolio.detail.links
portfolio.detail.role
portfolio.detail.platform
portfolio.detail.category
portfolio.detail.status_label
portfolio.detail.challenge
portfolio.detail.solution
portfolio.detail.results
portfolio.detail.gallery
portfolio.detail.no_content
portfolio.detail.last_updated
portfolio.tech_stack
```
