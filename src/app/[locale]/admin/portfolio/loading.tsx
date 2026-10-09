// این فایل رو Next.js App Router می‌بینه و وقتی page.tsx داره لود میشه
// به‌جای hang کردن، یه skeleton نشون میده — خیلی مهم برای Supabase free tier
// که بعد از بیکاری ممکنه ۳۰-۴۰ ثانیه طول بکشه تا DB بیدار بشه

export default function PortfolioAdminLoading() {
  return (
    <div className="flex flex-col gap-6 animate-pulse" dir="rtl">
      {/* Header skeleton */}
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-2">
          <div className="h-7 w-32 rounded-lg bg-white/5" />
          <div className="h-3.5 w-40 rounded-md bg-white/[0.03]" />
        </div>
        <div className="flex items-center gap-2">
          <div className="h-9 w-24 rounded-xl bg-white/5" />
          <div className="h-9 w-28 rounded-xl bg-purple-600/20" />
        </div>
      </div>

      {/* Table skeleton */}
      <div className="rounded-2xl border border-white/5 overflow-hidden bg-[#0d0d12]/60">
        {/* Head */}
        <div className="border-b border-white/5 px-5 py-3.5 flex gap-8">
          {[32, 120, 88, 72, 96, 72].map((w, i) => (
            <div key={i} className="h-3 rounded-md bg-white/[0.04]" style={{ width: w }} />
          ))}
        </div>

        {/* Rows */}
        {Array.from({ length: 5 }).map((_, rowIdx) => (
          <div
            key={rowIdx}
            className="border-b border-white/[0.03] px-5 py-4 flex items-center gap-8"
          >
            <div className="h-4 w-8 rounded bg-white/[0.04]" />
            <div className="h-4 w-32 rounded bg-white/[0.06]" />
            <div className="h-5 w-24 rounded-md bg-purple-500/[0.08]" />
            <div className="h-5 w-20 rounded-full bg-white/[0.04]" />
            <div className="h-3.5 w-28 rounded bg-white/[0.03]" />
            <div className="flex gap-2 ml-auto">
              {[16, 16, 16, 16].map((s, i) => (
                <div key={i} className="rounded-lg bg-white/[0.04]" style={{ width: s, height: s }} />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
