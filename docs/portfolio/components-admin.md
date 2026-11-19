# Portfolio — Admin Components

**Directory:** `src/components/admin/portfolio/`

All components are `'use client'` and use `useTransition` for Server Action calls.

---

## PortfolioList (`PortfolioList.tsx`)

Admin table of all projects. **Fully optimistic** — no `router.refresh` on any mutation.

**Props:**
```ts
{ initialProjects: ProjectRow[]; locale: string }
```

**`ProjectRow` type:**
```ts
{ id: string; slug: string; status: string; sortOrder: number | null;
  updatedAtFormatted: string | null; title: string | null }
```

**State pattern:** Holds `projects` in local `useState`. Passes two callbacks to each `AdminPortfolioActions`:
- `onDeleted()` → filters the row out of local state
- `onStatusChanged(status)` → updates the row status in local state

Renders status badges (published / draft / archived) with color coding.

---

## AdminPortfolioActions (`AdminPortfolioActions.tsx`)

Row-level action buttons for each project. **Optimistic via parent callbacks**, not `router.refresh`.

**Props:**
```ts
{
  projectId: string;
  projectSlug: string;
  currentStatus: 'draft' | 'published' | 'archived';
  locale: string;
  onDeleted?: () => void;
  onStatusChanged?: (status: 'draft' | 'published' | 'archived') => void;
}
```

**Actions:**
- **View on site** — opens `/${locale}/portfolio/${projectSlug}` in new tab
- **Edit** — links to `/${locale}/admin/portfolio/${projectId}/edit`
- **Toggle status** — `published ↔ draft`; calls `toggleProjectStatus` then `onStatusChanged`
- **Delete** — inline confirm UI (`مطمئنی؟ / بله / خیر`); calls `deleteProject` then `onDeleted`

---

## ProjectForm (`ProjectForm.tsx`)

Client-side form for create/edit. 4 tabs: `fa | en | html | meta`.

**Props:**
```ts
{
  locale: string;
  initialData?: Partial<ProjectFormData> & { id?: string };
  mode: 'create' | 'edit';
  availableTechnologies?: TechOption[];
}
```

**Tab contents:**

| Tab | Fields |
|-----|--------|
| `fa` (فارسی) | title, brief, badge, challengeTitle, challengeText, solutionTitle, solutionSteps (JSON array), resultsTitle, resultsItems (JSON array), techStackTitle |
| `en` (English) | Same fields in English |
| `html` (محتوای HTML) | contentHtml per locale (fa/en) |
| `meta` (متا / لینک‌ها) | slug, status, sortOrder, metaRole, metaPlatform, metaCategory, metaStatus, links (JSON array `[{type, url, label}]`) |

**JSON fields** (`solutionSteps`, `resultsItems`, `links`) are raw textarea inputs with inline `validateJson()` guard — must be valid JSON arrays.

**Technology selector:** Inline tech picker from `availableTechnologies`. Can inline-create new tech via `createTechnology` action.

**On submit:** calls `createProject` or `updateProject` from `@/actions/admin-portfolio`, then `router.push` to list.

---

## ProjectImagesManager (`ProjectImagesManager.tsx`)

Image manager embedded in the edit page (not in `ProjectForm`).

**Props:**
```ts
{ projectId: string; initialImages: ProjectImage[] }
```

**Key behaviors:**
- **URL-based only** — no file upload; images are added by pasting a URL
- **URL validation:** `isValidUrl()` enforces `http://` or `https://`; rejects emoji/text strings
- **Primary image:** toggle sets one image as primary (`isPrimary = 1`), all others reset to 0
- **Alt editing:** inline per-image alt text editor
- **Optimistic state:** adds/removes images from local `useState` immediately using the real DB id from the action response (never `Date.now()`)
- Uses `router.refresh()` only for page-level cache revalidation after mutations

---

## TechnologiesManagerPanel (`TechnologiesManagerPanel.tsx`)

Slide-in panel (overlay) for global technology CRUD. Mounted on the admin portfolio list page.

**State:** Loads technologies on open via `getTechnologies()` action. All mutations re-fetch the full list after each operation.

**Operations:** Create, edit (name/slug/icon/website), delete (with `confirm()` dialog — warns the tech will be removed from all projects).

**Tech fields:** `name`, `slug`, `icon` (emoji or string), `website` (optional URL).

---

## Pages

| Page | File |
|------|------|
| List | `src/app/[locale]/admin/portfolio/page.tsx` |
| New | `src/app/[locale]/admin/portfolio/new/page.tsx` |
| Edit | `src/app/[locale]/admin/portfolio/[id]/edit/page.tsx` |
