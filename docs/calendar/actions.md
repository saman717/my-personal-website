# Calendar — Admin Actions

**File:** `src/actions/admin-calendar.ts` (8,708 bytes)

**Note:** This file uses `adminTasks` table (legacy). The main task system uses `tasks` table. These two may need unification.

## Functions

### `createAdminTaskAction(title: string, date: string)`
Inserts into `adminTasks` with title and date (no timeSlot).

### `assignTimeToTaskAction(taskId: string, timeSlot: string)`
Updates `timeSlot` on existing admin task.

### `toggleBlockDateAction(date: string)`
Toggle logic:
- If date exists in `blockedDates` → delete it (unblock)
- If not → insert it (block)
Returns `{ success, isBlocked: boolean }`.

### `getAvailableSlotsAction(date: string)`
Returns available slots for admin view. Checks:
1. All `adminTasks` for the date → occupied slots
2. All `bookings` (PENDING/ACCEPTED/CONFIRMED) for the date → occupied slots
3. Returns `MASTER_TIME_SLOTS` minus occupied

### `getAdminTasksAction(date: string)`
Returns all `adminTasks` for a specific date.
