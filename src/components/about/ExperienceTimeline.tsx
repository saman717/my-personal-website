import React from "react";
import { getDictionary } from "@/lib/translate"; // 🌟 لود مستقیم فایلهای JSON در سرور

interface TimelineItem {
  title: string;
  date: string;
  desc: string;
  color: string;
}

interface ExperienceTimelineProps {
  locale: string;
}

export default async function ExperienceTimeline({ locale }: ExperienceTimelineProps) {
  const isRTL = locale === "fa";

  // ۱. خواندن فایل زبان از دیسک سرور
  const dict = await getDictionary(locale as "fa" | "en");

  // ۲. متدهای استخراج داده‌ها و آرایه‌ها از ساختار نئون JSON
  const t = (key: string) => key.split(".").reduce((obj: any, k: string) => obj?.[k], dict) || key;
  const items: TimelineItem[] = t("AboutPage.ExperienceTimeline.items") as unknown as TimelineItem[];

  return (
    <div className="bg-white/5 border border-white/10 rounded-2xl p-6 md:p-8 transition-all hover:bg-white/[0.07]">
      {/* برچسب بخش ناوبری زمانی */}
      <div className="text-[11px] tracking-[0.12em] text-gray-500 uppercase mb-2">
        {t("AboutPage.ExperienceTimeline.label")}
      </div>

      <h2 className="text-lg md:text-xl font-bold text-[#f4f3f0] mb-8">
        {t("AboutPage.ExperienceTimeline.titleNormal")}{" "}
        <span className="text-purple-400">{t("AboutPage.ExperienceTimeline.titleHighlight")}</span>
      </h2>

      <div className="relative">
        {/* خط تایم‌لاین (کاملاً منطبق با جهت‌های LTR و RTL تقویم‌ها) */}
        <div className={`absolute top-2 bottom-0 w-px bg-purple-400/20 ${isRTL ? "right-1.5" : "left-1.5"}`}></div>

        <div className="flex flex-col gap-8">
          {Array.isArray(items) && items.map((item, i) => (
            <div key={i} className="flex gap-4 items-start relative z-10">
              {/* نشانگر رنگی وضعیت دوره */}
              <div className={`mt-1.5 shrink-0 w-3.5 h-3.5 rounded-full border-2 border-[#0d0d0f] ${item.color === "purple"
                ? "bg-purple-400 outline-2 outline-purple-400/40"
                : "bg-indigo-600"
                }`}></div>

              <div className="flex-1">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-1.5 gap-2">
                  <span className="text-[14px] font-medium text-[#f4f3f0]">{item.title}</span>
                  <span className="inline-block text-[10px] bg-purple-400/10 text-purple-400 rounded-md px-2 py-0.5 w-max">
                    {item.date}
                  </span>
                </div>
                <p className="text-xs text-gray-400 leading-relaxed">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}