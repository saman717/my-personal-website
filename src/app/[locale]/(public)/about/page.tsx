import type { Metadata } from 'next';
import AboutHero from '@/components/about/AboutHero';
import StatsRow from '@/components/about/StatsRow';
import MyStory from '@/components/about/MyStory';
import SkillsDeep from '@/components/about/SkillsDeep';
import ValuesSection from '@/components/about/ValuesSection';
import ExperienceTimeline from '@/components/about/ExperienceTimeline';
import AboutCTA from '@/components/about/AboutCTA';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://samankhoshnoud.ir';

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const isPersian = locale === 'fa';

  const title = isPersian
    ? 'درباره من | سامان خوشنود - برنامه‌نویس فرانت‌اند'
    : 'About Me | Saman Khoshnood - Frontend Developer';

  const description = isPersian
    ? 'بیوگرافی، سوابق کاری، مهارت‌های تخصصی و مسیر شغلی سامان خوشنود. توسعه‌دهنده وب مسلط به React و Next.js.'
    : 'Background, work experience, technical skills, and software engineering journey of Saman Khoshnood. Frontend engineer specialized in React & Next.js.';

  const keywords = isPersian
    ? ['درباره سامان خوشنود', 'رزومه سامان خوشنود', 'مهارت‌های برنامه‌نویسی', 'توسعه‌دهنده وب']
    : ['About Saman Khoshnood', 'Saman Khoshnood Resume', 'Frontend Engineer', 'Web Developer Skills'];

  const canonicalUrl = `${SITE_URL}/${locale}/about`;

  return {
    title,
    description,
    keywords,
    authors: [{ name: 'Saman Khoshnood', url: SITE_URL }],
    creator: 'Saman Khoshnood',
    alternates: {
      canonical: canonicalUrl,
      languages: {
        'fa-IR': `${SITE_URL}/fa/about`,
        'en-US': `${SITE_URL}/en/about`,
        'x-default': `${SITE_URL}/fa/about`,
      },
    },
    openGraph: {
      title,
      description,
      url: canonicalUrl,
      siteName: isPersian ? 'وب‌سایت سامان خوشنود' : 'Saman Khoshnood Portfolio',
      locale: isPersian ? 'fa_IR' : 'en_US',
      type: 'profile',
      images: [{ url: '/og-image-about.jpg', width: 1200, height: 630, alt: title }],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: ['/og-image-about.jpg'],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
  };
}

export default async function AboutPage({ params }: Props) {
  const { locale } = await params;
  const isRTL = locale === 'fa';

  return (
    <div
      className="min-h-screen bg-[#0d0d0f] text-[#e8e6e3] font-sans pb-24"
      dir={isRTL ? 'rtl' : 'ltr'}
    >
      <div className="max-w-5xl mx-auto px-6 py-12 space-y-12">
        <div className="flex items-center justify-start mb-4">
          <span className="inline-flex items-center gap-2 bg-purple-500/10 border border-purple-500/30 text-purple-400 text-xs md:text-sm px-4 py-2 rounded-full shadow-[0_0_15px_rgba(167,139,250,0.1)]">
            <span className="w-2 h-2 rounded-full bg-purple-400 animate-pulse"></span>
            {locale === 'fa' ? 'درباره من' : 'About Me'}
          </span>
        </div>

        <AboutHero locale={locale} />
        <div className="h-px bg-linear-to-r from-transparent via-white/10 to-transparent my-10"></div>

        <StatsRow locale={locale} />
        <div className="h-px bg-linear-to-r from-transparent via-white/10 to-transparent my-10"></div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <MyStory locale={locale} />
          <SkillsDeep locale={locale} />
        </div>
        <div className="h-px bg-linear-to-r from-transparent via-white/10 to-transparent my-10"></div>

        <ValuesSection locale={locale} />
        <div className="h-px bg-linear-to-r from-transparent via-white/10 to-transparent my-10"></div>

        <ExperienceTimeline locale={locale} />
        <div className="h-px bg-linear-to-r from-transparent via-white/10 to-transparent my-10"></div>

        <AboutCTA locale={locale} />
      </div>
    </div>
  );
}
