const dictionaries: Record<string, () => Promise<any>> = {
  fa: () => import('../../messages/fa.json').then((m) => m.default || m),
  en: () => import('../../messages/en.json').then((m) => m.default || m),
};

export async function getDictionary(locale?: string) {
  // اگر locale وجود نداشت یا ناشناخته بود، فارسی برگردون
  if (!locale || !['fa', 'en'].includes(locale.split('-')[0])) {
    locale = 'fa';
  }
  const cleanLocale = locale.split('-')[0];
  const loadDictionary = dictionaries[cleanLocale] || dictionaries.fa;
  return loadDictionary();
}

export async function t(locale: string, key: string): Promise<string> {
  const dict = await getDictionary(locale);
  return key.split('.').reduce((obj: any, k: string) => obj?.[k], dict) || key;
}