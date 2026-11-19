# Booking — Overview

## Flow
1. Client picks date → `getMonthAvailabilityAction(year, month)` returns blocked/available days
2. Client picks time → `getAvailableSlotsAction(date)` applies 3-layer filter
3. Client submits → `submitBookingRequestAction()` applies 3-layer security check
4. Admin manages in `/admin/bookings` → accept/reject/confirm/delete

## Status Transitions
```
PENDING → ACCEPTED → CONFIRMED
PENDING → REJECTED
```
Once CONFIRMED or REJECTED, status is locked (no further changes).

## 3-Layer Security (slot availability)
1. **blockedDates** — is the entire day blocked?
2. **tasks.isBlocking** — does admin have a blocking task at that time?
3. **bookings (PENDING/ACCEPTED/CONFIRMED)** — is the slot already taken?

## Tables Used
- `bookings` — main booking records
- `blockedDates` — manually blocked days
- `tasks` — checked for `isBlocking` tasks
- `adminTasks` — checked in admin-calendar actions (legacy)

## File Map
| File | Type |
|------|------|
| `src/actions/booking.ts` | Public server actions |
| `src/actions/admin-bookings.ts` | Admin server actions |
| `src/lib/reservation-check.ts` | CONFIRMED conflict checker |
| `src/lib/calendar.config.ts` | Master time slot generator |
| `src/hooks/useBookingManager.ts` | Admin hook |
| `src/components/booking/*` | Public components |
| `src/components/admin/booking/*` | Admin components |
| `src/app/[locale]/(public)/booking/page.tsx` | Public page |
| `src/app/[locale]/admin/bookings/page.tsx` | Admin page |
