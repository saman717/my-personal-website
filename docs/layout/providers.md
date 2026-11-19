# Layout — Providers & Context

## ReactQueryProvider
**File:** `src/providers/ReactQueryProvider.tsx`
Wraps app with TanStack QueryClientProvider. Client-side only (`"use client"`).

## ToastContext
**File:** `src/context/ToastContext.tsx`
Global toast notification system.

### API
```ts
const { showToast, updateToast, dismissToast } = useToast()
```
- `showToast(message, type)` → returns `toastId: number`
- `updateToast(toastId, message, type)` — transforms existing toast (e.g. loading → success)
- `dismissToast(toastId)`

Types: `'success'` | `'error'` | `'loading-white'` | `'loading-orange'`

**Used by:** useBookingManager, useMessageMutations, and throughout admin.

## Query Keys
**File:** `src/lib/react-query/queryKeys.ts`

```ts
export const queryKeys = {
  messages: ['messages'],
  // ... other keys
}
```

## UI Components
**File:** `src/components/Ui/NavigationProgress.tsx` — NProgress-style page transition indicator
**File:** `src/components/Ui/TechBadge.tsx` — Technology badge component
