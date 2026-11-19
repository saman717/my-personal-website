# Booking — Public Components

**Directory:** `src/components/booking/`

## BookingPageClient
**File:** `BookingPageClient.tsx`
Top-level client wrapper. Orchestrates calendar + time selection + form.

## BookingCalendar
**File:** `BookingCalendar.tsx`
Date picker using `react-day-picker`. Calls `getMonthAvailabilityAction` to load blocked/available days per month. Disabled dates shown differently.

## BookingTimeSlots
**File:** `BookingTimeSlots.tsx`
Shows available time slots for selected date. Calls `getAvailableSlotsAction(date)`. Renders slots from `MASTER_TIME_SLOTS` with availability status.

## BookingForm
**File:** `BookingForm.tsx`
Submission form with fields: clientName, clientEmail, meetingType (Online/In-Location), clientNote.
Uses React Hook Form + Zod validation. Calls `submitBookingRequestAction` on submit.

## Page
**File:** `src/app/[locale]/(public)/booking/page.tsx`
Server component, renders `<BookingPageClient>`.
