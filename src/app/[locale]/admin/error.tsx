'use client';

import { useEffect } from 'react';

export default function AdminError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('[admin error boundary]', error);
  }, [error]);

  return (
    <div dir="rtl" className="flex flex-col items-center justify-center min-h-[60vh] gap-5 px-6">
      <div className="w-14 h-14 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center">
        <span className="text-2xl leading-none">⚠</span>
      </div>

      <div className="text-center max-w-lg">
        <h2 className="text-xl font-bold text-white mb-2">
          خطا در بارگذاری اطلاعات
        </h2>
        <p className="text-sm text-gray-400 leading-relaxed">
          ارتباط با دیتابیس برقرار نشد یا بیش از حد طول کشید. این معمولاً به خاطر
          cold start سرور دیتابیس است.
        </p>
      </div>

      <div className="w-full max-w-lg rounded-xl border border-white/5 bg-[#0d0d12]/80 p-4">
        <p className="text-xs text-gray-500 mb-1.5">جزئیات فنی:</p>
        <code className="text-xs text-red-300/90 break-all block leading-relaxed">
          {error.message || 'Unknown error'}
        </code>
        {error.digest && (
          <p className="text-[11px] text-gray-600 mt-2">digest: {error.digest}</p>
        )}
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={reset}
          className="px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-sm font-medium transition-all duration-200 shadow-[0_0_20px_rgba(147,51,234,0.25)]"
        >
          تلاش دوباره
        </button>
        <button
          onClick={() => window.location.reload()}
          className="px-5 py-2.5 rounded-xl border border-white/10 hover:bg-white/5 text-gray-300 text-sm font-medium transition-all duration-200"
        >
          بارگذاری مجدد صفحه
        </button>
      </div>
    </div>
  );
}
