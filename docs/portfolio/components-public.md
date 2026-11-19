# Portfolio — Public Components

**Directory:** `src/components/projects/`

## ProjectDetail (`ProjectDetail.tsx`)
Async Server Component. Renders the full detail page UI for a single project.

**Props:**
```ts
{ data: ProjectDetail; locale: string }
```

**Sections rendered:**
- Back link → `/${locale}/portfolio`
- Hero image (primary image, `aspect-video`, with gradient overlay)
- Title, brief, `updatedAt` (formatted with `toLocaleDateString`)
- Article: challenge block, solution steps (ordered list), results items (grid cards), free HTML (`contentHtml` via `dangerouslySetInnerHTML`), gallery
- Sidebar (shown only when `hasSidebar === true`): meta info (role, platform, category, status), tech stack badges, links

**i18n:** All labels come from `getDictionary(locale)` → `dict.portfolio.detail.*`. Per-project title overrides: `translation.challengeTitle ?? t.challenge`, etc.

**RTL:** Single `isRTL = locale === 'fa'` flag; `dir` attribute on root div.

---

## ProjectsSection (`ProjectsSection.tsx`)
Async Server Component. Grid layout of project cards. Used on the home page.

Calls `getPublishedProjects(locale, 3)` and renders up to 3 `ProjectCard` components.

---

## ProjectCard (`ProjectCard.tsx`)
Single project card. Shows primary image (via `next/image`), title, brief, tech tags, and a "view project" button.

**Props:**
```ts
{
  title: string;
  description: string;
  tags: string[];
  image?: { url: string; alt: string | null } | null;
  projectLink?: string;
  viewProjectLabel: string;
}
```

If `image` is provided, renders with `next/image` (`fill`, `object-cover`, hover scale). Falls back to centered title text if no image.

---

## ProjectTag (`ProjectTag.tsx`)
Technology tag badge component used inside `ProjectCard`.

---

## Pages

### List: `src/app/[locale]/(public)/portfolio/page.tsx`
Calls `getPublishedProjects(locale)`. Renders its own inline card grid (not using `ProjectCard`) with full tech tag links and `isValidUrl` guard on images.

**i18n:** Hardcoded bilingual strings inline (not from messages) — candidate for future refactor.

### Detail: `src/app/[locale]/(public)/portfolio/[slug]/page.tsx`
Thin page (48 lines). Calls `getProjectBySlug(slug, locale)` for both `generateMetadata` and the page render (deduplicated by React `cache()`). Delegates all UI to `<ProjectDetail>`.

**Metadata title:** `${translation.title} | ${dict.home.title}` — dynamic via `getDictionary(locale)`, no hardcoded name.
