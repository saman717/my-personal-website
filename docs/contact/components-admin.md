# Contact — Admin Components

**Directory:** `src/components/admin/messages/`

## MessagesManager (`MessagesManager.tsx`)
Top-level component. Uses `useMessages` + `useMessageMutations` hooks. Contains filters, list, pagination, detail modal.

## MessageFilters (`MessageFilters.tsx`)
Search input + filter tabs (all / unread / read).

## MessageItem (`MessageItem.tsx`)
Single message row. Shows name, email, subject, preview, read status badge, relative time. Click → open detail modal.

## MessageDetailModal (`MessageDetailModal.tsx`)
Full message view. Shows all fields. Actions: toggle read/unread, delete.

## MessagePagination (`MessagePagination.tsx`)
Page controls. 4 items per page.

## Page
**File:** `src/app/[locale]/admin/messages/page.tsx`

---

## Hooks Used

### useMessages (`src/hooks/useMessages.ts`)
TanStack Query based. `queryKey: queryKeys.messages`.
- State: search, filter, currentPage, selectedMessage, isModalOpen
- Computed: filteredMessages (search + filter), paginatedMessages (4/page), totalPages
- Data: `getContactMessages()` via useQuery

### useMessageMutations (`src/hooks/useMessageMutations.ts`)
TanStack useMutation with optimistic updates.
- `toggleReadMutation` — optimistic toggle `isRead`, calls `toggleMessageReadStatus`
- `deleteMutation` — optimistic remove from list, calls `deleteMessageFromDb`
- Both use `useToast` for loading → success/error toast transitions
