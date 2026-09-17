import { PersonJsonLd } from '@/components/seo/JsonLd';

type Props = { params: Promise<{ locale: string }> };

export default async function Head({ params }: Props) {
  const { locale } = await params;
  return <PersonJsonLd locale={locale} />;
}