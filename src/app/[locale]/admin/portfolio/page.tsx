import { db } from '@/db';
import { portfolioProjects, portfolioProjectTranslations } from '@/db/schema';
import { eq } from 'drizzle-orm';
import Link from 'next/link';
import AdminPortfolioActions from '@/components/admin/portfolio/AdminPortfolioActions';
import TechnologiesManagerPanel from '@/components/admin/portfolio/TechnologiesManagerPanel';

// ─── Retry برای Supabase free tier ────────────────────────────────────────────
// وقتی Supabase دیتابیس رو بخوابونه، اولین query با کد 57014 کنسل میشه.
// این helper تا ۳ بار تلاش می‌کنه — بین هر بار کمی صبر می‌کنه تا DB بیدار بشه.
async function dbRetry<T>(fn: () => Promise<T>, attempts = 3): Promise<T> {
  for (let i = 0; i < attempts; i++) {
    try {
      return await fn();
    } catch (err: unknown) {
      const code = (err as any)?.code ?? (err as any)?.cause?.code;
      if (code !== '57014' || i === attempts - 1) throw err;
      await new Promise<void>((r) => setTimeout(r, 800 * (i + 1)));
    }
  }
  throw new Error('unreachable');
}

export default async function AdminPortfolioPage({
  params,
}: {
  params: Promise<{ locale: string }> | { locale: string };
}) {
  const resolvedParams = await params;
  const locale = resolvedParams.locale;

  // ─── هر query جداگانه داخل dbRetry — تا unhandledRejection نداشته باشیم ────
  // اگه Promise.all رو wrap کنیم، query دوم بعد از reject اولی بدون listener میمونه
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

  // ترکیب در حافظه — بدون JOIN در SQL
  const titleMap = new Map(faTranslations.map(t => [t.projectId, t.title]));
  const projects = allProjects.map(p => ({ ...p, title: titleMap.get(p.id) ?? null }));

  const statusColors: Record<string, string> = {
    published: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    draft:     'bg-yellow-500/10  text-yellow-400  border-yellow-500/20',
    archived:  'bg-gray-500/10   text-gray-400    border-gray-500/20',
  };

  const statusLabels: Record<string, string> = {
    published: 'منتشر شده',
    draft:     'پیش‌نویس',
    archived:  'بایگانی',
  };

  return (
    <div className="flex flex-col gap-6" dir="rtl">

      {/* ─── Header ─────────────────────────────────────────────────────── */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">نمونه کارها</h1>
          <p className="text-sm text-gray-500 mt-0.5">{projects.length} پروژه در دیتابیس</p>
        </div>
        <div className="flex items-center gap-2">
          {/* دکمه مدیریت تکنولوژی‌ها */}
          <TechnologiesManagerPanel />
          {/* دکمه پروژه جدید */}
          <Link
            href={`/${locale}/admin/portfolio/new`}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-sm font-medium transition-all duration-200 shadow-[0_0_20px_rgba(147,51,234,0.25)] hover:shadow-[0_0_25px_rgba(147,51,234,0.45)]"
          >
            <span className="text-base leading-none">+</span>
            پروژه جدید
          </Link>
        </div>
      </div>

      {/* ─── Table ──────────────────────────────────────────────────────── */}
      <div className="rounded-2xl border border-white/5 overflow-hidden bg-[#0d0d12]/60 backdrop-blur-xl">
        {projects.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3">
            <span className="text-5xl">🗂️</span>
            <p className="text-gray-500 text-sm">هنوز هیچ پروژه‌ای ثبت نشده</p>
            <Link
              href={`/${locale}/admin/portfolio/new`}
              className="mt-2 text-purple-400 text-sm hover:text-purple-300 underline underline-offset-4"
            >
              اولین پروژه را اضافه کن
            </Link>
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/5 text-gray-500 text-xs uppercase tracking-wider">
                <th className="px-5 py-3.5 text-right font-medium">ردیف</th>
                <th className="px-5 py-3.5 text-right font-medium">عنوان</th>
                <th className="px-5 py-3.5 text-right font-medium">Slug</th>
                <th className="px-5 py-3.5 text-right font-medium">وضعیت</th>
                <th className="px-5 py-3.5 text-right font-medium">آخرین ویرایش</th>
                <th className="px-5 py-3.5 text-right font-medium">عملیات</th>
              </tr>
            </thead>
            <tbody>
              {projects.map((p, idx) => (
                <tr
                  key={p.id}
                  className="border-b border-white/[0.03] hover:bg-white/[0.02] transition-colors"
                >
                  <td className="px-5 py-4 text-gray-600 w-10">{p.sortOrder ?? idx + 1}</td>
                  <td className="px-5 py-4">
                    <span className="text-gray-200 font-medium">{p.title ?? '—'}</span>
                  </td>
                  <td className="px-5 py-4">
                    <code className="text-xs text-purple-400 bg-purple-500/5 px-2 py-0.5 rounded-md border border-purple-500/10">
                      {p.slug}
                    </code>
                  </td>
                  <td className="px-5 py-4">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${statusColors[p.status] ?? statusColors.draft}`}
                    >
                      {statusLabels[p.status] ?? p.status}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-gray-500 text-xs">
                    {p.updatedAt
                      ? new Date(p.updatedAt).toLocaleDateString('fa-IR', {
                          year: 'numeric', month: 'short', day: 'numeric',
                        })
                      : '—'}
                  </td>
                  <td className="px-5 py-4">
                    <AdminPortfolioActions
                      projectId={p.id}
                      projectSlug={p.slug}
                      currentStatus={p.status as 'draft' | 'published' | 'archived'}
                      locale={locale}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
