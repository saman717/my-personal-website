'use client';

import { useState, useTransition } from 'react';

export default function AdminLoginPage() {
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    startTransition(async () => {
      try {
        const res = await fetch('/api/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ password }),
        });

        if (res.ok) {
          // full reload — اطمینان از اینکه کوکی قبل از navigation آماده‌ست
          const locale = window.location.pathname.startsWith('/en') ? 'en' : 'fa';
          const params = new URLSearchParams(window.location.search);
          const from = params.get('from');
          // اگه قبلاً داشت میرفت یه جایی، برگرد همونجا؛ وگرنه dashboard
          window.location.href = from ?? `/${locale}/admin`;
        } else {
          const data = await res.json().catch(() => ({}));
          setError(data.error ?? 'رمز عبور اشتباه است');
        }
      } catch {
        setError('خطا در ارتباط با سرور');
      }
    });
  }

  return (
    <div
      dir="rtl"
      className="min-h-screen bg-[#09090f] flex items-center justify-center px-4"
    >
      {/* Background glow */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-purple-600/5 rounded-full blur-[120px]" />
      </div>

      <div className="w-full max-w-sm relative">
        <div className="rounded-2xl border border-white/[0.06] bg-[#0d0d12]/80 backdrop-blur-xl p-8 shadow-2xl">

          {/* Icon + Title */}
          <div className="flex flex-col items-center gap-3 mb-8">
            <div className="w-12 h-12 rounded-2xl bg-purple-600/20 border border-purple-500/20 flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-purple-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
              </svg>
            </div>
            <div className="text-center">
              <h1 className="text-lg font-bold text-white">ورود به پنل ادمین</h1>
              <p className="text-xs text-gray-500 mt-1">samankhoshnoud.ir</p>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-gray-400">رمز عبور</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="رمز عبور ادمین را وارد کنید"
                autoFocus
                required
                disabled={isPending}
                className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-4 py-3 text-sm text-gray-200 placeholder:text-gray-600 focus:outline-none focus:border-purple-500/50 focus:bg-white/[0.05] transition-all disabled:opacity-50"
              />
            </div>

            {error && (
              <div className="flex items-center gap-2 px-3 py-2.5 rounded-xl bg-red-500/10 border border-red-500/20 text-xs text-red-400">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
                </svg>
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={isPending || !password}
              className="flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-purple-600/80 hover:bg-purple-600 text-white text-sm font-medium transition-all disabled:opacity-40 disabled:cursor-not-allowed mt-1"
            >
              {isPending ? (
                <>
                  <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                  </svg>
                  در حال ورود...
                </>
              ) : (
                <>
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/>
                    <polyline points="10 17 15 12 10 7"/>
                    <line x1="15" y1="12" x2="3" y2="12"/>
                  </svg>
                  ورود
                </>
              )}
            </button>
          </form>
        </div>

        <p className="text-center text-xs text-gray-700 mt-4">فقط برای استفاده مدیر سایت</p>
      </div>
    </div>
  );
}
