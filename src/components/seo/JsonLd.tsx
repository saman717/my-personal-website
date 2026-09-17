const SITE_URL = 'https://samankhoshnoud.ir';

export function PersonJsonLd({ locale }: { locale: string }) {
    const isPersian = locale === 'fa';

    const data = {
        '@context': 'https://schema.org',
        '@type': 'Person',
        name: 'Saman Khoshnood',
        alternateName: 'سامان خوشنود',
        url: SITE_URL,
        image: `${SITE_URL}/images/MSKH.webp`,
        jobTitle: isPersian ? 'برنامه‌نویس فرانت‌اند' : 'Frontend Developer',
        description: isPersian
            ? 'توسعه‌دهنده وب متخصص در React، Next.js و TypeScript'
            : 'Frontend Developer specialized in React, Next.js and TypeScript',
        sameAs: [
            'https://www.linkedin.com/in/saman-khoshnoud/',
            'https://github.com/saman717',
        ],
        knowsAbout: ['React', 'Next.js', 'TypeScript', 'Python', 'PyQt5', 'SEO', 'Supabase'],
        address: {
            '@type': 'PostalAddress',
            addressLocality: isPersian ? 'مشهد' : 'Mashhad',
            addressCountry: 'IR',
        },
        worksFor: [
            {
                '@type': 'Organization',
                name: 'Napco',
                url: 'https://nooshinco.com',
            },
            {
                '@type': 'Organization',
                name: 'Self-employed',
            },
        ],
        mainEntityOfPage: {
            '@type': 'WebPage',
            '@id': `${SITE_URL}/${locale}`,
        },
    };

    const websiteData = {
        '@context': 'https://schema.org',
        '@type': 'WebSite',
        name: isPersian ? 'سامان خوشنود' : 'Saman Khoshnood',
        url: SITE_URL,
        inLanguage: isPersian ? 'fa-IR' : 'en-US',
        potentialAction: {
            '@type': 'SearchAction',
            target: `${SITE_URL}/fa/portfolio?q={search_term_string}`,
            'query-input': 'required name=search_term_string',
        },
    };

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
            />
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteData) }}
            />
        </>
    );
}