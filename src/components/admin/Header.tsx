"use client";

import Image from "next/image";
import { TimeDisplay } from "@/hooks/useTimeHeader";
import LanguageSwitcher from "@/components/layout/Header/LanguageSwitcher";

// 🌟 اضافه شدن labels به Interface
interface HeaderProps {
  locale: string;
  onMenuToggle: () => void;
  labels: any; 
}

export default function Header({ locale, onMenuToggle, labels }: HeaderProps) {
  // دیگر نیازی به useRouter، usePathname و توابع اضافی در این فایل نیست

  return (
    <header className="relative h-20 bg-[#0d0d12]/30 border-b border-white/5 backdrop-blur-xl px-4 md:px-10 flex items-center justify-between z-30 flex-shrink-0">

      {/* Mobile Actions */}
      <div className="flex items-center gap-4">

        {/* Mobile Menu Button */}
        <button
          type="button"
          onClick={onMenuToggle}
          className="md:hidden p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h16m-7 6h7"
            />
          </svg>
        </button>

        {/* Language Switcher */}
        {/* نکته: اگر LanguageSwitcher هم نیاز به ترجمه دارد، باید بررسی شود */}
        <LanguageSwitcher />
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-4">

        {/* User Info */}
        <div className="hidden md:flex flex-col items-end">
          <span className="text-[10px] text-gray-500 tracking-wider">
            MOHAMAD.KHOSHNOOD.10@GMAIL.COM
          </span>

          <h2 className="text-sm font-bold text-white">
            {labels.welcome} {/* 🌟 خواندن مستقیم از Prop */}
          </h2>

          <div className="text-[10px] text-gray-400">
            <TimeDisplay locale={locale} />
          </div>

        </div>

        {/* Avatar */}
        <div className="relative w-10 h-10 rounded-full border border-emerald-500/30 overflow-hidden">
          <Image
            src="/mohhamad-khoshnood-avatar.png"
            alt="Avatar"
            fill
            className="object-cover"
          />
        </div>
      </div>
    </header>
  );
}