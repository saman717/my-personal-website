import { cache } from 'react';
import { unstable_cache } from 'next/cache';
import { db, dbRetry } from '@/db';
import {
  portfolioProjects,
  portfolioProjectTranslations,
  portfolioProjectContent,
  portfolioProjectImages,
  portfolioProjectTechnologies,
  portfolioTechnologies,
  portfolioProjectLinks,
} from '@/db/schema';
import { count, eq, and, asc, desc, inArray } from 'drizzle-orm';

export const getPublishedProjectsCount = unstable_cache(
  async (): Promise<number> => {
    return dbRetry(async () => {
      const [row] = await db
        .select({ value: count() })
        .from(portfolioProjects)
        .where(eq(portfolioProjects.status, 'published'));
      return row?.value ?? 0;
    });
  },
  ['portfolio-projects-count'],
  { tags: ['portfolio-projects'], revalidate: 3600 },
);

export type ProjectItem = {
  id: string;
  slug: string;
  sortOrder: number | null;
  title: string;
  brief: string | null;
  badge: string | null;
  image: { url: string; alt: string | null } | null;
  techs: { name: string; icon: string | null; slug: string; website: string | null }[];
};

export async function getPublishedProjects(
  locale: string,
  limit?: number,
): Promise<ProjectItem[]> {
  return dbRetry(async () => {
    const baseQuery = db
      .select({ id: portfolioProjects.id, slug: portfolioProjects.slug, sortOrder: portfolioProjects.sortOrder })
      .from(portfolioProjects)
      .where(eq(portfolioProjects.status, 'published'))
      .orderBy(portfolioProjects.sortOrder);

    const [allProjects, allTranslations] = await Promise.all([
      limit ? baseQuery.limit(limit) : baseQuery,
      db
        .select({
          projectId: portfolioProjectTranslations.projectId,
          title: portfolioProjectTranslations.title,
          brief: portfolioProjectTranslations.brief,
          badge: portfolioProjectTranslations.badge,
        })
        .from(portfolioProjectTranslations)
        .where(eq(portfolioProjectTranslations.locale, locale as 'fa' | 'en')),
    ]);

    if (allProjects.length === 0) return [];

    const projectIds = allProjects.map((p) => p.id);

    const [primaryImages, techRows] = await Promise.all([
      db
        .select({ projectId: portfolioProjectImages.projectId, url: portfolioProjectImages.url, alt: portfolioProjectImages.alt })
        .from(portfolioProjectImages)
        .where(inArray(portfolioProjectImages.projectId, projectIds))
        .orderBy(desc(portfolioProjectImages.isPrimary)),
      db
        .select({
          projectId: portfolioProjectTechnologies.projectId,
          name: portfolioTechnologies.name,
          icon: portfolioTechnologies.icon,
          slug: portfolioTechnologies.slug,
          website: portfolioTechnologies.website,
        })
        .from(portfolioProjectTechnologies)
        .innerJoin(portfolioTechnologies, eq(portfolioProjectTechnologies.technologyId, portfolioTechnologies.id))
        .where(inArray(portfolioProjectTechnologies.projectId, projectIds)),
    ]);

    const translationMap = new Map(allTranslations.map((t) => [t.projectId, t]));
    const imageMap = new Map<string, { url: string; alt: string | null }>();
    for (const img of primaryImages) {
      if (!imageMap.has(img.projectId)) imageMap.set(img.projectId, { url: img.url, alt: img.alt });
    }
    const techMap = new Map<string, { name: string; icon: string | null; slug: string; website: string | null }[]>();
    for (const row of techRows) {
      const arr = techMap.get(row.projectId) ?? [];
      arr.push({ name: row.name, icon: row.icon, slug: row.slug, website: row.website });
      techMap.set(row.projectId, arr);
    }

    return allProjects
      .map((p): ProjectItem | null => {
        const tr = translationMap.get(p.id);
        if (!tr) return null;
        return {
          id: p.id,
          slug: p.slug,
          sortOrder: p.sortOrder,
          title: tr.title,
          brief: tr.brief,
          badge: tr.badge ?? null,
          image: imageMap.get(p.id) ?? null,
          techs: (techMap.get(p.id) ?? []).slice(0, 4),
        };
      })
      .filter((item): item is ProjectItem => item !== null);
  });
}

// ─── Detail page query ────────────────────────────────────────────────────────

export type ProjectDetail = {
  project: typeof portfolioProjects.$inferSelect;
  translation: typeof portfolioProjectTranslations.$inferSelect;
  content: typeof portfolioProjectContent.$inferSelect | undefined;
  primaryImage: typeof portfolioProjectImages.$inferSelect | null;
  galleryImages: (typeof portfolioProjectImages.$inferSelect)[];
  techs: { name: string; icon: string | null; slug: string; website: string | null }[];
  links: (typeof portfolioProjectLinks.$inferSelect)[];
};

// cache() deduplicates within a single request: generateMetadata + page both call
// this, but the DB is hit only ONCE per request.
export const getProjectBySlug = cache(
  async (slug: string, locale: string): Promise<ProjectDetail | null> => {
    return dbRetry(async () => {
      const [project] = await db
        .select()
        .from(portfolioProjects)
        .where(eq(portfolioProjects.slug, slug))
        .limit(1);

      if (!project || project.status !== 'published') return null;

      const [[translation], [content], images, techRows, links] = await Promise.all([
        db
          .select()
          .from(portfolioProjectTranslations)
          .where(
            and(
              eq(portfolioProjectTranslations.projectId, project.id),
              eq(portfolioProjectTranslations.locale, locale as 'fa' | 'en'),
            ),
          )
          .limit(1),

        db
          .select()
          .from(portfolioProjectContent)
          .where(
            and(
              eq(portfolioProjectContent.projectId, project.id),
              eq(portfolioProjectContent.locale, locale as 'fa' | 'en'),
            ),
          )
          .limit(1),

        db
          .select()
          .from(portfolioProjectImages)
          .where(eq(portfolioProjectImages.projectId, project.id))
          .orderBy(asc(portfolioProjectImages.sortOrder)),

        db
          .select({
            name: portfolioTechnologies.name,
            icon: portfolioTechnologies.icon,
            slug: portfolioTechnologies.slug,
            website: portfolioTechnologies.website,
          })
          .from(portfolioProjectTechnologies)
          .innerJoin(
            portfolioTechnologies,
            eq(portfolioProjectTechnologies.technologyId, portfolioTechnologies.id),
          )
          .where(eq(portfolioProjectTechnologies.projectId, project.id)),

        db
          .select()
          .from(portfolioProjectLinks)
          .where(eq(portfolioProjectLinks.projectId, project.id))
          .orderBy(asc(portfolioProjectLinks.sortOrder)),
      ]);

      if (!translation) return null;

      const primaryImage = images.find((img) => img.isPrimary === 1) ?? images[0] ?? null;
      const galleryImages = images.filter((img) => img.isPrimary !== 1);

      return { project, translation, content, primaryImage, galleryImages, techs: techRows, links };
    });
  },
);
