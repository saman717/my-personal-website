import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { db } from '@/db';
import {
  portfolioProjects,
  portfolioProjectTranslations,
  portfolioProjectContent,
  portfolioProjectImages,
  portfolioProjectTechnologies,
  portfolioTechnologies,
  portfolioProjectLinks,
} from '@/db/schema';
import { eq, and, asc } from 'drizzle-orm';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://samankhoshnoud.ir';

function isValidUrl(str: string): boolean {
  try {
    const url = new URL(str);
    return url.protocol === 'http:' || url.protocol === 'https:';
  } catch {
    return false;
  }
}

type Props = { params: Promise<{ locale: string; slug: string }> };

// ─── Data fetching ────────────────────────────────────────────────────────────
async function getProject(slug: string, locale: string) {
  const [project] = await db
    .select()
    .from(portfolioProjects)
    .where(eq(portfolioProjects.slug, slug))
    .limit(1);

  if (!project || project.status !== 'published') return null;

  const [translation] = await db
    .select()
    .from(portfolioProjectTranslations)
    .where(
      and(
        eq(portfolioProjectTranslations.projectId, project.id),
        eq(portfolioProjectTranslations.locale, locale as 'fa' | 'en')
      )
    )
    .limit(1);

  if (!translation) return null;

  const [content] = await db
    .select()
    .from(portfolioProjectContent)
    .where(
      and(
        eq(portfolioProjectContent.projectId, project.id),
        eq(portfolioProjectContent.locale, locale as 'fa' | 'en')
      )
    )
    .limit(1);

  const images = await db
    .select()
    .from(portfolioProjectImages)
    .where(eq(portfolioProjectImages.projectId, project.id))
    .orderBy(asc(portfolioProjectImages.sortOrder));

  const techRows = await db
    .select({ name: portfolioTechnologies.name, icon: portfolioTechnologies.icon, slug: portfolioTechnologies.slug })
    .from(portfolioProjectTechnologies)
    .innerJoin(portfolioTechnologies, eq(portfolioProjectTechnologies.technologyId, portfolioTechnologies.id))
    .where(eq(portfolioProjectTechnologies.projectId, project.id));

  const links = await db
    .select()
    .from(portfolioProjectLinks)
    .where(eq(portfolioProjectLinks.projectId, project.id))
    .orderBy(asc(portfolioProjectLinks.sortOrder));

  const primaryImage = images.find((img) => img.isPrimary === 1) ?? images[0] ?? null;
  const galleryImages = images.filter((img) => img.isPrimary !== 1);

  return { project, translation, content, primaryImage, galleryImages, techs: techRows, links };
}

// ─── Metadata ─────────────────────────────────────────────────────────────────
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params;
  const data = await getProject(slug, locale);
  if (!data) return {};

  const { translation, primaryImage } = data;
  const canonicalUrl = `${SITE_URL}/${locale}/portfolio/${slug}`;

  return {
    title: `${translation.title} | سامان خوشنود`,
    description: translation.brief,
    authors: [{ name: 'Saman Khoshnood', url: SITE_URL }],
    creator: 'Saman Khoshnood',
    alternates: {
      canonical: canonicalUrl,
      languages: {
        'fa-IR': `${SITE_URL}/fa/portfolio/${slug}`,
        'en-US': `${SITE_URL}/en/portfolio/${slug}`,
        'x-default': `${SITE_URL}/fa/portfolio/${slug}`,
      },
    },
    openGraph: {
      title: translation.title,
      description: translation.brief,
      url: canonicalUrl,
      type: 'article',
      images: primaryImage?.url ? [{ url: primaryImage.url, alt: primaryImage.alt ?? translation.title }] : [],
    },
    robots: { index: true, follow: true },
  };
}

