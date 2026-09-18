import { MetadataRoute } from 'next';
import { db } from '@/db';
import { portfolioProjects } from '@/db/schema';
import { eq } from 'drizzle-orm';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://samankhoshnoud.ir';
const LOCALES = ['fa', 'en'] as const;

const STATIC_ROUTES = [
  '',           // homepage
  '/about',
  '/portfolio',
  '/services',
  '/contact',
  '/booking',
  '/blog',
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const entries: MetadataRoute.Sitemap = [];

  // Static routes for each locale
  for (const locale of LOCALES) {
    for (const route of STATIC_ROUTES) {
      entries.push({
        url: `${SITE_URL}/${locale}${route}`,
        lastModified: new Date(),
        changeFrequency: route === '' ? 'weekly' : 'monthly',
        priority: route === '' ? 1.0 : route === '/portfolio' ? 0.9 : 0.8,
        alternates: {
          languages: Object.fromEntries(
            LOCALES.map((l) => [l === 'fa' ? 'fa-IR' : 'en-US', `${SITE_URL}/${l}${route}`])
          ),
        },
      });
    }
  }

  // Dynamic portfolio routes
  try {
    const projects = await db
      .select({ slug: portfolioProjects.slug, updatedAt: portfolioProjects.updatedAt })
      .from(portfolioProjects)
      .where(eq(portfolioProjects.status, 'published'));

    for (const project of projects) {
      for (const locale of LOCALES) {
        entries.push({
          url: `${SITE_URL}/${locale}/portfolio/${project.slug}`,
          lastModified: project.updatedAt ? new Date(project.updatedAt) : new Date(),
          changeFrequency: 'monthly',
          priority: 0.7,
          alternates: {
            languages: Object.fromEntries(
              LOCALES.map((l) => [
                l === 'fa' ? 'fa-IR' : 'en-US',
                `${SITE_URL}/${l}/portfolio/${project.slug}`,
              ])
            ),
          },
        });
      }
    }
  } catch (e) {
    console.error('sitemap: failed to fetch portfolio slugs', e);
  }

  return entries;
}