import { PersonJsonLd } from '@/components/seo/JsonLd';

export default async function PublicLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  return (
    <>
      <PersonJsonLd locale={locale} />
      {children}
    </>
  );
}