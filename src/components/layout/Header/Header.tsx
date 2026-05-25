import { t } from '@/lib/translate';
import Link from 'next/link';
import LanguageSwitcher from './LanguageSwitcher';
import MobileMenu from './MobileMenu';
export default async function Header({ locale }: { locale: string }) {
  const navItems = [
    { key: 'home', href: '/' },
    { key: 'about', href: '/about' },
    { key: 'services', href: '/services' },
    { key: 'portfolio', href: '/portfolio' },
    { key: 'blog', href: '/blog' },
    { key: 'contact', href: '/contact' },
    { key: 'appointment', href: '/appointment' },
  ];

  const navItemsTranslated = await Promise.all(
    navItems.map(async (item) => ({
      ...item,
      label: await t(locale, `header.${item.key}`),
    }))
  );

  const downloadLabel = await t(locale, 'header.download_resume');

  return (
    <header className="w-full sticky top-0 z-50 bg-[#1E1E24]/70 backdrop-blur-3xl shadow-lg shadow-black/20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Brand */}
          <Link
            href={`/${locale}`}
            className="text-white text-xl font-bold tracking-wide hover:text-gray-300 transition-colors shrink-0"
          >
            {locale === 'fa' ? 'سامان خوشنود' : 'Saman Khoshnood'}
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-8">
            {navItemsTranslated.map((item) => (
              <Link
                key={item.key}
                href={`/${locale}${item.href === '/' ? '' : item.href}`}
                className="text-gray-300 hover:text-white transition-colors text-sm font-medium"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-4">
            <LanguageSwitcher locale={locale} />
            <Link
              href="/resume.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden md:inline-flex bg-[#E0E0E0] text-[#1E1E24] px-6 py-2.5 rounded-lg font-medium text-sm hover:bg-white transition-all duration-300 shadow-sm hover:shadow-md"
            >
              {downloadLabel}
            </Link>
            <MobileMenu items={navItemsTranslated} locale={locale} />
          </div>
        </div>
      </div>
    </header>
  );
}