# Booking — Admin Components

**Directory:** `src/components/admin/booking/`

## AdminBookingsPageContent
**File:** `AdminBookingsPageContent.tsx`
Main layout. Uses `useBookingManager` hook. Contains filter tabs, table, side panel.

## BookingTable
**File:** `BookingTable.tsx`
Table displaying all booking requests with columns: client, date, time, type, status, actions.
Exports `BookingRequest` type:
```ts
interface BookingRequest {
  id: string; clientName: string; clientEmail: string;
  date: string; timeSlot: string; meetingType: string;
  status: string; clientNote: string; adminNote: string;
  createdAt: string; day: string; createdLabel: string;
}
```

## SidePanel
**File:** `SidePanel.tsx`
Slide-out panel for viewing booking details or booking rules.

## ProjectDetails
**File:** `ProjectDetails.tsx`
Detail view within side panel. Shows full booking info + admin notes.

## BookingRules
**File:** `BookingRules.tsx`
Displays booking rules/policy in side panel.

## Page
**File:** `src/app/[locale]/admin/bookings/page.tsx`
Renders `<AdminBookingsPageContent>`.
