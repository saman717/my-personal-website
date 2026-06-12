import React from "react";
import Link from "next/link";
import { getDictionary } from "@/lib/translate"; // 🌟 تابع لوکال شما برای خواندن فایلهای JSON در سرور

interface AboutCTAProps {
  locale: string;
}

export default async function AboutCTA({ locale }: AboutCTAProps) {
  // ۱. لود مستقیم دیکشنری در لایه سرور
  const dict = await getDictionary(locale as "fa" | "en");

  // ۲. تابع دسترسی به کلیدها بر اساس ساختار درخواستی (AboutPage.AboutCTA)
  const t = (key: string) => {
    return key.split(".").reduce((obj: any, k: string) => obj?.[k], dict) || key;
  };

  return (
    <div className="bg-linear-to-br from-purple-500/20 to-blue-500/10 border border-purple-500/25 rounded-2xl p-6 md:p-8 text-center">
      {/* عنوان اصلی سئو شده */}
      <h2 className="text-lg md:text-xl font-bold text-[#f4f3f0] mb-2">
        {t("AboutPage.AboutCTA.titleNormal")}{" "}
        <span className="text-purple-400">{t("AboutPage.AboutCTA.titleHighlight")}</span>{" "}
        {t("AboutPage.AboutCTA.titleEnd")}
      </h2>

      {/* توضیحات */}
      <p className="text-[13px] text-gray-400 mb-6 leading-relaxed max-w-md mx-auto">
        {t("AboutPage.AboutCTA.desc")}
      </p>

      {/* دکمه‌های هدایت کاربر */}
      <div className="flex flex-col sm:flex-row gap-3 justify-center items-center">
        {/* لینک مشاهده پروژه‌ها */}
        <Link href={`/${locale}/projects`} className="w-full sm:w-auto">
          <button type="button" className="w-full bg-purple-400 hover:bg-purple-300 transition-colors text-[#0d0d0f] text-[13px] font-semibold px-5 py-2.5 rounded-xl">
            {t("AboutPage.AboutCTA.btnPrimary")}
          </button>
        </Link>

        {/* لینک سیستم رزرواسیون یا تماس */}
        <Link href={`/${locale}/booking`} className="w-full sm:w-auto">
          <button type="button" className="w-full bg-transparent border border-white/20 hover:bg-white/5 transition-colors text-[#e8e6e3] text-[13px] px-5 py-2.5 rounded-xl">
            {t("AboutPage.AboutCTA.btnSecondary")}
          </button>
        </Link>
      </div>
    </div>
  );
}