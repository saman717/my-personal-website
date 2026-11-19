# Booking — Hooks

## useBookingManager

**File:** `src/hooks/useBookingManager.ts`
**Used by:** `AdminBookingsPageContent`

### Signature
```ts
function useBookingManager(locale: string, labels: any)
```

### State
- `requests: BookingRequest[]` — all bookings
- `loading: boolean`
- `panelType: 'RULES' | 'DETAILS' | null`
- `selectedRequest: BookingRequest | null`
- `activeFilter: FilterType` — `'ALL'` | `'PENDING'` | `'ACCEPTED'` | `'REJECTED'` | `'CONFIRMED'`

### Methods
- `fetchBookings()` — calls `getAdminBookingsAction`, formats data with relative time
- `handleUpdateStatus(id, newStatus)` — guards against CONFIRMED/REJECTED, calls `updateBookingStatusAction`
- `handleDeleteBooking(id)` — `window.confirm` then `deleteBookingAction`
- `handleOpenDetails(req)` — opens side panel with selected booking

### Dependencies
- `useToast()` — loading/success/error toasts
- Server actions: `getAdminBookingsAction`, `updateBookingStatusAction`, `deleteBookingAction`
