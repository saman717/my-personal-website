import type { Metadata } from 'next';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://samankhoshnoud.ir';

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const isPersian = locale === 'fa';

  const title = isPersian
    ? 'مقالات | سامان خوشنود'
    : 'Blog | Saman Khoshnood';

  const description = isPersian
    ? 'مقالات تخصصی درباره توسعه وب، React، Next.js و تجربیات عملی از دنیای برنامه‌نویسی'
    : 'Technical articles about web development, React, Next.js and real-world software engineering experiences';

  const canonicalUrl = `${SITE_URL}/${locale}/blog`;

  return {
    title,
    description,
    authors: [{ name: 'Saman Khoshnood', url: SITE_URL }],
    creator: 'Saman Khoshnood',
    alternates: {
      canonical: canonicalUrl,
      languages: {
        'fa-IR': `${SITE_URL}/fa/blog`,
        'en-US': `${SITE_URL}/en/blog`,
        'x-default': `${SITE_URL}/fa/blog`,
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

export default async function BlogPage({ params }: Props) {
  const { locale } = await params;
  const isRTL = locale === 'fa';
  const isPersian = locale === 'fa';

  return (
    <div
      className="min-h-screen bg-[#0d0d12] text-white overflow-x-hidden"
      dir={isRTL ? 'rtl' : 'ltr'}
    >
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-24 flex flex-col items-center justify-center min-h-[80vh] gap-12">

        {/* ── Badge ─────────────────────────────────────────── */}
        <span className="inline-flex items-center gap-2 bg-purple-500/10 border border-purple-500/30 text-purple-400 text-xs md:text-sm px-4 py-2 rounded-full shadow-[0_0_15px_rgba(167,139,250,0.1)]">
          <span className="w-2 h-2 rounded-full bg-purple-400 animate-pulse" />
          {isPersian ? 'مقالات' : 'Blog'}
        </span>

        {/* ── Under Construction ────────────────────────────── */}
        <div className="text-center space-y-6">
          {/* Icon */}
          <div className="mx-auto w-20 h-20 rounded-2xl bg-gradient-to-br from-purple-600/20 to-indigo-600/20 border border-purple-500/20 flex items-center justify-center text-4xl">
            ✍️
          </div>

          <div className="space-y-3">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight leading-tight bg-gradient-to-b from-white to-gray-400 bg-clip-text text-transparent">
              {isPersian ? 'در دست ساخت' : 'Under Construction'}
            </h1>
            <p className="text-sm md:text-base text-gray-400 leading-relaxed max-w-xl mx-auto">
              {isPersian
                ? 'دارم روی اولین مقالاتم کار می‌کنم — درباره React، Next.js و تجربه‌های واقعی توسعه. به زودی اینجا خواهند بود.'
                : "I'm working on my first articles — covering React, Next.js, and real-world development experiences. They'll be here soon."}
            </p>
          </div>

          {/* Animated dots */}
          <div className="flex items-center justify-center gap-2">
            {[0, 1, 2].map((i) => (
              <span
                key={i}
                className="w-2 h-2 rounded-full bg-purple-400"
                style={{ animation: `pulse 1.5s ease-in-out ${i * 0.3}s infinite` }}
              />
            ))}
          </div>
        </div>

        {/* ── Divider ───────────────────────────────────────── */}
        <div className="w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

        {/* ── Social Cards ──────────────────────────────────── */}
        <div className="w-full space-y-4">
          <p className="text-center text-sm text-gray-500">
            {isPersian
              ? 'دنبالم کن تا اول خبر بشی:'
              : 'Follow me to be the first to know:'}
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* LinkedIn Card */}
            <a
              href="https://linkedin.com/in/samankhoshnoud"
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center gap-4 p-5 rounded-2xl bg-white/[0.03] border border-white/[0.07] hover:border-[#0A66C2]/40 hover:bg-[#0A66C2]/5 transition-all duration-300"
            >
              <div className="shrink-0 w-12 h-12 rounded-xl bg-[#0A66C2]/10 border border-[#0A66C2]/20 flex items-center justify-center">
                <svg className="w-6 h-6 text-[#0A66C2]" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                </svg>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-white group-hover:text-[#0A66C2] transition-colors">LinkedIn</p>
                <p className="text-xs text-gray-500 truncate">@samankhoshnoud</p>
              </div>
              <svg className="w-4 h-4 text-gray-600 group-hover:text-[#0A66C2] group-hover:translate-x-0.5 transition-all" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </a>

            {/* GitHub Card */}
            <a
              href="https://github.com/samankhoshnoud"
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center gap-4 p-5 rounded-2xl bg-white/[0.03] border border-white/[0.07] hover:border-white/20 hover:bg-white/[0.06] transition-all duration-300"
            >
              <div className="shrink-0 w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center">
                <svg className="w-6 h-6 text-gray-300" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z" />
                </svg>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-white group-hover:text-gray-200 transition-colors">GitHub</p>
                <p className="text-xs text-gray-500 truncate">@samankhoshnoud</p>
              </div>
              <svg className="w-4 h-4 text-gray-600 group-hover:text-gray-400 group-hover:translate-x-0.5 transition-all" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </a>
          </div>
        </div>

      </div>
    </div>
  );
}
