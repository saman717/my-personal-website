import React from "react";

interface HeroSectionProps {
  locale: string;
}

export default function HeroSection({ locale }: HeroSectionProps) {
  // شبیه‌سازی دریافت ریلیز متون براساس متد i18n پروژه شما
  const t = require(`@/locales/${locale}.json`).services.hero;

  return (
    <section className="text-center max-w-3xl mx-auto space-y-4 md:space-y-6 pt-8">
      <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight leading-tight bg-gradient-to-b from-white to-gray-400 bg-clip-text text-transparent">
        {t.title}
      </h1>
      <p className="text-xs sm:text-sm md:text-base text-gray-400 leading-relaxed max-w-2xl mx-auto font-medium">
        {t.subtitle}
      </p>
    </section>
  );
}