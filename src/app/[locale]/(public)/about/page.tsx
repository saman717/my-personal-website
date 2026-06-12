import AboutHero from '@/components/about/AboutHero';
import StatsRow from '@/components/about/StatsRow';
import MyStory from '@/components/about/MyStory';
import SkillsDeep from '@/components/about/SkillsDeep';
import ValuesSection from '@/components/about/ValuesSection';
import ExperienceTimeline from '@/components/about/ExperienceTimeline';
import AboutCTA from '@/components/about/AboutCTA';

export default async function AboutPage({ params }: { params: { locale: string } }) {
  const { locale } = await params;
  const isRTL = locale === 'fa';

  return (
    <div
      className="min-h-screen bg-[#0d0d0f] text-[#e8e6e3] font-sans pb-24"
      dir={isRTL ? 'rtl' : 'ltr'}
    >
      {/* 🌟 تغییر اصلی: max-w-5xl برای استفاده از کل فضای دسکتاپ */}
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

        {/* 🌟 یک گرید دو ستونه جذاب برای دسکتاپ: داستان من در کنار مهارت‌ها */}
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