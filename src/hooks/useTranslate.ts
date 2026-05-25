'use client';

import { usePathname, useRouter } from 'next/navigation';
import { useState, useEffect, useCallback } from 'react';

export function useTranslate() {
  const pathname = usePathname();
  const router = useRouter();
  const [locale, setLocale] = useState('fa');
  const [dictionary, setDictionary] = useState<any>({});
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const currentLocale = pathname.split('/')[1] || 'fa';
    setLocale(currentLocale);

    import(`../../messages/${currentLocale}.json`)
      .then((module) => setDictionary(module.default || module))
      .catch(() =>
        import('../../messages/fa.json').then((m) => setDictionary(m.default || m))
      );
  }, [pathname]);

  const t = useCallback(
    (key: string): string => {
      if (!dictionary) return key;
      return key.split('.').reduce((obj: any, k: string) => obj?.[k], dictionary) || key;
    },
    [dictionary]
  );

  const changeLanguage = useCallback(
    (newLocale: string) => {
      const pathWithoutLocale = pathname.replace(/^\/(fa|en)/, '') || '/';
      document.cookie = `lang=${newLocale};path=/;max-age=31536000;SameSite=Lax`;
      localStorage.setItem('lang', newLocale);
      router.push(`/${newLocale}${pathWithoutLocale}`);
      router.refresh();
    },
    [pathname, router]
  );

  return { locale, t, changeLanguage, mounted };
}