import React from "react";
import { getDictionary } from "@/lib/translate"; // 🌟 لود مستقیم فایلهای JSON در سرور

interface MyStoryProps {
  locale: string;
}

export default async function MyStory({ locale }: MyStoryProps) {
  // ۱. دریافت مستقیم دیکشنری در لایه سرور بدون ارسال کدهای اضافه به کلاینت
  const dict = await getDictionary(locale as "fa" | "en");

  // ۲. تابع استخراج کلیدهای تو در تو
  const t = (key: string) => {
    return key.split(".").reduce((obj: any, k: string) => obj?.[k], dict) || key;
  };

  return (
    <div className="bg-white/3 border border-white/10 rounded-3xl p-8 md:p-12 h-full flex flex-col justify-center transition-all hover:bg-white/[0.05]">
      {/* برچسب فوقانی */}
      <div className="text-xs md:text-sm tracking-[0.15em] text-gray-500 uppercase mb-3 font-semibold">
        {t("AboutPage.MyStory.label")}
      </div>

      {/* عنوان اصلی سئو شده */}
      <h2 className="text-2xl md:text-3xl font-bold text-[#f4f3f0] mb-6 leading-snug">
        {t("AboutPage.MyStory.titleNormal")}{" "}
        <span className="text-purple-400">{t("AboutPage.MyStory.titleHighlight")}</span>
      </h2>

      {/* متن داستان که مستقیماً در Initial HTML رندر می‌شود */}
      <div className="space-y-6 text-sm md:text-base text-gray-400 leading-loose">
        <p>{t("AboutPage.MyStory.p1")}</p>
        <p>{t("AboutPage.MyStory.p2")}</p>
      </div>
    </div>
  );
}