# Tasks — Admin Components

**Directory:** `src/components/admin/tasks/`

## AdminTasksPageContent
**File:** `AdminTasksPageContent.tsx`
Top-level page component. Uses `useLifeOS` hook. Renders weekly nav, timeline board, floating board, and task modal.

## WeeklyNav
**File:** `WeeklyNav.tsx`
Week navigation bar with day buttons. Shows current week, allows switching weeks.

## NavDayButton
**File:** `NavDayButton.tsx`
Individual day button in weekly nav. Highlights today and selected date.

## TimelineBoard
**File:** `TimelineBoard.tsx`
Main timeline view. Renders `MASTER_TIME_SLOTS` as rows. Each slot shows assigned tasks. Click empty slot → open modal with that timeSlot pre-selected.

## TaskCard
**File:** `TaskCard.tsx`
Individual task card on timeline. Shows title, duration, priority, category, energy level, blocking badge. Click → open modal in edit mode. Contains goal toggle checkboxes (attempted/achieved).

## FloatingBoard
**File:** `FloatingBoard.tsx`
Board for tasks without timeSlot (floating tasks). Separate section below timeline.

## TaskModal
**File:** `TaskModal.tsx` (15.9KB)
Full CRUD modal. Uses `useTaskForm` hook. Contains:
- Template selector (create mode only)
- Title, description, priority, category, energyLevel fields
- TimeSlot picker (from `MASTER_TIME_SLOTS` + "floating" option)
- Duration slider (respects `maxAllowedDuration` from slot capacity)
- Recurrence selector
- isBlocking toggle
- Edit scope radio (single/all) for recurring tasks
- Save-as-template checkbox
- Delete button (edit mode)

## Page
**File:** `src/app/[locale]/admin/tasks/page.tsx`
Renders `<AdminTasksPageContent>`.
