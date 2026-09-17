'use server';

import { revalidatePath } from 'next/cache';
import { db } from '@/db';
import {
  portfolioProjects,
  portfolioProjectTranslations,
  portfolioProjectContent,
  portfolioProjectTechnologies,
  portfolioProjectLinks,
  portfolioProjectImages,
} from '@/db/schema';
import { eq, and } from 'drizzle-orm';

// ─── Types ────────────────────────────────────────────────────────────────────
export type ProjectFormData = {
  slug: string;
  status: 'draft' | 'published' | 'archived';
  sortOrder: number;
  // ترجمه فارسی
  fa_title: string;
  fa_brief: string;
  fa_badge?: string;
  fa_metaRole?: string;
  fa_metaPlatform?: string;
  fa_metaCategory?: string;
  fa_metaStatus?: string;
  fa_challengeTitle?: string;
  fa_challengeText?: string;
  fa_solutionTitle?: string;
  fa_resultsTitle?: string;
  fa_techStackTitle?: string;
  // ترجمه انگلیسی
  en_title: string;
  en_brief: string;
  en_badge?: string;
  en_metaRole?: string;
  en_metaPlatform?: string;
  en_metaCategory?: string;
  en_metaStatus?: string;
  en_challengeTitle?: string;
  en_challengeText?: string;
  en_solutionTitle?: string;
  en_resultsTitle?: string;
  en_techStackTitle?: string;
  // محتوای HTML
  fa_contentHtml?: string;
  en_contentHtml?: string;
  // لینک‌ها (JSON string)
  links?: string; // JSON: [{type, url, label}]
  // تکنولوژی‌ها (JSON string)
  technologyIds?: string; // JSON: [uuid, ...]
};

export type ProjectImage = {
  id: string;
  url: string;
  alt: string | null;
  isPrimary: number;
  sortOrder: number;
};

// ─── Create project ───────────────────────────────────────────────────────────
export async function createProject(data: ProjectFormData) {
  const [project] = await db
    .insert(portfolioProjects)
    .values({
      slug: data.slug.trim().toLowerCase(),
      status: data.status,
      sortOrder: data.sortOrder,
    })
    .returning();

  await upsertTranslationsAndContent(project.id, data);
  revalidatePath('/[locale]/admin/portfolio', 'page');
  revalidatePath('/[locale]/portfolio', 'page');
  return { success: true, id: project.id };
}

// ─── Update project ───────────────────────────────────────────────────────────
export async function updateProject(id: string, data: ProjectFormData) {
  await db
    .update(portfolioProjects)
    .set({
      slug: data.slug.trim().toLowerCase(),
      status: data.status,
      sortOrder: data.sortOrder,
      updatedAt: new Date(),
    })
    .where(eq(portfolioProjects.id, id));

  await upsertTranslationsAndContent(id, data);
  revalidatePath('/[locale]/admin/portfolio', 'page');
  revalidatePath('/[locale]/portfolio', 'page');
  revalidatePath(`/[locale]/portfolio/${data.slug}`, 'page');
  return { success: true };
}

// ─── Delete project ───────────────────────────────────────────────────────────
export async function deleteProject(id: string) {
  await db.delete(portfolioProjects).where(eq(portfolioProjects.id, id));
  revalidatePath('/[locale]/admin/portfolio', 'page');
  revalidatePath('/[locale]/portfolio', 'page');
  return { success: true };
}

// ─── Toggle status ────────────────────────────────────────────────────────────
export async function toggleProjectStatus(id: string, status: 'draft' | 'published' | 'archived') {
  await db
    .update(portfolioProjects)
    .set({ status, updatedAt: new Date() })
    .where(eq(portfolioProjects.id, id));
  revalidatePath('/[locale]/admin/portfolio', 'page');
  revalidatePath('/[locale]/portfolio', 'page');
  return { success: true };
}

// ─── Images: Add ─────────────────────────────────────────────────────────────
export async function addProjectImage(projectId: string, url: string, alt: string, isPrimary: boolean) {
  // اگر شاخص است، بقیه را غیر شاخص کن
  if (isPrimary) {
    await db
      .update(portfolioProjectImages)
      .set({ isPrimary: 0 })
      .where(eq(portfolioProjectImages.projectId, projectId));
  }

  // ترتیب بعدی
  const existing = await db
    .select({ sortOrder: portfolioProjectImages.sortOrder })
    .from(portfolioProjectImages)
    .where(eq(portfolioProjectImages.projectId, projectId));

  const maxOrder = existing.length > 0
    ? Math.max(...existing.map(e => e.sortOrder ?? 0))
    : -1;

  const [inserted] = await db.insert(portfolioProjectImages).values({
    projectId,
    url: url.trim(),
    alt: alt.trim() || null,
    isPrimary: isPrimary ? 1 : 0,
    sortOrder: maxOrder + 1,
  }).returning();

  revalidatePath('/[locale]/admin/portfolio', 'page');
  revalidatePath('/[locale]/portfolio', 'page');
  // real DB id رو برمی‌گردونیم تا client state درست باشه
  return { success: true, image: { id: inserted.id, url: inserted.url, alt: inserted.alt, isPrimary: inserted.isPrimary, sortOrder: inserted.sortOrder } };
}

