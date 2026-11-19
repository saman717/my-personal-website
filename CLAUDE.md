@AGENTS.md

# Project: samankhoshnoud.ir — Personal Website

## Stack
- Next.js 16 (App Router) + React 19 + TypeScript
- Tailwind CSS v4 (config in CSS via `@theme`, no `tailwind.config.js`)
- Drizzle ORM + PostgreSQL (Supabase)
- next-intl i18n: `[locale]` segments, `fa` (default) / `en`
- Server Actions (`"use server"`) for all mutations
- TanStack Query for client-side data fetching
- React Hook Form + Zod for forms
- Framer Motion for animations

## Routing
```
src/app/[locale]/
├── (public)/          → public pages (home, about, services, blog, contact, booking, portfolio)
├── admin/             → admin panel (dashboard, tasks, bookings, messages, portfolio)
└── api/auth/          → login/logout API routes
```

## Documentation Index

**Before making changes, read the relevant doc(s) below.** Each feature has its own folder with sub-docs. Read only what you need.

### Database
| Need | Read |
|------|------|
| Table schemas, columns, types, indexes | `docs/db/schema.md` |

### Auth
| Need | Read |
|------|------|
| Auth flow, JWT, middleware, API routes | `docs/auth/overview.md` |

### Booking
| Need | Read |
|------|------|
| Booking flow, status transitions, 3-layer security | `docs/booking/overview.md` |
| Server action signatures (public + admin) | `docs/booking/actions.md` |
| Public components (calendar, form, slots) | `docs/booking/components-public.md` |
| Admin components (table, panel, rules) | `docs/booking/components-admin.md` |
| Hooks (useBookingManager) | `docs/booking/hooks.md` |

### Tasks (LifeOS)
| Need | Read |
|------|------|
| Task system concepts, recurrence, goal tracking | `docs/tasks/overview.md` |
| Server action signatures (10+ functions) | `docs/tasks/actions.md` |
| Admin components (timeline, modal, cards) | `docs/tasks/components.md` |
| Hooks (useLifeOS, useTaskForm) | `docs/tasks/hooks.md` |

### Contact & Messages
| Need | Read |
|------|------|
| Contact flow, Telegram notification | `docs/contact/overview.md` |
| Server action signatures (public + admin) | `docs/contact/actions.md` |
| Public components (form, info, hero) | `docs/contact/components-public.md` |
| Admin components + hooks (messages manager, mutations) | `docs/contact/components-admin.md` |

### Portfolio
| Need | Read |
|------|------|
| Portfolio architecture, 5-table structure | `docs/portfolio/overview.md` |
| Admin CRUD actions (project, images, techs) | `docs/portfolio/actions.md` |
| Public queries (getPublishedProjects) | `docs/portfolio/queries.md` |
| Public components (cards, tags) | `docs/portfolio/components-public.md` |
| Admin components (form 28KB, images, techs) | `docs/portfolio/components-admin.md` |

### Calendar & Config
| Need | Read |
|------|------|
| Admin calendar actions (legacy adminTasks) | `docs/calendar/actions.md` |
| MASTER_TIME_SLOTS, reservation check | `docs/calendar/config.md` |

### Layout & Providers
| Need | Read |
|------|------|
| Header, LanguageSwitcher, MobileMenu, Admin sidebar | `docs/layout/header.md` |
| Footer | `docs/layout/footer.md` |
| ReactQueryProvider, ToastContext, QueryKeys, UI | `docs/layout/providers.md` |

### Public Pages
| Need | Read |
|------|------|
| Home page components | `docs/public-pages/home.md` |
| About page components + data sources | `docs/public-pages/about.md` |
| Services page components | `docs/public-pages/services.md` |
| Blog page | `docs/public-pages/blog.md` |

### SEO & i18n
| Need | Read |
|------|------|
| JSON-LD, sitemap, robots, metadata | `docs/seo/overview.md` |
| i18n setup, locale routing, messages | `docs/i18n/overview.md` |

## Development Rules
1. **Read before writing.** Always read the relevant doc first.
2. **Server Actions only.** No API routes for data mutations (except auth).
3. **Zod validates** all form inputs on the server side.
4. **`dbRetry()` wrapper** for all direct DB queries.
5. **Status is text-based**, stored as `YYYY-MM-DD` date strings (not Date objects).
6. **Tailwind v4** — styles via CSS `@theme` directive, no JS config file.
7. **i18n** — all user-facing text from `messages/*.json` via `next-intl`.
8. **Recurrence system** — read `docs/tasks/actions.md` before touching task logic.
9. **Booking security** — 3-layer check is critical, read `docs/booking/actions.md`.
