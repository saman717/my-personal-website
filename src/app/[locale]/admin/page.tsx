import Link from 'next/link';

const sections = [
  {
    href: 'portfolio',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <rect x="3" y="3" width="7" height="7" rx="1" />
        <rect x="14" y="3" width="7" height="7" rx="1" />
        <rect x="3" y="14" width="7" height="7" rx="1" />
        <rect x="14" y="14" width="7" height="7" rx="1" />
      </svg>
    ),
    label: 'نمونه کارها',
    desc: 'مدیریت پروژه‌ها و نمونه کارها',
    color: 'from-purple-600/20 to-purple-600/5 border-purple-500/20 hover:border-purple-500/40',
    dot: 'bg-purple-500',
  },
  {
    href: 'messages',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
      </svg>
    ),
    label: 'پیام‌ها',
    desc: 'مشاهده و پاسخ به پیام‌های کاربران',
    color: 'from-blue-600/20 to-blue-600/5 border-blue-500/20 hover:border-blue-500/40',
    dot: 'bg-blue-500',
  },
  {
    href: 'bookings',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
        <line x1="16" y1="2" x2="16" y2="6" />
        <line x1="8" y1="2" x2="8" y2="6" />
        <line x1="3" y1="10" x2="21" y2="10" />
      </svg>
    ),
    label: 'رزروها',
    desc: 'مدیریت وقت‌های رزرو شده',
    color: 'from-emerald-600/20 to-emerald-600/5 border-emerald-500/20 hover:border-emerald-500/40',
    dot: 'bg-emerald-500',
  },
  {
    href: 'tasks',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <polyline points="9 11 12 14 22 4" />
        <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
      </svg>
    ),
    label: 'وظایف',
    desc: 'پیگیری وظایف و کارهای جاری',
    color: 'from-amber-600/20 to-amber-600/5 border-amber-500/20 hover:border-amber-500/40',
    dot: 'bg-amber-500',
  },
];

export default function AdminDashboardPage({
  params,
}: {
  params: Promise<{ locale: string }> | { locale: string };
}) {
  // params may be a Promise in Next.js 15 — handle both
  // Note: this is a server component; locale extracted at runtime
  return (
    <AdminDashboard />
  );
}

function AdminDashboard() {
  return (
    <div className="flex flex-col gap-8" dir="rtl">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white">داشبورد</h1>
        <p className="text-sm text-gray-500 mt-1">خوش آمدید به پنل مدیریت</p>
      </div>

      {/* Quick nav cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {sections.map((s) => (
          <Link
            key={s.href}
            href={s.href}
            className={`group relative flex items-center gap-4 p-5 rounded-2xl border bg-gradient-to-br ${s.color} transition-all duration-300`}
          >
            {/* Active indicator */}
            <span className={`absolute top-3.5 left-3.5 w-1.5 h-1.5 rounded-full ${s.dot} opacity-60 group-hover:opacity-100 transition-opacity`} />

            {/* Icon */}
            <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-white/5 border border-white/5 flex items-center justify-center text-gray-300 group-hover:text-white transition-colors">
              {s.icon}
            </div>

            {/* Text */}
            <div>
              <p className="text-sm font-semibold text-gray-200 group-hover:text-white transition-colors">{s.label}</p>
              <p className="text-xs text-gray-500 mt-0.5">{s.desc}</p>
            </div>

            {/* Arrow */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-4 h-4 text-gray-600 group-hover:text-gray-400 transition-colors mr-auto flex-shrink-0 rotate-180"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </Link>
        ))}
      </div>

      {/* Footer note */}
      <p className="text-xs text-gray-700 text-center mt-4">
        سایت شخصی سامان خوشنود · پنل مدیریت
      </p>
    </div>
  );
}
