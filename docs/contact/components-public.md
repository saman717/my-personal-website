# Contact — Public Components

## Form Components
**Directory:** `src/components/forms/`

### ContactForm (`ContactForm.tsx`)
React Hook Form + Zod. Fields: fullName, phone, email, message. Calls `sendContactMessage`.

### ContactInfo (`ContactInfo.tsx`)
Props: `ContactInfoProps { email, phone, socialCount? }`. Displays contact details.

### ContactSection (`ContactSection.tsx`)
Wrapper combining ContactForm + ContactInfo side by side.

## Page Components
**Directory:** `src/components/contact/`

### ContactHero (`ContactHero.tsx`)
Hero banner for contact page.

### ContactMethods (`ContactMethods.tsx`)
Contact method cards (email, phone, etc).

### ContactCardAnimated (`ContactCardAnimated.tsx`)
Animated contact card with Framer Motion.

### BookingCTA (`BookingCTA.tsx`)
Call-to-action linking to booking page.

## Page
**File:** `src/app/[locale]/(public)/contact/page.tsx`
