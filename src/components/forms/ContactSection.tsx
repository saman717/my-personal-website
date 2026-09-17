import { getDictionary } from '@/lib/translate';
import { ContactForm } from "./ContactForm";
import { ContactInfo } from "./ContactInfo";

interface ContactSectionProps {
  locale: string;
}

export default async function ContactSection({ locale }: ContactSectionProps) {
  const dict = await getDictionary(locale);
  const contactDict = dict.contact;
  const isRTL = locale === 'fa';

  const contactData = {
    email: "MOHAMAD.KHOSHNOOD.10@GMAIL.COM",
    phone: "0935867279",
  };

  // 🌟 اصلاح شد: مپ کردن دقیق به ساختار JSON جدید همراه با Optional Chaining
  const infoLabels = {
    heading: contactDict?.hero?.title || "", 
    description: contactDict?.hero?.subtitle || "",
    emailLabel: contactDict?.methods?.email_label || "Email",
    phoneLabel: contactDict?.methods?.phone_label || "Phone",
    copied: isRTL ? "کپی شد!" : "Copied!",
    scheduleMeeting: isRTL ? "تعیین وقت ملاقات" : "Schedule Meeting"
  };

  const newLocal = "absolute top-1/4 left-1/4 w-87.5 h-87.5 bg-purple-600/10 rounded-full blur-[130px] pointer-events-none";
  return (
    <section className="w-full min-h-150 md:min-h-175 bg-[#111113] flex items-center justify-center p-6 md:px-16 md:py-12 relative overflow-hidden">
      
      {/* پس‌زمینه‌های نوری */}
      <div className={newLocal} />
      <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-emerald-600/5 rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-indigo-900/6 rounded-full blur-[180px] pointer-events-none" />

      {/* کانتینر اصلی محتوا */}
      <div 
        className="w-full max-w-6xl grid grid-cols-1 md:grid-cols-[1fr_auto_1fr] gap-8 md:gap-12 items-center relative z-10 px-4 md:px-8 py-6 md:py-10"
        dir={isRTL ? "rtl" : "ltr"}
      >

        <div className="flex justify-center w-full order-1 md:order-1 md:justify-end">
          <ContactInfo
            email={contactData.email}
            phone={contactData.phone}
            socialCount={5}
            labels={infoLabels}
            isRTL={isRTL}
            locale={locale}
          />
        </div>

        <div className="hidden md:block h-full min-h-[400px] w-px bg-gradient-to-b from-transparent via-white/15 to-transparent self-stretch order-2" />

        <div className="flex justify-center w-full order-3 md:order-3 md:justify-start">
          {/* 🌟 اصلاح شد: فرم هم با یک شیء خالی محافظت شد تا کرش نکند */}
          <ContactForm labels={contactDict?.form || {}} isRTL={isRTL} />
        </div>

      </div>
    </section>
  );
}

export { ContactSection };