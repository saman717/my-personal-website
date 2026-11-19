import { getDictionary } from '@/lib/translate';
import { getPublishedProjectsCount } from '@/lib/queries/projects';
import HeroBackground from '@/components/home/HeroBackground';
import HeroImage from './HeroImage';
import HeroText from './HeroText';

interface HeroSectionProps {
  locale: string;
}

export default async function HeroSection({ locale }: HeroSectionProps) {
  const [dict, projectCount] = await Promise.all([
    getDictionary(locale),
    getPublishedProjectsCount().catch(() => 0),
  ]);
  const h = dict.home;
  const isRTL = locale === 'fa';
  const formattedCount = new Intl.NumberFormat(isRTL ? 'fa-IR' : 'en-US').format(projectCount);
  const projectsCount = isRTL
    ? `+${formattedCount}${h.projects_count}`
    : `${h.projects_count}${formattedCount}`;

  return (
    <section
      dir={isRTL ? 'rtl' : 'ltr'}
      className="relative min-h-[90vh] w-full bg-[#0d0d12] overflow-hidden flex items-center mt-10 md:mt-0"
    >
      <HeroBackground />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10 py-16 lg:py-0">
        <div className="flex flex-col items-center gap-12 lg:gap-16 lg:flex-row">
          <div className="w-full lg:w-[55%]">
            <HeroText
              isRTL={isRTL}
              eyebrow={h.eyebrow}
              headline1={h.headline_1}
              headline2={h.headline_2}
              sub={h.sub}
              ctaPrimary={h.cta_primary}
              ctaSecondary={h.cta_secondary}
            />
          </div>

          <div className="w-full lg:w-[45%] flex justify-center">
            <HeroImage
              src="/images/Man_1.jpg"
              alt={h.title}
              available={h.available}
              projectsCount={projectsCount}
              clientLabel={h.client_label}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
