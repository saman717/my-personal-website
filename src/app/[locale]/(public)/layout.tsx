import Header from '@/components/layout/Header/Header';

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params:Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const isRTL = locale === 'fa';

  return (
    <div dir={isRTL ? 'rtl' : 'ltr'} className="flex flex-col min-h-screen">
      <Header locale={locale} />
      <main className="flex-1">{children}</main>
    </div>
  );
}