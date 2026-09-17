import { db } from '@/db';
import {
  portfolioProjects,
  portfolioProjectTranslations,
  portfolioProjectContent,
  portfolioProjectLinks,
  portfolioProjectTechnologies,
  portfolioProjectImages,
} from '@/db/schema';
import { eq } from 'drizzle-orm';
import { notFound } from 'next/navigation';
import ProjectForm from '@/components/admin/portfolio/ProjectForm';
import ProjectImagesManager from '@/components/admin/portfolio/ProjectImagesManager';
import type { ProjectFormData, ProjectImage } from '@/actions/admin-portfolio';

export default async function EditPortfolioProjectPage({
  params,
}: {
  params: Promise<{ locale: string; id: string }> | { locale: string; id: string };
}) {
  const resolvedParams = await params;
  const { locale, id } = resolvedParams;

  // فچ پروژه
  const [project] = await db
    .select()
    .from(portfolioProjects)
    .where(eq(portfolioProjects.id, id))
    .limit(1);

  if (!project) notFound();

  // فچ ترجمه‌ها
  const translations = await db
    .select()
    .from(portfolioProjectTranslations)
    .where(eq(portfolioProjectTranslations.projectId, id));

  const fa = translations.find(t => t.locale === 'fa');
  const en = translations.find(t => t.locale === 'en');

  // فچ HTML content
  const contents = await db
    .select()
    .from(portfolioProjectContent)
    .where(eq(portfolioProjectContent.projectId, id));

  const faContent = contents.find(c => c.locale === 'fa');
  const enContent = contents.find(c => c.locale === 'en');

  // فچ لینک‌ها
  const links = await db
    .select()
    .from(portfolioProjectLinks)
    .where(eq(portfolioProjectLinks.projectId, id));

  // فچ تکنولوژی‌ها
  const techs = await db
    .select()
    .from(portfolioProjectTechnologies)
    .where(eq(portfolioProjectTechnologies.projectId, id));

  // فچ تصاویر
  const images = await db
    .select()
    .from(portfolioProjectImages)
    .where(eq(portfolioProjectImages.projectId, id))
    .orderBy(portfolioProjectImages.sortOrder);

  const initialData: Partial<ProjectFormData> & { id: string } = {
    id,
    slug: project.slug,
    status: project.status as ProjectFormData['status'],
    sortOrder: project.sortOrder ?? 0,
    fa_title: fa?.title ?? '',
    fa_brief: fa?.brief ?? '',
    fa_badge: fa?.badge ?? '',
    fa_metaRole: fa?.metaRole ?? '',
    fa_metaPlatform: fa?.metaPlatform ?? '',
    fa_metaCategory: fa?.metaCategory ?? '',
    fa_metaStatus: fa?.metaStatus ?? '',
    fa_challengeTitle: fa?.challengeTitle ?? '',
    fa_challengeText: fa?.challengeText ?? '',
    fa_solutionTitle: fa?.solutionTitle ?? '',
    fa_resultsTitle: fa?.resultsTitle ?? '',
    fa_techStackTitle: fa?.techStackTitle ?? '',
    en_title: en?.title ?? '',
    en_brief: en?.brief ?? '',
    en_badge: en?.badge ?? '',
    en_metaRole: en?.metaRole ?? '',
    en_metaPlatform: en?.metaPlatform ?? '',
    en_metaCategory: en?.metaCategory ?? '',
    en_metaStatus: en?.metaStatus ?? '',
    en_challengeTitle: en?.challengeTitle ?? '',
    en_challengeText: en?.challengeText ?? '',
    en_solutionTitle: en?.solutionTitle ?? '',
    en_resultsTitle: en?.resultsTitle ?? '',
    en_techStackTitle: en?.techStackTitle ?? '',
    fa_contentHtml: faContent?.contentHtml ?? '',
    en_contentHtml: enContent?.contentHtml ?? '',
    links: JSON.stringify(links.map(l => ({ type: l.type, url: l.url, label: l.label }))),
    technologyIds: JSON.stringify(techs.map(t => t.technologyId)),
  };

  const initialImages: ProjectImage[] = images.map(img => ({
    id: img.id,
    url: img.url,
    alt: img.alt ?? null,
    isPrimary: img.isPrimary ?? 0,
    sortOrder: img.sortOrder ?? 0,
  }));

  return (
    <div className="flex flex-col gap-6" dir="rtl">
      <div>
        <h1 className="text-2xl font-bold text-white">ویرایش پروژه</h1>
        <p className="text-sm text-gray-500 mt-0.5">{fa?.title ?? project.slug}</p>
      </div>

      {/* فرم اصلی محتوا */}
      <ProjectForm locale={locale} mode="edit" initialData={initialData} />

      {/* مدیریت تصاویر — جداگانه زیر فرم */}
      <div className="rounded-2xl border border-white/5 bg-[#0d0d12]/60 backdrop-blur-xl p-5 flex flex-col gap-4">
        <h2 className="text-sm font-semibold text-gray-300 border-b border-white/5 pb-3 flex items-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-gray-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/>
          </svg>
          تصاویر پروژه
          <span className="text-xs text-gray-600 font-normal">({initialImages.length} تصویر)</span>
        </h2>
        <ProjectImagesManager projectId={id} initialImages={initialImages} />
      </div>
    </div>
  );
}
