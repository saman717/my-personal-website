"use client";

import { usePathname, useRouter } from "next/navigation";

interface LanguageSwitcherProps {
  locale: string;
  onChange: (newLocale: string) => void;
}

export default function LanguageSwitcher({ locale, onChange }: LanguageSwitcherProps) {
  const pathname = usePathname();

  const router = useRouter();

  const activeLocale =
    pathname.split("/")[1] || "fa";

  const handleSwitch = (
    newLocale: string
  ) => {
    if (newLocale === activeLocale) {
      return;
    }

    const segments =
      pathname.split("/");

    segments[1] = newLocale;

    const newPath =
      segments.join("/");

    router.push(newPath);
  };

  return (
    <div
      className="flex items-center bg-white/5 border border-white/5 p-1 rounded-xl text-xs font-mono"
      dir="ltr"
    >
      <button
        type="button"
        onClick={() =>
          handleSwitch("en")
        }
        className={`px-3 py-1 rounded-lg transition-all duration-200 cursor-pointer ${activeLocale === "en"
            ? "bg-blue-500/10 border border-blue-500/20 text-blue-400 shadow-[0_0_10px_rgba(59,130,246,0.15)] font-bold"
            : "text-gray-500 hover:text-white"
          }`}
      >
        EN
      </button>

      <button
        type="button"
        onClick={() =>
          handleSwitch("fa")
        }
        className={`px-3 py-1 rounded-lg transition-all duration-200 cursor-pointer ${activeLocale === "fa"
            ? "bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 shadow-[0_0_10px_rgba(16,185,129,0.15)] font-bold"
            : "text-gray-500 hover:text-white"
          }`}
      >
        FA
      </button>
    </div>
  );
}