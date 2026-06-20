import React from "react";
import { t } from "@/lib/translate"; // مسیر فایل ترجمه‌ات را چک کن
import ServicesGrid from "@/components/services/ServicesGrid";
import TechPartnerSection from "@/components/services/TechPartnerSection";
import CallToAction from "@/components/services/CallToAction";

interface ServicesPageProps {
    params: Promise<{ locale: string }>; // 🌟 تغییر ۱: اینجا باید Promise باشه
}

export default async function ServicesPage(props: ServicesPageProps) {
    // 🌟 تغییر ۲: اینجا await می‌کنیم تا مقدار واقعی en یا fa از URL استخراج بشه
    const params = await props.params;
    const locale = params.locale;

    const isRtl = locale === "fa";

    const heroTitle = await t(locale, "services.hero.title");
    const heroSubtitle = await t(locale, "services.hero.subtitle");

    return (
        <main
            className="min-h-screen bg-[#0d0d12] text-white overflow-x-hidden pt-16 pb-24"
            dir={isRtl ? "rtl" : "ltr"}
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-20 md:space-y-28">

                <section className="text-center max-w-3xl mx-auto space-y-4 md:space-y-6 pt-8">
                    <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight leading-tight bg-gradient-to-b from-white to-gray-400 bg-clip-text text-transparent">
                        {heroTitle}
                    </h1>
                    <p className="text-xs sm:text-sm md:text-base text-gray-400 leading-relaxed max-w-2xl mx-auto font-medium">
                        {heroSubtitle}
                    </p>
                </section>

                {/* حالا locale درست (مثلا en) به عنوان یک استرینگ ساده به کامپوننت‌های پایینی پاس داده میشه */}
                <ServicesGrid locale={locale} />
                <TechPartnerSection locale={locale} />
                <CallToAction locale={locale} />

            </div>
        </main>
    );
}