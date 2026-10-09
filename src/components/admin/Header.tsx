"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { TimeDisplay } from "@/hooks/useTimeHeader";
import LanguageSwitcher from "@/components/layout/Header/LanguageSwitcher";

interface HeaderProps {
  locale: string;
  onMenuToggle: () => void;
  labels: any;
}

export default function Header({ locale, onMenuToggle, labels }: HeaderProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  function handleLogout() {
    startTransition(async () => {
      await fetch('/api/auth/logout', { method: 'POST' });
      router.push(`/${locale}/admin/login`);
      router.refresh();
    });
  }

  return (
    <header className="relative h-20 bg-[#0d0d12]/30 border-b border-white/5 backdrop-blur-xl px-4 md:px-10 flex items-center justify-between z-30 flex-shrink-0">

      {/* Left: Mobile Menu + Language */}
      <div className="flex items-center gap-4">
        <button
          type="button"
          onClick={onMenuToggle}
          className="md:hidden p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
        >
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
          </svg>
        </button>
        <LanguageSwitcher />
      </div>

      {/* Right: User Info + Logout + Avatar */}
      <div className="flex items-center gap-3">

        {/* User Info */}
        <div className="hidden md:flex flex-col items-end">
          <span className="text-[10px] text-gray-500 tracking-wider">
            MOHAMAD.KHOSHNOOD.10@GMAIL.COM
          </span>
          <h2 className="text-sm font-bold text-white">
            {labels.welcome}
          </h2>
          <div className="text-[10px] text-gray-400">
            <TimeDisplay locale={locale} />
          </div>
        </div>

        {/* Logout Button */}
        <button
          onClick={handleLogout}
          disabled={isPending}
          title="خروج از پنل"
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs text-gray-500 hover:text-red-400 hover:bg-red-500/10 border border-transparent hover:border-red-500/20 transition-all disabled:opacity-40"
        >
          {isPending ? (
            <svg className="animate-spin w-3.5 h-3.5" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
              <polyline points="16 17 21 12 16 7"/>
              <line x1="21" y1="12" x2="9" y2="12"/>
            </svg>
          )}
          <span className="hidden sm:inline">خروج</span>
        </button>

        {/* Avatar */}
        <div className="relative w-10 h-10 rounded-full border border-emerald-500/30 overflow-hidden shrink-0">
          <Image
            src="/images/MSKH.webp"
            alt="Avatar"
            fill
            sizes="40px"
            className="object-cover"
          />
        </div>
      </div>
    </header>
  );
}