// ─── Link type icons ──────────────────────────────────────────────────────────
function LinkIcon({ type }: { type: string }) {
  if (type === 'github') return (
    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
      <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z" />
    </svg>
  );
  return (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
    </svg>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default async function PortfolioProjectPage({ params }: Props) {
  const { locale, slug } = await params;
  const isRTL = locale === 'fa';
  const isPersian = locale === 'fa';

  const data = await getProject(slug, locale);
  if (!data) notFound();

  const { translation, content, primaryImage, galleryImages, techs, links } = data;

  const t = {
    backLabel:      isPersian ? '← نمونه کارها' : '← Portfolio',
    techStack:      translation.techStackTitle ?? (isPersian ? 'تکنولوژی‌ها' : 'Tech Stack'),
    links:          isPersian ? 'لینک‌ها' : 'Links',
    role:           isPersian ? 'نقش' : 'Role',
    platform:       isPersian ? 'پلتفرم' : 'Platform',
    category:       isPersian ? 'دسته‌بندی' : 'Category',
    status:         isPersian ? 'وضعیت' : 'Status',
    challenge:      translation.challengeTitle ?? (isPersian ? 'چالش' : 'Challenge'),
    solution:       translation.solutionTitle ?? (isPersian ? 'راه‌حل' : 'Solution'),
    results:        translation.resultsTitle ?? (isPersian ? 'نتایج' : 'Results'),
    gallery:        isPersian ? 'گالری' : 'Gallery',
    noContent:      isPersian ? 'محتوایی ثبت نشده' : 'No content yet',
  };

  const hasSidebar =
    techs.length > 0 ||
    links.length > 0 ||
    translation.metaRole ||
    translation.metaPlatform ||
    translation.metaCategory ||
    translation.metaStatus;

  return (
    <div className="min-h-screen bg-[#0d0d12] text-white" dir={isRTL ? 'rtl' : 'ltr'}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-24">

        {/* ── Back ──────────────────────────────────────────── */}
        <Link
          href={`/${locale}/portfolio`}
          className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors mb-10"
        >
          {t.backLabel}
        </Link>

        {/* ── Hero image ────────────────────────────────────── */}
        {primaryImage && (
          <div className="relative w-full aspect-video rounded-2xl overflow-hidden mb-10 border border-white/[0.07] bg-white/[0.03]">
            {isValidUrl(primaryImage.url) ? (
              <>
                <Image
                  src={primaryImage.url}
                  alt={primaryImage.alt ?? translation.title}
                  fill
                  priority
                  className="object-cover"
                  sizes="(max-width: 1200px) 100vw, 1200px"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0d0d12]/60 via-transparent to-transparent" />
              </>
            ) : (
              <div className="absolute inset-0 flex items-center justify-center text-6xl">
                {primaryImage.url}
              </div>
            )}
          </div>
        )}

        {/* ── Title + brief ─────────────────────────────────── */}
        <div className="mb-10 space-y-3">
          {translation.badge && (
            <span className="inline-block text-xs font-bold bg-purple-500/10 border border-purple-500/30 text-purple-400 px-3 py-1 rounded-full">
              {translation.badge}
            </span>
          )}
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight leading-tight bg-gradient-to-b from-white to-gray-400 bg-clip-text text-transparent">
            {translation.title}
          </h1>
          <p className="text-base text-gray-400 leading-relaxed max-w-2xl">{translation.brief}</p>
        </div>

        <div className="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent mb-10" />

        {/* ── Main layout: content + sidebar ────────────────── */}
        <div className={`flex gap-8 ${hasSidebar ? 'flex-col lg:flex-row' : ''}`}>

          {/* ── HTML Content (محتوای آزاد) ─────────────────── */}
          <article className="flex-1 min-w-0">

            {/* بلاک‌های ثابت structured */}
            {(translation.challengeText || translation.solutionSteps || translation.resultsItems) && (
              <div className="space-y-10 mb-10">
                {/* Challenge */}
                {translation.challengeText && (
                  <section className="space-y-3">
                    <h2 className="text-lg font-bold text-white flex items-center gap-2">
                      <span className="w-1 h-5 rounded-full bg-red-500/70 shrink-0" />
                      {t.challenge}
                    </h2>
                    <p className="text-sm text-gray-400 leading-relaxed">{translation.challengeText}</p>
                  </section>
                )}

                {/* Solution */}
                {Array.isArray(translation.solutionSteps) && translation.solutionSteps.length > 0 && (
                  <section className="space-y-3">
                    <h2 className="text-lg font-bold text-white flex items-center gap-2">
                      <span className="w-1 h-5 rounded-full bg-emerald-500/70 shrink-0" />
                      {t.solution}
                    </h2>
                    <ol className="space-y-3">
                      {(translation.solutionSteps as { step: string; detail?: string }[]).map((s, i) => (
                        <li key={i} className="flex gap-3">
                          <span className="shrink-0 w-6 h-6 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold flex items-center justify-center">
                            {i + 1}
                          </span>
                          <div>
                            <p className="text-sm font-semibold text-white">{s.step}</p>
                            {s.detail && <p className="text-xs text-gray-500 mt-0.5">{s.detail}</p>}
                          </div>
                        </li>
                      ))}
                    </ol>
                  </section>
                )}

                {/* Results */}
                {Array.isArray(translation.resultsItems) && translation.resultsItems.length > 0 && (
                  <section className="space-y-3">
                    <h2 className="text-lg font-bold text-white flex items-center gap-2">
                      <span className="w-1 h-5 rounded-full bg-purple-500/70 shrink-0" />
                      {t.results}
                    </h2>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                      {(translation.resultsItems as { label: string; value: string }[]).map((item, i) => (
                        <div key={i} className="bg-white/[0.03] border border-white/[0.07] rounded-xl p-4 space-y-1">
                          <p className="text-xl font-black text-purple-400">{item.value}</p>
                          <p className="text-xs text-gray-500">{item.label}</p>
                        </div>
                      ))}
                    </div>
                  </section>
                )}
              </div>
            )}

            {/* HTML آزاد */}
            {content?.contentHtml ? (
              <div
                className="prose prose-invert prose-sm sm:prose-base max-w-none
                  prose-headings:font-bold prose-headings:text-white
                  prose-p:text-gray-400 prose-p:leading-relaxed
                  prose-a:text-purple-400 prose-a:no-underline hover:prose-a:underline
                  prose-code:text-emerald-400 prose-code:bg-white/5 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded
                  prose-pre:bg-white/[0.04] prose-pre:border prose-pre:border-white/[0.08]
                  prose-blockquote:border-purple-500/40 prose-blockquote:text-gray-400
                  prose-img:rounded-xl prose-img:border prose-img:border-white/[0.07]
                  prose-hr:border-white/10
                  prose-li:text-gray-400"
                dangerouslySetInnerHTML={{ __html: content.contentHtml }}
              />
            ) : (
              !translation.challengeText && !translation.solutionSteps && !translation.resultsItems && (
                <p className="text-gray-500 italic text-sm">{t.noContent}</p>
              )
            )}

            {/* Gallery */}
            {galleryImages.length > 0 && (
              <section className="mt-12 space-y-4">
                <h2 className="text-lg font-bold text-white">{t.gallery}</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {galleryImages.map((img) => (
                    <div key={img.id} className="relative aspect-video rounded-xl overflow-hidden border border-white/[0.07] bg-white/[0.03]">
                      {isValidUrl(img.url) ? (
                        <Image
                          src={img.url}
                          alt={img.alt ?? translation.title}
                          fill
                          className="object-cover"
                          sizes="(max-width: 768px) 100vw, 50vw"
                        />
                      ) : (
                        <div className="absolute inset-0 flex items-center justify-center text-5xl">{img.url}</div>
                      )}
                    </div>
                  ))}
                </div>
              </section>
            )}
          </article>

          {/* ── Sidebar ───────────────────────────────────────── */}
          {hasSidebar && (
            <aside className="w-full lg:w-72 shrink-0 space-y-5">

              {/* Meta info */}
              {(translation.metaRole || translation.metaPlatform || translation.metaCategory || translation.metaStatus) && (
                <div className="bg-white/[0.03] border border-white/[0.07] rounded-2xl p-5 space-y-3">
                  {[
                    { label: t.role,     value: translation.metaRole },
                    { label: t.platform, value: translation.metaPlatform },
                    { label: t.category, value: translation.metaCategory },
                    { label: t.status,   value: translation.metaStatus },
                  ].filter((row) => row.value).map((row) => (
                    <div key={row.label} className="flex flex-col gap-0.5">
                      <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">{row.label}</span>
                      <span className="text-sm font-semibold text-white">{row.value}</span>
                    </div>
                  ))}
                </div>
              )}

              {/* Tech stack */}
              {techs.length > 0 && (
                <div className="bg-white/[0.03] border border-white/[0.07] rounded-2xl p-5 space-y-3">
                  <h3 className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">{t.techStack}</h3>
                  <div className="flex flex-wrap gap-2">
                    {techs.map((tech) => (
                      <span
                        key={tech.slug}
                        className="inline-flex items-center gap-1.5 text-xs font-semibold text-gray-300 bg-white/5 border border-white/[0.08] px-2.5 py-1 rounded-lg"
                      >
                        {tech.icon && <span className="text-sm">{tech.icon}</span>}
                        {tech.name}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Links */}
              {links.length > 0 && (
                <div className="bg-white/[0.03] border border-white/[0.07] rounded-2xl p-5 space-y-3">
                  <h3 className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">{t.links}</h3>
                  <div className="space-y-2">
                    {links.map((link) => (
                      <a
                        key={link.id}
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group flex items-center gap-3 p-3 rounded-xl bg-white/[0.02] border border-white/[0.06] hover:border-purple-500/30 hover:bg-purple-500/5 transition-all"
                      >
                        <span className="text-gray-400 group-hover:text-purple-400 transition-colors">
                          <LinkIcon type={link.type} />
                        </span>
                        <span className="text-sm font-semibold text-gray-300 group-hover:text-white transition-colors flex-1 truncate">
                          {link.label ?? link.type}
                        </span>
                        <svg className="w-3 h-3 text-gray-600 group-hover:text-purple-400 transition-colors shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                        </svg>
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </aside>
          )}
        </div>

      </div>
    </div>
  );
}
