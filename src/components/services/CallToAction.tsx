import React from "react";
import { t } from "@/lib/translate";
import BookingButton from "./BookingButton";

interface CallToActionProps {
  locale: string;
}

export default async function CallToAction({ locale }: CallToActionProps) {
  const title = await t(locale, "services.cta.title");
  const subtitle = await t(locale, "services.cta.subtitle");
  const buttonText = await t(locale, "services.cta.button");

  return (
    <section className="text-center max-w-2xl mx-auto space-y-6 pt-6">
      <div className="space-y-2">
        <h2 className="text-xl sm:text-2xl md:text-3xl font-black text-white">{title}</h2>
        <p className="text-xs sm:text-sm text-gray-400 font-normal max-w-xl mx-auto">{subtitle}</p>
      </div>

      {/* فقط دکمه برای رویداد کلیک کلاینتی می‌شود */}
      
      <BookingButton text={buttonText} />
    </section>
  );
}