import { use } from "react";
import { getDictionary } from "@/lib/translate";
// فراخوانی فایل کلاینت از مسیر درستِ کامپوننت‌ها
import BookingPageClient from "@/components/booking/BookingPageClient";

export default function BookingPage({ params }: { params: Promise<{ locale: string }> }) {
    const { locale } = use(params);
    
    return <BookingPageServer locale={locale} />;
}

async function BookingPageServer({ locale }: { locale: string }) {
    // خواندن داینامیک و بهینه‌ی ترجمه‌ها در سرور
    const dict = await getDictionary(locale);

    return (
        <BookingPageClient 
            locale={locale} 
            labels={dict.booking} 
        />
    );
}