import React from "react";
import { t } from "@/lib/translate";
import BookingButton from "@/components/services/BookingButton"; 

interface Props {
  locale: string;
}

export default async function BookingCTA({ locale }: Props) {
  const title = await t(locale, "contact.booking_cta.title");
  const subtitle = await t(locale, "contact.booking_cta.subtitle");
  const buttonText = await t(locale, "contact.booking_cta.button");

  return (
    <section className="bg-gradient-to-br from-[#12121a] to-[#0d0d12] border border-white/5 rounded-3xl p-8 md:p-12 text-center space-y-6">
      <div className="space-y-2">
        <h2 className="text-2xl md:text-3xl font-black text-white italic">
          {title}
        </h2>
        <p className="text-xs md:text-sm text-gray-400 max-w-xl mx-auto">
          {subtitle}
        </p>
      </div>

      <div className="flex justify-center">
        <BookingButton text={buttonText} />
      </div>
    </section>
  );
}