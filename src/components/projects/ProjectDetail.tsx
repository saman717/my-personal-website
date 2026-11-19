import Link from 'next/link';
import Image from 'next/image';
import { SiGithub } from 'react-icons/si';
import { LuExternalLink, LuClock } from 'react-icons/lu';
import { getDictionary } from '@/lib/translate';
import type { ProjectDetail as ProjectDetailData } from '@/lib/queries/projects';

function isValidUrl(str: string): boolean {
  try {
    const url = new URL(str);
    return url.protocol === 'http:' || url.protocol === 'https:';
  } catch {
    return false;
  }
}

function LinkIcon({ type }: { type: string }) {
  if (type === 'github') return <SiGithub size={16} />;
  return <LuExternalLink size={16} />;
}

type Props = { data: ProjectDetailData; locale: string };

export async function ProjectDetail({ data, locale }: Props) {
  const dict = await getDictionary(locale);
  const pt = dict.portfolio;
  const t = pt.detail;
  const { project, translation, content, primaryImage, galleryImages, techs, links } = data;
  const isRTL = locale === 'fa';

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

        <Link
          href={`/${locale}/portfolio`}
          className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors mb-10"
        >
          {t.back}
        </Link>

        {primaryImage && (
          <div className="relative w-full aspect-video rounded-2xl overflow-hidden mb-10 border border-white/[0.07] bg-white/[0.03]">
            {isValidUrl(primaryImage.url) ? (
              <>
                <Image
                  src={primaryImage.url}
                  alt={primaryImage.alt ?? translation.title}
                  fill
                  priority
                  unoptimized
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
          {project.updatedAt && (
            <p className="flex items-center gap-1.5 text-xs text-gray-600 pt-1">
              <LuClock size={14} className="shrink-0" />
              {t.last_updated}{' '}
              <time dateTime={new Date(project.updatedAt).toISOString()}>
                {new Date(project.updatedAt).toLocaleDateString(
                  isRTL ? 'fa-IR' : 'en-US',
                  { year: 'numeric', month: 'long', day: 'numeric' },
                )}
              </time>
            </p>
          )}
        </div>

        <div className="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent mb-10" />

        <div className={`flex gap-8 ${hasSidebar ? 'flex-col lg:flex-row' : ''}`}>

          <article className="flex-1 min-w-0">

            {(translation.challengeText || translation.solutionSteps || translation.resultsItems) && (
              <div className="space-y-10 mb-10">

                {translation.challengeText && (
                  <section className="space-y-3">
                    <h2 className="text-lg font-bold text-white flex items-center gap-2">
                      <span className="w-1 h-5 rounded-full bg-red-500/70 shrink-0" />
                      {translation.challengeTitle ?? t.challenge}
                    </h2>
                    <p className="text-sm text-gray-400 leading-relaxed">{translation.challengeText}</p>
                  </section>
                )}

                {Array.isArray(translation.solutionSteps) && translation.solutionSteps.length > 0 && (
                  <section className="space-y-3">
                    <h2 className="text-lg font-bold text-white flex items-center gap-2">
                      <span className="w-1 h-5 rounded-full bg-emerald-500/70 shrink-0" />
                      {translation.solutionTitle ?? t.solution}
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

                {Array.isArray(translation.resultsItems) && translation.resultsItems.length > 0 && (
                  <section className="space-y-3">
                    <h2 className="text-lg font-bold text-white flex items-center gap-2">
                      <span className="w-1 h-5 rounded-full bg-purple-500/70 shrink-0" />
                      {translation.resultsTitle ?? t.results}
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
                suppressHydrationWarning
                dangerouslySetInnerHTML={{ __html: content.contentHtml }}
              />
            ) : (
              !translation.challengeText && !translation.solutionSteps && !translation.resultsItems && (
                <p className="text-gray-500 italic text-sm">{t.no_content}</p>
              )
            )}

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
                          unoptimized
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

          {hasSidebar && (
            <aside className="w-full lg:w-72 shrink-0 space-y-5">

              {(translation.metaRole || translation.metaPlatform || translation.metaCategory || translation.metaStatus) && (
                <div className="bg-white/[0.03] border border-white/[0.07] rounded-2xl p-5 space-y-3">
                  {[
                    { label: t.role,         value: translation.metaRole },
                    { label: t.platform,     value: translation.metaPlatform },
                    { label: t.category,     value: translation.metaCategory },
                    { label: t.status_label, value: translation.metaStatus },
                  ].filter((row) => row.value).map((row) => (
                    <div key={row.label} className="flex flex-col gap-0.5">
                      <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">{row.label}</span>
                      <span className="text-sm font-semibold text-white">{row.value}</span>
                    </div>
                  ))}
                </div>
              )}

              {techs.length > 0 && (
                <div className="bg-white/[0.03] border border-white/[0.07] rounded-2xl p-5 space-y-3">
                  <h3 className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">
                    {translation.techStackTitle ?? pt.tech_stack}
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {techs.map((tech) =>
                      tech.website ? (
                        <a
                          key={tech.slug}
                          href={tech.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 text-xs font-semibold text-gray-300 hover:text-purple-300 bg-white/5 hover:bg-purple-500/10 border border-white/[0.08] hover:border-purple-500/20 px-2.5 py-1 rounded-lg transition-colors"
                        >
                          {tech.icon && <span className="text-sm">{tech.icon}</span>}
                          {tech.name}
                          <LuExternalLink size={10} className="opacity-50" />
                        </a>
                      ) : (
                        <span
                          key={tech.slug}
                          className="inline-flex items-center gap-1.5 text-xs font-semibold text-gray-300 bg-white/5 border border-white/[0.08] px-2.5 py-1 rounded-lg"
                        >
                          {tech.icon && <span className="text-sm">{tech.icon}</span>}
                          {tech.name}
                        </span>
                      ),
                    )}
                  </div>
                </div>
              )}

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
                        <LuExternalLink size={12} className="text-gray-600 group-hover:text-purple-400 transition-colors shrink-0" />
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
