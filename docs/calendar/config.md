# Calendar — Config

## Master Time Slots

**File:** `src/lib/calendar.config.ts`

### `generateMasterTimeSlots(startHour, endHour, intervalMinutes)`
Generates array of time strings in `HH:MM AM/PM` format.

### `MASTER_TIME_SLOTS`
```ts
export const MASTER_TIME_SLOTS = generateMasterTimeSlots(6, 22, 60)
```
Generates 17 slots: `06:00 AM` through `10:00 PM`, 1-hour intervals.

**Used by:** booking slot filtering, task timeline, admin calendar, useLifeOS slot capacity calculation, useTaskForm max duration calculation.

---

## Reservation Check

**File:** `src/lib/reservation-check.ts`

### `checkTimeConflict(requestedDate: string, requestedTimeSlot: string): Promise<boolean>`
Checks if a CONFIRMED booking exists at exact date+timeSlot. Returns `true` if conflict exists.
Only checks `status = 'CONFIRMED'` bookings.
