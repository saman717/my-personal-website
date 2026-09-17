import './globals.css';
import type { Metadata } from 'next';
import { Vazirmatn } from 'next/font/google';

const vazirmatn = Vazirmatn({
  subsets: ['arabic'],
  variable: '--font-vazirmatn',
  display: 'optional',
  weight: ['400', '500', '600', '700'],
});

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://samankhoshnoud.ir';

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  alternates: {
    canonical: SITE_URL,
    languages: {
      'fa-IR': `${SITE_URL}/fa`,
      'en-US': `${SITE_URL}/en`,
      'x-default': `${SITE_URL}/fa`,
    },
  },
  openGraph: {
    images: [
      {
        url: '/images/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Saman Khoshnood - Frontend Developer',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    images: ['/images/og-image.png'],
  },
  icons: {
    icon: [
      { url: '/icons/MSKH(32).webp', sizes: '32x32', type: 'image/webp' },
      { url: '/icons/MSKH(16).webp', sizes: '16x16', type: 'image/webp' },
    ],
    apple: { url: '/icons/MSKH(180).webp', sizes: '180x180', type: 'image/webp' },
    shortcut: '/icons/MSKH(32).webp',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html suppressHydrationWarning className={vazirmatn.variable}>
      <body className="font-sans">{children}</body>
    </html>
  );
}