import { getDictionary } from '@/lib/translate';
import HeroBackground from '@/components/home/HeroBackground';
import HeroImage from './HeroImage';
import HeroText from './HeroText';

interface HeroSectionProps {
  locale: string;
}

export default async function HeroSection({
  locale,
}: HeroSectionProps) {
  const dict = await getDictionary(locale);

  const hero = dict.home;

  const isRTL = locale === "fa";

  
  const ctaButtons = [
    {
      label: hero.cta_projects,
      href: `/${locale}/portfolio`,
      variant: "primary" as const,
    },
    {
      label: hero.cta_contact,
      href: `/${locale}/contact`,
      variant: "secondary" as const,
    },
  ];

  return (
    <section className="relative min-h-[90vh] w-full bg-[#0d0d12] overflow-hidden flex items-center mt-10 md:mt-0">
      <HeroBackground />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex flex-col-reverse lg:flex-row items-center gap-12 lg:gap-20">
          <HeroText
            name={hero.title}
            subtitle={hero.subtitle}
            description={hero.description}
            ctaButtons={ctaButtons}
            isRTL={isRTL}
          />

          <HeroImage
            src="/images/Man.png"
            alt={hero.title}
          />
        </div>
      </div>
    </section>
  );
}