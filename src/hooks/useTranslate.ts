"use client";

import { usePathname, useRouter, } from "next/navigation";

import { useMemo, useCallback, } from "react";

import fa from "../../messages/fa.json";
import en from "../../messages/en.json";

const dictionaries = {
  fa,
  en,
};

export function useTranslate() {
  const pathname = usePathname();

  const router = useRouter();

  const locale = pathname.split("/")[1] || "fa";

  const dictionary = dictionaries[locale as keyof typeof dictionaries] || dictionaries.fa;

  const t = useCallback(
    (key: string): string => {
      return (
        key.split(".").reduce((obj: any, k: string) => obj?.[k],
          dictionary
        ) || key
      );
    },
    [dictionary]
  );

  const changeLanguage =
    useCallback(
      (newLocale: string) => {
        const pathWithoutLocale = pathname.replace(/^\/(fa|en)/, "") || "/";

        document.cookie = `lang=${newLocale};path=/;max-age=31536000;SameSite=Lax`;

        localStorage.setItem(
          "lang",
          newLocale
        );

        router.push(
          `/${newLocale}${pathWithoutLocale}`
        );
      },
      [pathname, router]
    );

  return {
    locale,
    t,
    changeLanguage,
  };
}