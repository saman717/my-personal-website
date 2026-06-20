import React from "react";
import { t } from "@/lib/translate";

interface TechPartnerSectionProps {
  locale: string;
}

export default async function TechPartnerSection({ locale }: TechPartnerSectionProps) {
  const badge = await t(locale, "services.partner.badge");
  const title = await t(locale, "services.partner.title");
  const desc = await t(locale, "services.partner.desc");
  const f1 = await t(locale, "services.partner.f1");
  const f2 = await t(locale, "services.partner.f2");
  const f3 = await t(locale, "services.partner.f3");

  return (
    <section className="relative border border-white/5 bg-[#0f0f16] rounded-3xl overflow-hidden">
      <div className={`absolute top-0 bottom-0 w-full lg:w-1/2 opacity-20 pointer-events-none ${locale === "fa" ? "left-0" : "right-0"}`}>
        <div className="w-full h-full bg-[radial-gradient(#10b981_1px,transparent_1px)] [background-size:16px_16px]" />
      </div>

      <div className="relative max-w-5xl mx-auto px-6 py-10 md:py-14 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center z-10">
        <div className="lg:col-span-7 space-y-4">
          <span className="inline-block text-[9px] font-black tracking-widest text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded-md">
            {badge}
          </span>
          <h2 className="text-xl sm:text-2xl md:text-3xl font-black text-white leading-tight">
            {title}
          </h2>
          <p className="text-xs sm:text-sm text-gray-400 leading-relaxed font-normal">
            {desc}
          </p>
        </div>

        <div className="lg:col-span-5 bg-black/20 border border-white/5 rounded-2xl p-5 space-y-3.5">
          {/* اینجا با امنیت کامل مپ کردیم */}
          {[f1, f2, f3]?.map((feature, i) => (
            <div key={i} className="flex items-start gap-3">
              <div className="shrink-0 w-4 h-4 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center mt-0.5">
                <svg className="w-2.5 h-2.5 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <span className="text-xs text-gray-300 font-medium leading-tight">{feature}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}