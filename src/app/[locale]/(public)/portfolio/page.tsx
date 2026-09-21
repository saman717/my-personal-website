import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { db } from '@/db';
import {
  portfolioProjects,
  portfolioProjectTranslations,
  portfolioProjectImages,
  portfolioProjectTechnologies,
  portfolioTechnologies,
} from '@/db/schema';
import { eq, inArray } from 'drizzle-orm';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://samankhoshnoud.ir';

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const isPersian = locale === 'fa';

  const title = isPersian
    ? 'نمونه کارها | سامان خوشنود'
    : 'Portfolio | Saman Khoshnood';

  const description = isPersian
    ? 'مجموعه‌ای از پروژه‌های وب، اپلیکیشن‌ها و ابزارهایی که سامان خوشنود طراحی و توسعه داده است'
    : 'A collection of web projects, applications, and tools designed and developed by Saman Khoshnood';

  const canonicalUrl = `${SITE_URL}/${locale}/portfolio`;

  return {
    title,
    description,
    authors: [{ name: 'Saman Khoshnood', url: SITE_URL }],
    creator: 'Saman Khoshnood',
    alternates: {
      canonical: canonicalUrl,
      languages: {
        'fa-IR': `${SITE_URL}/fa/portfolio`,
        'en-US': `${SITE_URL}/en/portfolio`,
        'x-default': `${SITE_URL}/fa/portfolio`,
      },
    },
    openGraph: {
      title,
      description,
      url: canonicalUrl,
      siteName: isPersian ? 'وب‌سایت سامان خوشنود' : 'Saman Khoshnood',
      locale: isPersian ? 'fa_IR' : 'en_US',
      type: 'website',
    },
    robots: { index: true, follow: true },
  };
}

// ─── Types ───────────────────────────────────────────────────────────────────
type ProjectItem = {
  id: string;
  slug: string;
  sortOrder: number | null;
  title: string;
  brief: string | null;
  badge: string | null;
  image: { url: string; alt: string | null } | null;
  techs: { name: string; icon: string | null; slug: string; website: string | null }[];
};

