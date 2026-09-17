import Footer from '@/components/layout/footer/Footer';
import Header from '@/components/layout/Header/Header';
import { ToastProvider } from '@/context/ToastContext';
import { PersonJsonLd } from '@/components/seo/JsonLd';
import { Suspense } from 'react';
import NavigationProgress from '@/components/Ui/NavigationProgress';
import type { Metadata } from 'next';

const SITE_URL = 'https://samankhoshnoud.ir';

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const canonical = `${SITE_URL}/${locale}`;

  return {
    alternates: {
      canonical,
      languages: {
        'fa-IR': `${SITE_URL}/fa`,
        'en-US': `${SITE_URL}/en`,
        'x-default': `${SITE_URL}/fa`,
      },
    },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const isRTL = locale === 'fa';

  return (
    <div dir={isRTL ? 'rtl' : 'ltr'} lang={locale} className="flex flex-col min-h-screen">
      <PersonJsonLd locale={locale} />
      <Suspense fallback={null}>
        <NavigationProgress />
      </Suspense>
      <Header locale={locale} />
      <ToastProvider>
        <main className="flex-1">{children}</main>
      </ToastProvider>
      <Footer locale={locale} />
    </div>
  );
}