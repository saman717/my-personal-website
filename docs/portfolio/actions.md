# Portfolio — Admin Actions

**File:** `src/actions/admin-portfolio.ts` (14,088 bytes)

## Project CRUD

### `createProject(data: FormData)`
Creates project + calls `upsertTranslationsAndContent`. Returns `{ success, projectId }`.
FormData fields: slug, status, sortOrder, fa/en translations, images, technologies, links.

### `updateProject(projectId: string, data: FormData)`
Updates project record + calls `upsertTranslationsAndContent`. Same FormData structure.

### `deleteProject(projectId: string)`
Hard deletes project. All related records cascade.

### `toggleProjectStatus(projectId: string, newStatus: 'draft' | 'published' | 'archived')`
Updates `status` and sets `publishedAt` if publishing.

## Image Management

### `addProjectImage(projectId: string, url: string, alt?: string)`
Inserts image with auto-incremented `sortOrder`. If first image, sets `isPrimary = 1`.

### `deleteProjectImage(imageId: string)`
Deletes image. If deleted image was primary, promotes next image to primary.

### `setImageAsPrimary(imageId: string, projectId: string)`
Sets all project images to `isPrimary = 0`, then target to `isPrimary = 1`.

### `updateImageAlt(imageId: string, alt: string)`
Updates alt text.

## Technology Management

### `getTechnologies()`
Returns all from `portfolioTechnologies`.

### `createTechnology(data: { name, slug, icon?, website? })`
Inserts into `portfolioTechnologies`.

### `updateTechnology(id: string, data: { name, slug, icon?, website? })`
Updates technology record.

### `deleteTechnology(id: string)`
**First** deletes all junction records in `portfolioProjectTechnologies` for this tech, **then** deletes the technology itself.

## Internal

### `upsertTranslationsAndContent(projectId, data)` (not exported)
For each locale (fa, en):
1. Upsert `portfolioProjectTranslations` — checks if exists, inserts or updates
2. Upsert `portfolioProjectContent` — same pattern
3. Delete existing junction records in `portfolioProjectTechnologies`
4. Insert new junction records
5. Delete existing `portfolioProjectLinks`
6. Insert new links
