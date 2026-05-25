'use client';

import { useTranslate } from '@/hooks/useTranslate';
import { useState, useEffect } from 'react';

export default function LanguageSwitcher({ locale: initialLocale }: { locale: string }) {
  const { changeLanguage } = useTranslate();
  const [currentLocale, setCurrentLocale] = useState(initialLocale);

  useEffect(() => {
    setCurrentLocale(initialLocale);
  }, [initialLocale]);

  const handleSwitch = (newLocale: string) => {
    setCurrentLocale(newLocale);
    changeLanguage(newLocale);
  };

  return (
    <div className="flex items-center gap-1 text-sm select-none">
      <button
        onClick={() => handleSwitch('fa')}
        className={`px-2 py-1 rounded transition-colors cursor-pointer ${
          currentLocale === 'fa' ? 'bg-white/20 text-white' : 'text-gray-400 hover:text-white'
        }`}
      >
        FA
      </button>
      <span className="text-gray-600">|</span>
      <button
        onClick={() => handleSwitch('en')}
        className={`px-2 py-1 rounded transition-colors cursor-pointer ${
          currentLocale === 'en' ? 'bg-white/20 text-white' : 'text-gray-400 hover:text-white'
        }`}
      >
        EN
      </button>
    </div>
  );
}