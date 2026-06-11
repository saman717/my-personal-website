import React from "react";
import { getDictionary } from "@/lib/translate"; // 🌟 لود مستقیم فایلهای JSON در سرور

interface ValueItem {
  icon: string;
  title: string;
  desc: string;
  color: string;
}

interface ValuesSectionProps {
  locale: string;
}

export default async function ValuesSection({ locale }: ValuesSectionProps) {
  // ۱. دریافت فایل دیکشنری مستقیم در لایه سرور
  const dict = await getDictionary(locale as "fa" | "en");

  // ۲. تابع دسترسی ایمن به کلیدهای تو در تو (Dot Notation)
  const t = (key: string) => {
    return key.split(".").reduce((obj: any, k: string) => obj?.[k], dict);
  };

  // ۳. استخراج آرایه با در نظر گرفتن لایه دفاعی آرایه خالی (Error/Fault Tolerance)
  const items = (t("AboutPage.ValuesSection.items") as ValueItem[]) || [];

  // نگاشت استایل‌های رنگی نئون متناسب با متغیر سروری
  const colorStyles = {
    purple: "bg-purple-500/10 border-purple-500/25 text-purple-400",
    emerald: "bg-emerald-500/10 border-emerald-500/25 text-emerald-400",
    blue: "bg-blue-500/10 border-blue-500/25 text-blue-400",
  };

  return (
    <div className="bg-white/5 border border-white/10 rounded-2xl p-6 md:p-8 transition-all hover:bg-white/[0.07]">
      {/* برچسب فوقانی */}
      <div className="text-[11px] tracking-[0.12em] text-gray-500 uppercase mb-2">
        {t("AboutPage.ValuesSection.label") || "MY APPROACH"}
      </div>

      {/* عنوان اصلی کامپوننت */}
      <h2 className="text-lg md:text-xl font-bold text-[#f4f3f0] mb-6">
        {t("AboutPage.ValuesSection.titleNormal")}{" "}
        <span className="text-purple-400">{t("AboutPage.ValuesSection.titleHighlight")}</span>
      </h2>

      {/* رندر کردن لیست ارزش‌ها به صورت SSR */}
      <div className="flex flex-col gap-6">
        {Array.isArray(items) && items.map((item, i) => (
          <div key={i} className="flex gap-4 items-start">
            {/* باکس آیکون با استایل داینامیک رنگی دریافت شده از سرور */}
            <div className={`shrink-0 w-10 h-10 rounded-xl flex items-center justify-center text-lg border ${colorStyles[item.color as keyof typeof colorStyles] || colorStyles.purple
              }`}>
              {item.icon}
            </div>

            <div>
              <div className="text-[14px] font-medium text-[#f4f3f0] mb-1">
                {item.title}
              </div>
              <div className="text-[13px] text-gray-400 leading-relaxed">
                {item.desc}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}