import { db, dbRetry } from '@/db';
import { portfolioProjects, portfolioProjectTranslations } from '@/db/schema';
import { eq } from 'drizzle-orm';
import Link from 'next/link';
import TechnologiesManagerPanel from '@/components/admin/portfolio/TechnologiesManagerPanel';
import PortfolioList from '@/components/admin/portfolio/PortfolioList';
import type { ProjectRow } from '@/components/admin/portfolio/PortfolioList';

// همیشه server-side render شود — هیچ‌وقت در build prerender نشود
export const dynamic = 'force-dynamic';

export default async function AdminPortfolioPage({
  params,
}: {
  params: Promise<{ locale: string }> | { locale: string };
}) {
  const resolvedParams = await params;
  const locale = resolvedParams.locale;

  const tQuery = Date.now();

  const [allProjects, faTranslations] = await Promise.all([
    dbRetry(() =>
      db
        .select({
          id: portfolioProjects.id,
          slug: portfolioProjects.slug,
          status: portfolioProjects.status,
          sortOrder: portfolioProjects.sortOrder,
          updatedAt: portfolioProjects.updatedAt,
        })
        .from(portfolioProjects)
        .orderBy(portfolioProjects.sortOrder)
    ),
    dbRetry(() =>
      db
        .select({
          projectId: portfolioProjectTranslations.projectId,
          title: portfolioProjectTranslations.title,
        })
        .from(portfolioProjectTranslations)
        .where(eq(portfolioProjectTranslations.locale, 'fa'))
    ),
  ]);

  // در production هم لاگ شود تا در Vercel Logs قابل بررسی باشد
  console.log(
    `[portfolio] DB ${Date.now() - tQuery}ms | projects=${allProjects.length} | translations=${faTranslations.length}`
  );

  const titleMap = new Map(faTranslations.map(t => [t.projectId, t.title]));

  const projects: ProjectRow[] = allProjects.map(p => ({
    id: p.id,
    slug: p.slug,
    status: p.status,
    sortOrder: p.sortOrder,
    title: titleMap.get(p.id) ?? null,
    updatedAtFormatted: p.updatedAt
      ? new Date(p.updatedAt).toLocaleDateString('fa-IR', {
          year: 'numeric',
          month: 'short',
          day: 'numeric',
        })
      : null,
  }));

  return (
    <div className="flex flex-col gap-6" dir="rtl">

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">نمونه کارها</h1>
          <p className="text-sm text-gray-500 mt-0.5">{projects.length} پروژه در دیتابیس</p>
        </div>
        <div className="flex items-center gap-2">
          <TechnologiesManagerPanel />
          <Link
            href={`/${locale}/admin/portfolio/new`}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-sm font-medium transition-all duration-200 shadow-[0_0_20px_rgba(147,51,234,0.25)] hover:shadow-[0_0_25px_rgba(147,51,234,0.45)]"
          >
            <span className="text-base leading-none">+</span>
            پروژه جدید
          </Link>
        </div>
      </div>

      <div className="rounded-2xl border border-white/5 overflow-hidden bg-[#0d0d12]/60 backdrop-blur-xl">
        <PortfolioList initialProjects={projects} locale={locale} />
      </div>

    </div>
  );
}
