# Tasks (LifeOS) — Overview

## Architecture
Personal task management with timeline view, recurring tasks, goal tracking, and templates.

## Key Concepts
- **Scheduled tasks:** Have a `timeSlot` — appear on timeline
- **Floating tasks:** `timeSlot = null` — appear in floating board
- **Blocking tasks:** `isBlocking = true` — blocks that slot in public booking calendar
- **Recurrence:** `daily` / `weekly` / `monthly` — virtual instances generated per date
- **Exception dates:** JSON array of dates where recurring task is skipped
- **parentId:** When editing a single instance of a recurring task, a new non-recurring child is created with `parentId` pointing to original
- **Goal tracking:** `isAttempted` / `isAchieved` per task per date (stored in `taskLogs`)
- **Templates:** Reusable task presets saved in `taskTemplates`

## Tables
- `tasks` — main task table (see `docs/db/schema.md`)
- `taskLogs` — per-date goal tracking (FK → tasks)
- `taskTemplates` — saved presets

## File Map
| File | Type |
|------|------|
| `src/actions/tasks.ts` | Server actions (14.7KB, 10+ functions) |
| `src/hooks/useLifeOS.ts` | Main page hook |
| `src/hooks/useTaskForm.ts` | Form/modal hook |
| `src/types/task.ts` | Task type definition |
| `src/lib/calendar.config.ts` | `MASTER_TIME_SLOTS` |
| `src/components/admin/tasks/*` | All admin components |
| `src/app/[locale]/admin/tasks/page.tsx` | Admin page |
