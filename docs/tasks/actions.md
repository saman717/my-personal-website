# Tasks — Server Actions

**File:** `src/actions/tasks.ts` (14,751 bytes)

## Exported Types
```ts
type TaskStatus = 'todo' | 'in_progress' | 'done'
type TaskPriority = 'low' | 'medium' | 'high'
```

---

## Functions

### `getTasksForDateAction(dateStr: string)`
Returns tasks for a specific date including virtual recurring instances.
**Logic:**
1. Fetch non-recurring tasks for exact date
2. Fetch recurring tasks where original `date <= dateStr`
3. Filter recurring by type:
   - `daily`: always included
   - `weekly`: same day-of-week as original
   - `monthly`: same day-of-month as original
4. Exclude if `dateStr` is in task's `exceptionDates` array
5. Exclude if a child task (with `parentId` = this task) exists for this date
6. Merge both lists, sort by timeSlot

### `createTaskAction(title, date, timeSlot, isBlocking, duration, description, priority, recurrence, category, energyLevel)`
All 10 params. Inserts into `tasks` table. Returns `{ success, data }`.

### `updateTaskAction(id, title, timeSlot, isBlocking, duration, description, priority, recurrence, category, energyLevel, editScope, currentDateStr)`
**editScope: `'single'` | `'all'`**
- `'all'`: Updates the original task record directly
- `'single'`: Adds `currentDateStr` to parent's `exceptionDates`, then creates a NEW non-recurring task with `parentId` pointing to original. This preserves the recurring pattern while overriding one instance.

### `updateTaskStatusAction(id: string, newStatus: TaskStatus)`
Updates `status` + `updatedAt`.

### `deleteTaskAction(id: string, scope: 'single' | 'all', currentDateStr: string)`
- `'all'`: Hard delete the task
- `'single'`: Adds `currentDateStr` to task's `exceptionDates` (soft skip)

### `updateTaskGoalsAction(taskId: string, isAttempted: boolean, isAchieved: boolean, dateStr: string)`
Upserts into `taskLogs` — if log exists for taskId+date, updates; otherwise inserts.
Also updates the `tasks` row's `isAttempted`/`isAchieved`.

### `getTasksAction()`
Returns all tasks ordered by `date DESC`. (Backward compat, used for general listing.)

### `getTaskTemplatesAction()`
Returns all `taskTemplates` ordered by `createdAt DESC`.

### `createTaskTemplateAction(title, duration, description, priority, category, energyLevel, isBlocking)`
Inserts into `taskTemplates`.
