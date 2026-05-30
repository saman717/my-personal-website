import { getContactMessages } from "@/actions/messages";

export default async function AdminPage() {
  // 🛰️ فراخوانی مستقیم اکشن در یک Server Component
  const result = await getContactMessages();

  if (result.success) {
    // این لاگ مستقیم در ترمینال VS Code چاپ می‌شود، نه مروگر!
    console.log("🍏 Successfully fetched messages from DB:", result.data);
  } else {
    console.error("🍎 Failed to fetch:", result.error);
  }

  return (
    <div className="min-h-screen text-white p-10 flex flex-col gap-4">
      <h1 className="text-2xl font-bold text-emerald-400">تست اولیه پنل مدیریت</h1>
      <p className="text-gray-400 text-sm">
        اگر دیتابیس وصل باشد، لیست پیام‌ها را همین الان در ترمینال VS Code می‌بینی.
      </p>
      
      {/* نمایش متنیِ تعداد پیام‌ها برای اطمینان در مرورگر */}
      <div className="p-4 bg-white/5 border border-white/10 rounded-xl max-w-md">
        تعداد پیام‌های یافت شده: <span className="text-emerald-400 font-bold">{result.data?.length || 0}</span>
      </div>
    </div>
  );
}