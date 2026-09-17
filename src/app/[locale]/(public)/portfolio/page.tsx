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
import { eq, and, asc } from 'drizzle-orm';

export const revalidate = 4600;
export const dynamicParams = true;

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://samankhoshnoud.ir';

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const isPersian = locale === 'fa';

  const title = isPersian ? 'نمونه کارها | سامان خوشنود' : 'Portfolio | Saman Khoshnood';
  const description = isPersian
    ? 'مجموعه‌ای از پروژه‌های وب، اپلیکیشن‌ها و ابزارهایی که طراحی و توسعه داده‌ام'
    : 'A collection of web projects, applications and tools I have designed and developed';
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
      title, description, url: canonicalUrl,
      siteName: isPersian ? 'وب‌سایت سامان خوشنود' : 'Saman Khoshnood',
      locale: isPersian ? 'fa_IR' : 'en_US',
      type: 'website',
    },
    robots: { index: true, follow: true },
  };
}

// ─── Helpers ─────────────────────────────────────────────────────────────────
function isValidUrl(str: string): boolean {
  try {
    const url = new URL(str);
    return url.protocol === 'http:' || url.protocol === 'https:';
  } catch {
    return false;
  }
}

// ─── Data fetching ────────────────────────────────────────────────────────────
async function getPortfolioProjects(locale: string) {
  // پروژه‌های published، مرتب‌شده
  const published = await db
    .select({ id: portfolioProjects.id, slug: portfolioProjects.slug })
    .from(portfolioProjects)
    .where(eq(portfolioProjects.status, 'published'))
    .orderBy(asc(portfolioProjects.sortOrder));

  if (published.length === 0) return [];

  const projectIds = published.map((p) => p.id);

  // ترجمه‌ها
  const translations = await db
    .select()
    .from(portfolioProjectTranslations)
    .where(eq(portfolioProjectTranslations.locale, locale));

  // تصویر اصلی هر پروژه (is_primary در Supabase integer است: 1 = primary)
  const images = await db
    .select()
    .from(portfolioProjectImages)
    .where(eq(portfolioProjectImages.isPrimary, 1));

  // تکنولوژی‌ها
  const techLinks = await db
    .select({
      projectId: portfolioProjectTechnologies.projectId,
      name: portfolioTechnologies.name,
      icon: portfolioTechnologies.icon,
    })
    .from(portfolioProjectTechnologies)
    .innerJoin(
      portfolioTechnologies,
      eq(portfolioProjectTechnologies.technologyId, portfolioTechnologies.id)
    );

  // ترکیب داده‌ها
  return published.map((project) => {
    const translation = translations.find((t) => t.projectId === project.id);
    const image = images.find((img) => img.projectId === project.id);
    const techs = techLinks.filter((t) => t.projectId === project.id);
    return { ...project, translation, image, techs };
  }).filter((p) => p.translation); // فقط پروژه‌هایی که ترجمه دارن
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default async function PortfolioPage({ params }: Props) {
  const { locale } = await params;
  const isRTL = locale === 'fa';
  const isPersian = locale === 'fa';

  const projects = await getPortfolioProjects(locale);

  const t = {
    badge:       isPersian ? 'نمونه کارها' : 'Portfolio',
    heroTitle:   isPersian ? 'پروژه‌هایی که ساختم' : "Projects I've Built",
    heroSub:     isPersian
      ? 'مجموعه‌ای از پروژه‌های واقعی که در طول مسیرم توسعه دادم'
      : 'A collection of real-world projects developed along my journey',
    empty:       isPersian ? 'هنوز پروژه‌ای منتشر نشده' : 'No projects published yet',
    viewProject: isPersian ? 'مشاهده پروژه' : 'View Project',
    ctaTitle:    isPersian ? 'می‌خوای با هم یه پروژه بسازیم؟' : 'Want to build something together?',
    ctaDesc:     isPersian
      ? 'اگه ایده‌ای داری که می‌خوای به واقعیت تبدیل بشه، بیا با هم صحبت کنیم.'
      : "If you have an idea you want turned into reality, let's talk.",
    ctaContact:  isPersian ? 'تماس با من' : 'Contact Me',
    ctaServices: isPersian ? 'مشاهده خدمات' : 'View Services',
  };

  return (
    <div className="min-h-screen bg-[#0d0d12] text-white overflow-x-hidden" dir={isRTL ? 'rtl' : 'ltr'}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-24 space-y-16">

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
          <p className="text-sm md:text-base text-gray-400 leading-relaxed max-w-2xl">{t.heroSub}</p>
        </section>

        <div className="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

        {/* ── Projects Grid ─────────────────────────────────── */}
        {projects.length === 0 ? (
          <div className="text-center py-20 text-gray-500">{t.empty}</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project) => (
              <Link
                key={project.id}
                href={`/${locale}/portfolio/${project.slug}`}
                className="group relative flex flex-col bg-white/[0.03] border border-white/[0.07] rounded-2xl overflow-hidden hover:border-purple-500/30 hover:bg-white/[0.05] transition-all duration-300"
              >
                {/* ── تصویر ────────────────────────────────── */}
                <div className="relative w-full aspect-video bg-white/[0.03] overflow-hidden">
                  {project.image?.url && isValidUrl(project.image.url) ? (
                    <Image
                      src={project.image.url}
                      alt={project.image.alt ?? project.translation!.title}
                      fill
                      className="object-cover group-hover:scale-[1.03] transition-transform duration-500"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center text-5xl">
                      {project.image?.url && !isValidUrl(project.image.url) ? project.image.url : '🖼️'}
                    </div>
                  )}
                  {/* Overlay gradient */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0d0d12]/80 via-transparent to-transparent" />

                  {/* Badge */}
                  {project.translation?.badge && (
                    <span className="absolute top-3 start-3 text-[10px] font-bold bg-purple-500/80 text-white px-2.5 py-1 rounded-full backdrop-blur-sm">
                      {project.translation.badge}
                    </span>
                  )}
                </div>

                {/* ── محتوا ────────────────────────────────── */}
                <div className="flex flex-col flex-1 p-5 gap-3">
                  <h2 className="text-base font-bold text-white group-hover:text-purple-200 transition-colors leading-snug">
                    {project.translation!.title}
                  </h2>
                  <p className="text-sm text-gray-400 leading-relaxed line-clamp-2">
                    {project.translation!.brief}
                  </p>

                  {/* تکنولوژی‌ها */}
                  {project.techs.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mt-auto pt-2">
                      {project.techs.slice(0, 4).map((tech) => (
                        <span
                          key={tech.name}
                          className="inline-flex items-center gap-1 text-[10px] font-semibold text-gray-400 bg-white/5 border border-white/[0.08] px-2 py-0.5 rounded-md"
                        >
                          {tech.icon && <span>{tech.icon}</span>}
                          {tech.name}
                        </span>
                      ))}
                      {project.techs.length > 4 && (
                        <span className="text-[10px] text-gray-500">+{project.techs.length - 4}</span>
                      )}
                    </div>
                  )}

                  {/* Arrow */}
                  <div className="flex items-center gap-1.5 text-xs text-purple-400 font-semibold mt-2 group-hover:gap-2.5 transition-all">
                    {t.viewProject}
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d={isRTL ? 'M15 19l-7-7 7-7' : 'M9 5l7 7-7 7'} />
                    </svg>
                  </div>
                </div>
              </Link>
            ))}
          </div>
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
