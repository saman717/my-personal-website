import { getDictionary } from "@/lib/translate"; // 🌟 لود مستقیم فایلهای JSON در سرور

interface StatItem {
  num: string;
  label: string;
}

interface StatsRowProps {
  locale: string;
}

export default async function StatsRow({ locale }: StatsRowProps) {
  // ۱. دریافت فایل دیکشنری مستقیم در لایه سرور
  const dict = await getDictionary(locale as "fa" | "en");

  // ۲. تابع باز کردن مسیرهای تو در تو به صورت کاملاً ایمن (جلوگیری از کرش صفحه)
  const t = (key: string) => {
    return key.split(".").reduce((obj: any, k: string) => obj?.[k], dict);
  };

  // ۳. دریافت آرایه استاتیک؛ اگر به هر دلیلی فایل ناقص بود، یک آرایه خالی پاس داده می‌شود
  const stats = (t("AboutPage.StatsRow.items") as StatItem[]) || [];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {Array.isArray(stats) && stats.map((stat, i) => (
        <div
          key={i}
          className="bg-white/2 border border-white/5 rounded-3xl p-8 text-center transition-all hover:bg-white/5 hover:-translate-y-1"
        >
          {/* نمایش شماره دستاورد با گرادیان نئونی و کاملاً SSR شده */}
          <div className="text-5xl md:text-6xl text-transparent bg-clip-text bg-linear-to-br from-white to-gray-500 mb-3">
            {stat.num}
          </div>

          <div className="text-sm md:text-base font-medium text-gray-400 uppercase tracking-wide">
            {stat.label}
          </div>
        </div>
      ))}
    </div>
  );
}