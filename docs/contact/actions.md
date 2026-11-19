# Contact — Server Actions

## Public Action

**File:** `src/actions/contact.ts`

### `sendContactMessage(formData: FormData)`
Returns `{ success, error? }`

**Zod schema:**
- name: string, min 2, max 100
- email: email
- phone: string, optional
- message: string, min 10, max 2000

**Flow:**
1. Parse and validate FormData with Zod
2. Insert into `contactMessages` (name, email, phone, message, locale from form or default 'fa')
3. Fire-and-forget: `notifyAdminViaTelegram(name, email, message)` — **no await**
4. Return success

### `notifyAdminViaTelegram(name, email, message)` (internal)
Sends formatted message via Telegram Bot API.
**Env:** `TELEGRAM_BOT_TOKEN`, `TELEGRAM_CHAT_ID`

---

## Admin Actions

**File:** `src/actions/messages.ts`

All wrapped in `dbRetry()`.

### `getContactMessages()`
Returns all messages ordered by `createdAt DESC`.

### `toggleMessageReadStatus(id: string, currentStatus: boolean)`
Toggles `isRead` to `!currentStatus`.

### `deleteMessageFromDb(id: string)`
Hard deletes message.

### `getRecentMessages(limit: number = 5)`
Returns recent messages (for dashboard widget).

### `getMessagesStats()`
Returns `{ total, unread, today, thisWeek }` counts.
- today: messages where `createdAt >= startOfToday`
- thisWeek: messages where `createdAt >= startOfWeek (Saturday)`