// ─── Images: Delete ───────────────────────────────────────────────────────────
export async function deleteProjectImage(imageId: string, projectId: string) {
  await db.delete(portfolioProjectImages).where(eq(portfolioProjectImages.id, imageId));
  revalidatePath('/[locale]/admin/portfolio', 'page');
  revalidatePath('/[locale]/portfolio', 'page');
  return { success: true };
}

// ─── Images: Set Primary ─────────────────────────────────────────────────────
export async function setImageAsPrimary(imageId: string, projectId: string) {
  // همه را غیر شاخص کن
  await db
    .update(portfolioProjectImages)
    .set({ isPrimary: 0 })
    .where(eq(portfolioProjectImages.projectId, projectId));

  // این تصویر را شاخص کن
  await db
    .update(portfolioProjectImages)
    .set({ isPrimary: 1 })
    .where(eq(portfolioProjectImages.id, imageId));

  revalidatePath('/[locale]/admin/portfolio', 'page');
  revalidatePath('/[locale]/portfolio', 'page');
  return { success: true };
}

// ─── Images: Update alt text ─────────────────────────────────────────────────
export async function updateImageAlt(imageId: string, alt: string) {
  await db
    .update(portfolioProjectImages)
    .set({ alt: alt.trim() || null })
    .where(eq(portfolioProjectImages.id, imageId));
  return { success: true };
}

// ─── Internal: upsert translations + content + links + techs ─────────────────
async function upsertTranslationsAndContent(projectId: string, data: ProjectFormData) {
  const locales = ['fa', 'en'] as const;

  for (const locale of locales) {
    const prefix = locale as 'fa' | 'en';

    // ترجمه
    const existing = await db
      .select({ id: portfolioProjectTranslations.id })
      .from(portfolioProjectTranslations)
      .where(
        and(
          eq(portfolioProjectTranslations.projectId, projectId),
          eq(portfolioProjectTranslations.locale, locale)
        )
      )
      .limit(1);

    const translationData = {
      title: (data[`${prefix}_title`] ?? '').trim(),
      brief: (data[`${prefix}_brief`] ?? '').trim(),
      badge: data[`${prefix}_badge`] ?? null,
      metaRole: data[`${prefix}_metaRole`] ?? null,
      metaPlatform: data[`${prefix}_metaPlatform`] ?? null,
      metaCategory: data[`${prefix}_metaCategory`] ?? null,
      metaStatus: data[`${prefix}_metaStatus`] ?? null,
      challengeTitle: data[`${prefix}_challengeTitle`] ?? null,
      challengeText: data[`${prefix}_challengeText`] ?? null,
      solutionTitle: data[`${prefix}_solutionTitle`] ?? null,
      resultsTitle: data[`${prefix}_resultsTitle`] ?? null,
      techStackTitle: data[`${prefix}_techStackTitle`] ?? null,
      updatedAt: new Date(),
    };

    if (existing.length > 0) {
      await db
        .update(portfolioProjectTranslations)
        .set(translationData)
        .where(eq(portfolioProjectTranslations.id, existing[0].id));
    } else {
      await db.insert(portfolioProjectTranslations).values({
        projectId,
        locale,
        ...translationData,
      });
    }

    // HTML content
    const contentHtml = data[`${prefix}_contentHtml`] ?? '';
    const existingContent = await db
      .select({ id: portfolioProjectContent.id })
      .from(portfolioProjectContent)
      .where(
        and(
          eq(portfolioProjectContent.projectId, projectId),
          eq(portfolioProjectContent.locale, locale)
        )
      )
      .limit(1);

    if (existingContent.length > 0) {
      await db
        .update(portfolioProjectContent)
        .set({ contentHtml, updatedAt: new Date() })
        .where(eq(portfolioProjectContent.id, existingContent[0].id));
    } else {
      await db.insert(portfolioProjectContent).values({ projectId, locale, contentHtml });
    }
  }

  // لینک‌ها — حذف و بازنویسی
  if (data.links !== undefined) {
    await db.delete(portfolioProjectLinks).where(eq(portfolioProjectLinks.projectId, projectId));
    const links = JSON.parse(data.links ?? '[]') as { type: string; url: string; label?: string }[];
    if (links.length > 0) {
      await db.insert(portfolioProjectLinks).values(
        links.map((l, i) => ({ projectId, type: l.type, url: l.url, label: l.label ?? null, sortOrder: i }))
      );
    }
  }

  // تکنولوژی‌ها — حذف و بازنویسی
  if (data.technologyIds !== undefined) {
    await db.delete(portfolioProjectTechnologies).where(eq(portfolioProjectTechnologies.projectId, projectId));
    const ids = JSON.parse(data.technologyIds ?? '[]') as string[];
    if (ids.length > 0) {
      await db.insert(portfolioProjectTechnologies).values(
        ids.map((technologyId) => ({ projectId, technologyId }))
      );
    }
  }
}
