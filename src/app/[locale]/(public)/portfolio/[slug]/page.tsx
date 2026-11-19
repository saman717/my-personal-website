import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getProjectBySlug } from '@/lib/queries/projects';
import { ProjectDetail } from '@/components/projects/ProjectDetail';
import { getDictionary } from '@/lib/translate';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://samankhoshnoud.ir';

type Props = { params: Promise<{ locale: string; slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params;
  const [data, dict] = await Promise.all([
    getProjectBySlug(slug, locale),
    getDictionary(locale),
  ]);
  if (!data) return {};

  const { translation, primaryImage } = data;
  const canonicalUrl = `${SITE_URL}/${locale}/portfolio/${slug}`;

  return {
    title: `${translation.title} | ${dict.home.title}`,
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
      description: translation.brief ?? undefined,
      url: canonicalUrl,
      type: 'article',
      images: primaryImage?.url
        ? [{ url: primaryImage.url, alt: primaryImage.alt ?? translation.title }]
        : [],
    },
    robots: { index: true, follow: true },
  };
}

export default async function PortfolioProjectPage({ params }: Props) {
  const { locale, slug } = await params;
  const data = await getProjectBySlug(slug, locale);
  if (!data) notFound();

  return <ProjectDetail data={data} locale={locale} />;
}
