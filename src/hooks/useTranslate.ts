"use client";

import { usePathname, useRouter } from "next/navigation";
import { useCallback } from "react";

export function useTranslate() {
  const pathname = usePathname();
  const router = useRouter();

  // استخراج زبان فعلی از URL (مثلاً fa یا en)
  const locale = pathname.split("/")[1] || "fa";

  // تابع تغییر زبان سایت
  const changeLanguage = useCallback(
    (newLocale: string) => {
      const pathWithoutLocale = pathname.replace(/^\/(fa|en)/, "") || "/";

      // ذخیره زبان در کوکی و لوکال استوریج
      document.cookie = `lang=${newLocale};path=/;max-age=31536000;SameSite=Lax`;
      localStorage.setItem("lang", newLocale);

      // انتقال کاربر به مسیر جدید
      router.push(`/${newLocale}${pathWithoutLocale}`);
    },
    [pathname, router]
  );

  return {
    locale,
    changeLanguage,
  };
}