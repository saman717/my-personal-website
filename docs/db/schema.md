# Database Schema

**File:** `src/db/schema.ts`
**ORM:** Drizzle ORM + PostgreSQL (Supabase)
**Connection:** `src/db/index.ts` — singleton with `dbRetry()` wrapper

---

## Tables

### contactMessages
| Column | Type | Notes |
|--------|------|-------|
| id | uuid | PK, auto |
| name | text | NOT NULL |
| email | text | NOT NULL |
| phone | text | nullable |
| message | text | NOT NULL |
| locale | text | default `'fa'` |
| isRead | boolean | default `false` |
| createdAt | timestamp | auto |

### tasks
| Column | Type | Notes |
|--------|------|-------|
| id | uuid | PK, auto |
| title | text | NOT NULL |
| description | text | nullable |
| status | enum | `'todo'` / `'in_progress'` / `'done'` |
| priority | enum | `'low'` / `'medium'` / `'high'` |
| duration | integer | default `60` (minutes) |
| date | text | `YYYY-MM-DD` |
| timeSlot | text | nullable (null = floating task) |
| isBlocking | boolean | blocks client booking calendar |
| recurrence | enum | `'none'` / `'daily'` / `'weekly'` / `'monthly'` |
| category | text | default `'work'` |
| energyLevel | enum | `'low'` / `'medium'` / `'high'` |
| isAttempted | boolean | goal tracking |
| isAchieved | boolean | goal tracking |
| exceptionDates | text | JSON string `"[]"` — skipped dates for recurring |
| parentId | uuid | nullable — links edited instance to recurring parent |
| createdAt | timestamp | auto |
| updatedAt | timestamp | auto |

**Index:** `tasks_date_idx` on `date`

### bookings
| Column | Type | Notes |
|--------|------|-------|
| id | uuid | PK, auto |
| clientName | text | NOT NULL |
| clientEmail | text | NOT NULL |
| date | text | `YYYY-MM-DD` |
| timeSlot | text | NOT NULL |
| meetingType | enum | `'Online'` / `'In-Location'` |
| status | enum | `'PENDING'` / `'ACCEPTED'` / `'CONFIRMED'` / `'REJECTED'` |
| clientNote | text | nullable |
| adminNote | text | nullable |
| googleEventId | text | nullable (future use) |
| createdAt | timestamp | auto |
| updatedAt | timestamp | auto, `$onUpdate` |

### adminTasks (legacy)
| Column | Type | Notes |
|--------|------|-------|
| id | uuid | PK, auto |
| date | text | `YYYY-MM-DD` |
| title | text | NOT NULL |
| timeSlot | text | nullable |
| createdAt | timestamp | auto |

**Index:** `admin_tasks_date_idx` on `date`
**Note:** Still used by `src/actions/admin-calendar.ts`. Main task system uses `tasks` table.

### blockedDates
| Column | Type | Notes |
|--------|------|-------|
| id | uuid | PK, auto |
| date | text | UNIQUE, `YYYY-MM-DD` |
| reason | text | nullable |

**Index:** `blocked_dates_date_idx` on `date`

### taskLogs
| Column | Type | Notes |
|--------|------|-------|
| id | uuid | PK, auto |
| taskId | uuid | FK → tasks.id (CASCADE) |
| date | text | `YYYY-MM-DD` |
| isAttempted | boolean | default `false` |
| isAchieved | boolean | default `false` |
| createdAt | timestamp | auto |

### taskTemplates
| Column | Type | Notes |
|--------|------|-------|
| id | uuid | PK, auto |
| title | text | NOT NULL |
| description | text | nullable |
| duration | integer | default `60` |
| priority | enum | `'low'` / `'medium'` / `'high'` |
| category | text | default `'work'` |
| energyLevel | enum | `'low'` / `'medium'` / `'high'` |
| isBlocking | boolean | default `false` |
| createdAt | timestamp | auto |

### commutes
| Column | Type | Notes |
|--------|------|-------|
| id | uuid | PK |
| date | timestamp | auto |
| departureTime | text | `HH:MM` |
| arrivalTime | text | `HH:MM` |
| durationMinutes | integer | calculated |
| trafficLevel | enum | `'low'` / `'medium'` / `'heavy'` |

### extensibleLogs
| Column | Type | Notes |
|--------|------|-------|
| id | uuid | PK |
| moduleName | text | e.g. `"TELEGRAM_BOT"` |
| actionType | text | e.g. `"USER_SUBSCRIBED"` |
| metaData | jsonb | dynamic JSON |
| createdAt | timestamp | auto |

### Portfolio tables (5 tables)

**portfolioProjects**
| Column | Type | Notes |
|--------|------|-------|
| id | uuid | PK |
| slug | text | UNIQUE |
| status | enum | `'draft'` / `'published'` / `'archived'` |
| sortOrder | integer | default `0` |
| publishedAt | timestamp(tz) | nullable |
| createdAt / updatedAt | timestamp(tz) | auto |

**portfolioProjectTranslations** — per-locale text for each project
| Column | Type |
|--------|------|
| id, projectId (FK→projects CASCADE), locale (`'fa'`/`'en'`) | uuid, uuid, text |
| title, brief, badge, metaRole, metaPlatform, metaCategory, metaStatus | text fields |
| challengeTitle, challengeText, solutionTitle | text |
| solutionSteps | jsonb `{step, detail?}[]` |
| resultsTitle | text |
| resultsItems | jsonb `{label, value}[]` |
| techStackTitle | text |

**portfolioProjectContent** — free HTML per locale
| Column | Type |
|--------|------|
| projectId (FK CASCADE), locale, contentHtml | uuid, text, text |

**portfolioTechnologies** — global tech list
| Column | Type |
|--------|------|
| id, name, slug (UNIQUE), icon, website | uuid, text, text, text, text |

**portfolioProjectTechnologies** — junction table (projectId FK, technologyId FK)

**portfolioProjectImages**
| Column | Type | Notes |
|--------|------|-------|
| projectId (FK CASCADE), url, alt, isPrimary | uuid, text, text, integer (1/0) |
| sortOrder | integer | default `0` |

**portfolioProjectLinks**
| Column | Type |
|--------|------|
| projectId (FK CASCADE), type, url, label, sortOrder | uuid, text, text, text, integer |

---

## DB Connection

**File:** `src/db/index.ts`

```ts
export const db: PostgresJsDatabase  // singleton
export async function dbRetry<T>(fn: () => Promise<T>, retries = 3): Promise<T>
```

`dbRetry` retries on connection failures with exponential backoff. Used by queries and some actions.
