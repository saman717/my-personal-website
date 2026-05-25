import HeroSection from '@/components/home/HeroSection';

export default async function HomePage({ params }: { params: { locale: string } }) {
  const { locale } = await params;

  return <HeroSection locale={locale} />;}