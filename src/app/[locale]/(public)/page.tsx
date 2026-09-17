import type { Metadata } from 'next';
import HeroSection from '@/components/home/HeroSection';
import SkillsSection from '@/components/skills/SkillsSection';
import ProjectsSection from '@/components/projects/ProjectsSection';
import TimelineSection from '@/components/timeline/TimelineSection';
import ContactSection from '@/components/forms/ContactSection';
import { PersonJsonLd } from '@/components/seo/JsonLd';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://samankhoshnoud.ir';

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const isPersian = locale === 'fa';

  const title = isPersian
    ? 'سامان خوشنود | برنامه‌نویس فرانت‌اند و توسعه‌دهنده وب'
    : 'Saman Khoshnood | Frontend & Web Developer';

  const description = isPersian
    ? 'وب‌سایت شخصی و نمونه کارهای سامان خوشنود. متخصص در برنامه‌نویسی فرانت‌اند، React، Next.js و توسعه اپلیکیشن‌های مدرن وب.'
    : 'Official portfolio of Saman Khoshnood. Frontend Developer specializing in React, Next.js, TypeScript, and modern web software engineering.';

  const keywords = isPersian
    ? ['سامان خوشنود', 'برنامه‌نویس فرانت‌اند', 'توسعه‌دهنده وب', 'React', 'Next.js', 'سفارش طراحی سایت']
    : ['Saman Khoshnood', 'Frontend Developer', 'Web Developer', 'Next.js', 'React', 'Software Engineer Portfolio'];

  const canonicalUrl = `${SITE_URL}/${locale}`;

  return {
    title,
    description,
    keywords,
    authors: [{ name: 'Saman Khoshnood', url: SITE_URL }],
    creator: 'Saman Khoshnood',
    alternates: {
      canonical: canonicalUrl,
      languages: {
        'fa-IR': `${SITE_URL}/fa`,
        'en-US': `${SITE_URL}/en`,
        'x-default': `${SITE_URL}/fa`,
      },
    },
    openGraph: {
      title,
      description,
      url: canonicalUrl,
      siteName: isPersian ? 'وب‌سایت سامان خوشنود' : 'Saman Khoshnood Portfolio',
      locale: isPersian ? 'fa_IR' : 'en_US',
      type: 'website',
      images: [{ url: '/og-image.jpg', width: 1200, height: 630, alt: title }],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: ['/og-image.jpg'],
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

export default async function HomePage({ params }: Props) {
  const { locale } = await params;

  return (
    <>
      <PersonJsonLd locale={locale} />
      <HeroSection locale={locale} />
      <SkillsSection locale={locale} />
      <ProjectsSection locale={locale} />
      <TimelineSection locale={locale} />
      <ContactSection locale={locale} />
    </>
  );
}