// ─── DB fetch ────────────────────────────────────────────────────────────────
async function getPublishedProjects(locale: string): Promise<ProjectItem[]> {
  // ۱. پروژه‌های منتشر شده + ترجمه‌ها — دو query موازی
  const [allProjects, allTranslations] = await Promise.all([
    db
      .select({ id: portfolioProjects.id, slug: portfolioProjects.slug, sortOrder: portfolioProjects.sortOrder })
      .from(portfolioProjects)
      .where(eq(portfolioProjects.status, 'published'))
      .orderBy(portfolioProjects.sortOrder),
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

  // ۲. تصاویر شاخص + تکنولوژی‌ها — دو query موازی
  const [primaryImages, techRows] = await Promise.all([
    db
      .select({ projectId: portfolioProjectImages.projectId, url: portfolioProjectImages.url, alt: portfolioProjectImages.alt })
      .from(portfolioProjectImages)
      .where(
        inArray(portfolioProjectImages.projectId, projectIds)
      )
      .orderBy(portfolioProjectImages.isPrimary),
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

  // ترکیب در حافظه
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
}

function isValidUrl(str: string) {
  try {
    const u = new URL(str);
    return u.protocol === 'http:' || u.protocol === 'https:';
  } catch { return false; }
}

// ─── Page ────────────────────────────────────────────────────────────────────
export default async function PortfolioPage({ params }: Props) {
  const { locale } = await params;
  const isRTL = locale === 'fa';
  const isPersian = locale === 'fa';

  const dbProjects = await getPublishedProjects(locale);

  const t = {
    badge:      isPersian ? 'نمونه کارها' : 'Portfolio',
    heroTitle:  isPersian ? 'پروژه‌هایی که ساختم' : "Projects I've Built",
    heroSubtitle: isPersian
      ? 'مجموعه‌ای از پروژه‌های واقعی، آزمایشگاهی و متن‌باز که در طول مسیرم توسعه دادم'
      : 'A collection of real-world, experimental, and open-source projects developed along my journey',
    viewProject: isPersian ? 'مشاهده جزئیات' : 'View Project',
    empty:      isPersian ? 'به زودی پروژه‌ها اینجا قرار می‌گیرند' : 'Projects coming soon',
    ctaTitle:   isPersian ? 'می‌خوای با هم یه پروژه بسازیم؟' : 'Want to build something together?',
    ctaDesc:    isPersian
      ? 'اگه ایده‌ای داری که می‌خوای به واقعیت تبدیل بشه، بیا با هم صحبت کنیم.'
      : "If you have an idea you want turned into reality, let's talk.",
    ctaContact:  isPersian ? 'تماس با من' : 'Contact Me',
    ctaServices: isPersian ? 'مشاهده خدمات' : 'View Services',
  };

  return (
    <div
      className="min-h-screen bg-[#0d0d12] text-white overflow-x-hidden"
      dir={isRTL ? 'rtl' : 'ltr'}
    >
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-24 space-y-16">

        {/* ── Badge ─────────────────────────────────────────── */}
        <div className="flex items-center justify-start">
          <span className="inline-flex items-center gap-2 bg-purple-500/10 border border-purple-500/30 text-purple-400 text-xs md:text-sm px-4 py-2 rounded-full shadow-[0_0_15px_rgba(167,139,250,0.1)]">
            <span className="w-2 h-2 rounded-full bg-purple-400 animate-pulse" />
            {t.badge}
          </span>
        </div>

        {/* ── Hero ──────────────────────────────────────────── */}
        <section className="space-y-4">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight leading-tight bg-gradient-to-b from-white to-gray-400 bg-clip-text text-transparent">
            {t.heroTitle}
          </h1>
          <p className="text-sm md:text-base text-gray-400 leading-relaxed max-w-2xl font-medium">
            {t.heroSubtitle}
          </p>
        </section>

        <div className="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

        {/* ── Projects grid ─────────────────────────────────── */}
        {dbProjects.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3 text-gray-600">
            <span className="text-5xl">🗂️</span>
            <p className="text-sm">{t.empty}</p>
          </div>
        ) : (
          <section>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {dbProjects.map((project) => (
                <div
                  key={project.id}
                  className="group relative flex flex-col bg-white/[0.03] border border-white/[0.07] hover:border-purple-500/30 rounded-2xl overflow-hidden transition-all duration-300 hover:bg-white/[0.05]"
                >
                  {/* لینک کل کارت — z-10 روی همه محتوا، tech linkها z-20 */}
                  <Link
                    href={`/${locale}/portfolio/${project.slug}`}
                    className="absolute inset-0 z-10 rounded-2xl"
                    aria-label={project.title}
                  />
                  {/* Top gradient bar */}
                  <div className="h-1 bg-gradient-to-r from-purple-600 via-violet-500 to-indigo-500 opacity-50 group-hover:opacity-90 transition-opacity" />

                  {/* Image thumbnail (if exists) */}
                  {project.image && isValidUrl(project.image.url) && (
                    <div className="relative w-full aspect-video overflow-hidden bg-white/[0.03]">
                      <Image
                        src={project.image.url}
                        alt={project.image.alt ?? project.title}
                        fill
                        unoptimized
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#0d0d12]/70 via-transparent to-transparent" />
                    </div>
                  )}

                  <div className="flex flex-col flex-1 p-5 gap-3">
                    {/* Badge */}
                    {project.badge && (
                      <span className="inline-block self-start text-[10px] font-bold text-purple-400 bg-purple-500/10 border border-purple-500/20 px-2.5 py-0.5 rounded-full">
                        {project.badge}
                      </span>
                    )}

                    {/* Title + brief */}
                    <div className="space-y-1.5 flex-1">
                      <h2 className="text-base font-bold text-white leading-snug group-hover:text-purple-200 transition-colors">
                        {project.title}
                      </h2>
                      <p className="text-sm text-gray-400 leading-relaxed line-clamp-2">{project.brief}</p>
                    </div>

                    {/* Tech tags */}
                    {project.techs.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mt-auto pt-1">
                        {project.techs.map((tech) =>
                          tech.website ? (
                            <a
                              key={tech.slug}
                              href={tech.website}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="relative z-20 inline-flex items-center gap-1 text-[10px] font-semibold text-gray-400 hover:text-purple-300 bg-white/5 hover:bg-purple-500/10 border border-white/[0.08] hover:border-purple-500/20 px-2 py-0.5 rounded-md transition-colors"
                            >
                              {tech.icon && <span className="text-xs">{tech.icon}</span>}
                              {tech.name}
                            </a>
                          ) : (
                            <span
                              key={tech.slug}
                              className="inline-flex items-center gap-1 text-[10px] font-semibold text-gray-400 bg-white/5 border border-white/[0.08] px-2 py-0.5 rounded-md"
                            >
                              {tech.icon && <span className="text-xs">{tech.icon}</span>}
                              {tech.name}
                            </span>
                          )
                        )}
                      </div>
                    )}

                    {/* View arrow */}
                    <div className="flex items-center gap-1 text-xs font-semibold text-gray-500 group-hover:text-purple-400 transition-colors mt-1">
                      <span>{t.viewProject}</span>
                      <svg className="w-3 h-3 transition-transform group-hover:translate-x-0.5 rtl:rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        <div className="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

        {/* ── CTA ───────────────────────────────────────────── */}
        <section className="relative rounded-3xl overflow-hidden border border-white/[0.07] bg-gradient-to-br from-purple-900/20 via-[#0d0d12] to-indigo-900/20 p-8 sm:p-12 text-center">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(168,85,247,0.08)_0%,_transparent_70%)] pointer-events-none" />
          <div className="relative space-y-4">
            <h2 className="text-xl sm:text-2xl font-bold text-white">{t.ctaTitle}</h2>
            <p className="text-sm text-gray-400 max-w-md mx-auto leading-relaxed">{t.ctaDesc}</p>
            <div className="flex items-center justify-center gap-3 pt-2 flex-wrap">
              <Link
                href={`/${locale}#contact`}
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-sm font-semibold transition-all hover:scale-[1.03] active:scale-[0.97] shadow-lg shadow-purple-900/30"
              >
                {t.ctaContact}
              </Link>
              <Link
                href={`/${locale}/services`}
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 border border-white/10 text-white text-sm font-semibold transition-all hover:scale-[1.03] active:scale-[0.97]"
              >
                {t.ctaServices}
              </Link>
            </div>
          </div>
        </section>

      </div>
    </div>
  );
}