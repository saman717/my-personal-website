import React from "react";
// ایمپورت دقیق بر اساس مسیر تو
import { t } from "@/lib/translate";
import ContactHero from "@/components/contact/ContactHero";
import ContactMethods from "@/components/contact/ContactMethods";
import BookingCTA from "@/components/contact/BookingCTA";

interface ContactPageProps {
    params: Promise<{ locale: string }>;
}

export default async function ContactPage(props: ContactPageProps) {
    // منتظر می‌مانیم تا Promise پارامترها حل شود (مخصوص Next.js 15+)
    const params = await props.params;
    const locale = params.locale;

    const isRtl = locale === "fa";

    return (
        <main
            className="min-h-screen bg-[#0d0d12] text-white pt-20 pb-24 overflow-x-hidden"
            dir={isRtl ? "rtl" : "ltr"}
        >
            <div className="max-w-6xl mx-auto px-5 sm:px-8 space-y-16 md:space-y-24">

                {/* پاس دادن locale استخراج شده به تمام فرزندان */}
                <ContactHero locale={locale} />
                <ContactMethods locale={locale} />
                <BookingCTA locale={locale} />

            </div>
        </main>
    );
}