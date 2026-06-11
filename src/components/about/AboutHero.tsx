import React from "react";
import { getDictionary } from "@/lib/translate"; // 🌟 تابعی که فایل‌های JSON رو می‌خونه

interface AboutHeroProps {
  locale: string;
}

export default async function AboutHero({ locale }: AboutHeroProps) {
  // ۱. مستقیم فایل JSON رو از دیسک سرور لود می‌کنه (بدون ارسال متن‌ها به جاوااسکریپت مرورگر)
  const dict = await getDictionary(locale as "fa" | "en");

  // ۲. متد باز کردن ساختار تو در تو (Dot Notation)
  const t = (key: string) => {
    return key.split(".").reduce((obj: any, k: string) => obj?.[k], dict) || key;
  };

  const coreSkills = ["React", "Next.js", "Tailwind", "SEO", "TypeScript"];

  return (
    <div className="bg-white/5 border border-white/10 rounded-2xl p-6 md:p-8 flex flex-col md:flex-row gap-6 md:items-center text-center md:text-start transition-all hover:bg-white/[0.07]">
      <div className="shrink-0 mx-auto md:mx-0">
        <div className="rounded-full p-[3px] bg-gradient-to-br from-purple-400 to-blue-400">
          <div className="w-20 h-20 rounded-full bg-linear-to-br from-indigo-950 to-indigo-900 overflow-hidden">
            <img
              src="/images/Man_1.jpg"
              alt={t("AboutPage.AboutHero.name")} // 🌟 این متن الان مستقیم از JSON خونده میشه
              className="w-full h-full object-cover object-[center_30%]"
            />
          </div>
        </div>
      </div>
      <div className="flex-1">
        {/* 🌟 نام و عنوان هم مستقیم از فایل JSON میان */}
        <h1 className="text-2xl font-bold text-[#f4f3f0] mb-2">
          {t("AboutPage.AboutHero.name")}
        </h1>
        <p className="text-[13px] text-gray-400 leading-relaxed mb-4">
          {t("AboutPage.AboutHero.title")}
        </p>
        <div className="flex flex-wrap items-center justify-center md:justify-start gap-2">
          {coreSkills.map((skill) => (
            <span key={skill} className="bg-white/5 border border-white/10 rounded-lg px-3 py-1.5 text-xs text-gray-300">
              {skill}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}