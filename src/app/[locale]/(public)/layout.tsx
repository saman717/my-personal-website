import Footer from '@/components/layout/footer/Footer';
import Header from '@/components/layout/Header/Header';
import { ToastProvider } from "@/context/ToastContext";


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
    <div dir={isRTL ? 'rtl' : 'ltr'} className="flex flex-col min-h-screen">
      <Header locale={locale} />
      <ToastProvider>
        <main className="flex-1">{children}</main>
      </ToastProvider>
      <Footer locale={locale} />
    </div>
  );
}