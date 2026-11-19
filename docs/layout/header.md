# Layout — Header

**Directory:** `src/components/layout/Header/`

## Header (`Header.tsx`)
Main site header. Contains logo, navigation links, LanguageSwitcher, MobileMenu toggle.

## LanguageSwitcher (`LanguageSwitcher.tsx`)
Toggles between `fa` and `en`. Rewrites URL locale segment.

## MobileMenu (`MobileMenu.tsx`)
Hamburger menu for mobile. Animated with Framer Motion.

---

## Admin Header & Navigation

**Directory:** `src/components/admin/`

### Header (`Header.tsx`)
Admin panel top header.

### Sidebar (`Sidebar.tsx`)
Admin sidebar navigation with links to: dashboard, tasks, bookings, messages, portfolio.

### NavLink (`NavLink.tsx`)
Single navigation link in sidebar. Active state detection.

### AdminLayoutClient (`AdminLayoutClient.tsx`)
Client-side layout wrapper for admin. Combines Header + Sidebar + main content area.
