import { getDictionary } from "@/lib/translate"; // 🌟 تابع لوکال شما برای خواندن فایلهای JSON در سرور

interface SkillsDeepProps {
  locale: string; // 🌟 مقدار لوکال را از کامپوننت پدر (AboutPage) می‌گیریم
}

export default async function SkillsDeep({ locale }: { locale: string }) {
  // ۱. دریافت فایل دیکشنری مستقیم در لایه سرور
  const dict = await getDictionary(locale);
  const t = (key: string) => key.split(".").reduce((o, i) => o?.[i], dict) || key;

  return (
    <div className="bg-white/5 border border-white/10 rounded-2xl p-6 md:p-8 transition-all hover:bg-white/[0.07]">
      {/* برچسب بخش */}
      <div className="text-[11px] tracking-[0.12em] text-gray-500 uppercase mb-2">
        {t("AboutPage.SkillsDeep.label")}
      </div>
      
      {/* عنوان اصلی کاملاً به صورت SSR رندر می‌شود */}
      <h2 className="text-lg md:text-xl font-bold text-[#f4f3f0] mb-6">
        {t("AboutPage.SkillsDeep.titleNormal")}{" "}
        <span className="text-purple-400">{t("AboutPage.SkillsDeep.titleHighlight")}</span>
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-1 gap-8">
        {/* دسته‌بندی Frontend */}
        <div>
          <div className="text-xs text-gray-500 mb-3 border-b border-white/5 pb-2">
            {t("AboutPage.SkillsDeep.categories.frontend")}
          </div>
          <div className="flex flex-col gap-3">
            <SkillBar name="React / Next.js" percent="85%" color="bg-purple-400" />
            <SkillBar name="Tailwind CSS" percent="90%" color="bg-purple-400" />
            <SkillBar name="TypeScript" percent="70%" color="bg-purple-400" />
          </div>
        </div>

        {/* دسته‌بندی Backend & SEO */}
        <div>
          <div className="text-xs text-gray-500 mb-3 border-b border-white/5 pb-2">
            {t("AboutPage.SkillsDeep.categories.backend")}
          </div>
          <div className="flex flex-col gap-3">
            <SkillBar name="Node / Prisma" percent="75%" color="bg-emerald-400" />
            <SkillBar name="Technical SEO" percent="80%" color="bg-emerald-400" />
            <SkillBar name="Content Strategy" percent="85%" color="bg-emerald-400" />
          </div>
        </div>
      </div>
    </div>
  );
}

// این کامپوننت داخلی هم به صورت Server Component رندر می‌شود چون نیازی به استیت ندارد
function SkillBar({ name, percent, color }: { name: string; percent: string; color: string }) {
  return (
    <div className="flex justify-between items-center">
      <span className="text-[13px] text-gray-300">{name}</span>
      <div className="w-20 h-1 bg-white/10 rounded-full overflow-hidden">
        <div className={`h-full rounded-full ${color}`} style={{ width: percent }}></div>
      </div>
    </div>
  );
}