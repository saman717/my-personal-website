# Booking — Server Actions

## Public Actions

**File:** `src/actions/booking.ts`

### `getMonthAvailabilityAction(year: number, month: number)`
Returns `Map<string, 'blocked' | 'available'>` for every day in month.
- Fetches `blockedDates` for the month range
- Marks blocked days, rest as `'available'`

### `getAvailableSlotsAction(dateStr: string)`
Returns `string[]` of available time slots for a given date.
**3-layer filter:**
1. Check `blockedDates` → if day blocked, return `[]`
2. Get `tasks` where `isBlocking=true` for that date → collect their timeSlots
3. Get `bookings` with status IN (`PENDING`, `ACCEPTED`, `CONFIRMED`) for that date → collect their timeSlots
4. Filter `MASTER_TIME_SLOTS` minus blocked slots

### `submitBookingRequestAction(data: { clientName, clientEmail, date, timeSlot, meetingType, clientNote? })`
Returns `{ success, error?, bookingId? }`
**3-layer security check before insert:**
1. Is date in `blockedDates`? → reject
2. Any `tasks` with `isBlocking=true` at that date+timeSlot? → reject
3. Any `bookings` with status IN (`PENDING`, `ACCEPTED`, `CONFIRMED`) at that date+timeSlot? → reject (race condition guard)
4. Insert into `bookings` with status `'PENDING'`

**Zod schema** validates: clientName (min 2), clientEmail (email), date (regex YYYY-MM-DD), timeSlot (non-empty), meetingType (Online|In-Location).

---

## Admin Actions

**File:** `src/actions/admin-bookings.ts`

### `getAdminBookingsAction()`
Returns all bookings ordered by `createdAt DESC`.

### `updateBookingStatusAction(id: string, newStatus: 'ACCEPTED' | 'REJECTED' | 'CONFIRMED')`
**Status guard:** If current status is `CONFIRMED` or `REJECTED`, returns error (locked).
Updates status + `updatedAt`.

### `updateAdminNotesAction(id: string, adminNote: string)`
Updates `adminNote` field on booking.

### `deleteBookingAction(id: string)`
Hard deletes booking record.
