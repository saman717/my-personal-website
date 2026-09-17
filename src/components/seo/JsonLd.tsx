export function PersonJsonLd({ locale }: { locale: string }) {
  const isPersian = locale === 'fa';

  const data = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: 'Saman Khoshnood',
    url: 'https://samankhoshnoud.ir',
    jobTitle: isPersian ? 'برنامه‌نویس فرانت‌اند' : 'Frontend Developer',
    description: isPersian
      ? 'توسعه‌دهنده وب متخصص در React، Next.js و TypeScript'
      : 'Frontend Developer specialized in React, Next.js and TypeScript',
    sameAs: [
      'https://www.linkedin.com/in/saman-khoshnoud/',
      'https://github.com/samankhoshnoud',
    ],
    knowsAbout: ['React', 'Next.js', 'TypeScript', 'Python', 'PyQt5', 'SEO', 'Supabase'],
    address: {
      '@type': 'PostalAddress',
      addressLocality: isPersian ? 'مشهد' : 'Mashhad',
      addressCountry: 'IR',
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}