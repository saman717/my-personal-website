# Tasks — Hooks

## useLifeOS

**File:** `src/hooks/useLifeOS.ts`
**Used by:** `AdminTasksPageContent`

### Signature
```ts
function useLifeOS(locale: string)
```

### State
- `selectedDate: Date` — currently selected day
- `tasks: Task[]` — all tasks for selected date
- `isLoading: boolean`
- `isModalOpen / modalTimeSlot / taskToEdit` — modal control

### Computed
- `dateStr` — `YYYY-MM-DD` from selectedDate
- `displayDateStr` — localized date string (Intl.DateTimeFormat)
- `scheduledTasks` — tasks with timeSlot
- `floatingTasks` — tasks without timeSlot
- `slotCapacities` — `Record<string, number>` — total duration used per slot

### Methods
- `loadTasksForDate()` — calls `getTasksForDateAction(dateStr)`
- `handleOpenModal(timeSlot?, task?)` — opens modal for create/edit
- `handleCloseModal()`
- `handleToggleGoal(taskId, currentAttempted, currentAchieved, field)` — optimistic UI + `updateTaskGoalsAction`

---

## useTaskForm

**File:** `src/hooks/useTaskForm.ts`
**Used by:** `TaskModal`

### Signature
```ts
function useTaskForm(props: {
  isOpen: boolean; onClose: () => void; onSuccess: () => Promise<void>;
  selectedDateStr: string; initialTimeSlot: string | null;
  slotCapacities: Record<string, number>; taskToEdit?: Task | null;
  labels: any;
})
```

### State
title, description, priority, timeSlot, isBlocking, duration, recurrence, category, energyLevel, editScope, templates, selectedTemplateId, saveAsTemplate, isSubmitting

### Key Logic
- `calculateMaxDuration()` — calculates max allowed duration based on slot capacity. Considers consecutive empty slots up to 480min. Subtracts existing task duration in edit mode.
- `handleTemplateSelect(tmplId)` — loads template values into form
- `handleSubmit` — creates or updates task. If create + saveAsTemplate → also calls `createTaskTemplateAction`
- `handleDelete` — calls `deleteTaskAction(id, editScope, dateStr)`
- Auto-loads templates on modal open (create mode only)
- Auto-adjusts duration if exceeds maxAllowedDuration when timeSlot changes
