"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { LuMenu, LuLogOut, LuLoaderCircle } from 'react-icons/lu';
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
          <LuMenu size={24} />
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
          {isPending ? <LuLoaderCircle size={14} className="animate-spin" /> : <LuLogOut size={14} />}
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
