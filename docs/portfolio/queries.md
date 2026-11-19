# Portfolio — Public Queries

**File:** `src/lib/queries/projects.ts`

## Types

```ts
type ProjectItem = {
  id: string; slug: string; sortOrder: number | null;
  title: string; brief: string | null; badge: string | null;
  image: { url: string; alt: string | null } | null;
  techs: { name: string; icon: string | null; slug: string; website: string | null }[];
}

type ProjectDetail = {
  project: typeof portfolioProjects.$inferSelect;
  translation: typeof portfolioProjectTranslations.$inferSelect;
  content: typeof portfolioProjectContent.$inferSelect | undefined;
  primaryImage: typeof portfolioProjectImages.$inferSelect | null;
  galleryImages: (typeof portfolioProjectImages.$inferSelect)[];
  techs: { name: string; icon: string | null; slug: string; website: string | null }[];
  links: (typeof portfolioProjectLinks.$inferSelect)[];
}
```

## Functions

### `getPublishedProjectsCount(): Promise<number>`
Wrapped in `unstable_cache` (tag: `portfolio-projects`, revalidate: 3600s). Returns count of published projects.

### `getPublishedProjects(locale: string, limit?: number): Promise<ProjectItem[]>`
Wrapped in `dbRetry()`. Returns published projects for public display.

**Query strategy (optimized):**
1. Parallel fetch: published projects + all translations for locale
2. If no projects → return `[]`
3. Parallel fetch: primary images (ordered `desc` by `isPrimary` so primary image is always first) + tech rows (via junction JOIN)
4. Build Maps for O(1) lookup: translationMap, imageMap, techMap
5. Merge and return (techs limited to 4 per project)

> **Note:** Image ordering must be `desc(isPrimary)` — ascending order causes non-primary images to appear first in the map, hiding the actual primary image.

### `getProjectBySlug(slug: string, locale: string): Promise<ProjectDetail | null>`
Wrapped in React `cache()` for per-request deduplication — both `generateMetadata` and the page component call this, but the DB is hit only once per request.

**Query strategy (2 rounds):**
1. Round 1: fetch project by slug, check `status === 'published'`
2. Round 2: `Promise.all` of 5 parallel queries — translation, content, images, techs (JOIN), links
3. Derives `primaryImage` via `images.find(img => img.isPrimary === 1) ?? images[0]`
4. Derives `galleryImages` as all non-primary images
