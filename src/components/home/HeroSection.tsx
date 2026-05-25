import { t } from '@/lib/translate';
import HeroBackground from '@/components/home/HeroBackground'
import HeroImage from './HeroImage';
import HeroText from './HeroText';

interface HeroSectionProps {
  locale: string;
}

export default async function HeroSection({ locale }: HeroSectionProps) {
  const isRTL = locale === 'fa';

  // ترجمه‌ها
  const subtitle = await t(locale, 'home.subtitle');
  const description = await t(locale, 'home.description');
  const ctaProjectsLabel = await t(locale, 'home.cta_projects');
  const ctaContactLabel = await t(locale, 'home.cta_contact');

  const name = locale === 'fa' ? 'سامان خوشنود' : 'Saman Khoshnood';
  const imageAlt = name;

  const ctaButtons = [
    {
      label: ctaProjectsLabel,
      href: `/${locale}/portfolio`,
      variant: 'primary' as const,
    },
    {
      label: ctaContactLabel,
      href: `/${locale}/contact`,
      variant: 'secondary' as const,
    },
  ];

  return (
    <section className="relative min-h-[90vh] w-full bg-[#0d0d12] overflow-hidden flex items-center mt-10 md:mt-0">
      <HeroBackground />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex flex-col-reverse lg:flex-row items-center gap-12 lg:gap-20">
          {/* Text (right on RTL, left on LTR) */}
          <HeroText
            name={name}
            subtitle={subtitle}
            description={description}
            ctaButtons={ctaButtons}
            isRTL={isRTL}
          />

          {/* Image (left on RTL, right on LTR) */}
          <HeroImage src="/images/Man.png" alt={imageAlt} />
        </div>
      </div>
    </section>
  );
}