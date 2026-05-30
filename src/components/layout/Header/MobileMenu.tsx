'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface NavItem {
  href: string;
  label: string;
}

export default function MobileMenu({items,locale,}: {items: NavItem[];locale: string;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false); // در حال انیمیشن (ورود یا خروج)
  const [animationClass, setAnimationClass] = useState(''); // کلاس‌های انیمیشن فعلی
  const pathname = usePathname();
  const animTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // پاک‌سازی timeout
  useEffect(() => {
    return () => {
      if (animTimeoutRef.current) clearTimeout(animTimeoutRef.current);
    };
  }, []);

  // مدیریت انیمیشن
  useEffect(() => {
    if (animTimeoutRef.current) clearTimeout(animTimeoutRef.current);

    if (isOpen) {
      // باز کردن: المنت باید با کلاس شروع (opacity-0) در DOM ظاهر بشه، سپس بلافاصله کلاس پایان رو می‌دیم
      setIsAnimating(true);
      setAnimationClass('opacity-0 -translate-y-2'); // شروع خاموش
      
      // یک فریم صبر می‌کنیم تا مرورگر کلاس شروع رو اعمال کنه، سپس کلاس پایان
      animTimeoutRef.current = setTimeout(() => {
        setAnimationClass('opacity-100 translate-y-0');
      }, 10);
    } else {
      // بستن: کلاس خروج رو اضافه می‌کنیم و بعد از انیمیشن المنت رو غیرقابل نمایش می‌کنیم
      if (isAnimating) {
        setAnimationClass('opacity-0 -translate-y-2');
        animTimeoutRef.current = setTimeout(() => {
          setIsAnimating(false); // پایان انیمیشن خروج، المنت مخفی میشه
          setAnimationClass('');
        }, 200);
      }
    }
  }, [isOpen, isAnimating]);

  const handleClose = useCallback(() => {
    setIsOpen(false);
  }, []);

  // بستن با Escape
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) setIsOpen(false);
    };
    if (isOpen) document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen]);

  // قفل اسکرول
  useEffect(() => {
    document.body.style.overflow = isAnimating ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [isAnimating]);

  return (
    <div className="md:hidden">
      {/* دکمه همبرگر */}
      <button
        onClick={() => setIsOpen((prev) => !prev)}
        className="relative z-50 text-white min-w-[44px] min-h-[44px] p-2 flex items-center justify-center rounded-lg select-none hover:bg-white/10 transition-colors"
        type="button"
        aria-label={isOpen ? 'بستن منو' : 'باز کردن منو'}
        aria-expanded={isOpen}
        style={{ WebkitTapHighlightColor: 'transparent', touchAction: 'manipulation' }}
      >
        <svg className="w-6 h-6 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          {isOpen ? (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          ) : (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          )}
        </svg>
      </button>

      {/* منو (فقط وقتی در حال انیمیشن هست یا بازه نمایش داده بشه) */}
      {isAnimating && (
        <>
          {/* بک‌دراپ */}
          <div
            className={`fixed inset-0 z-40 bg-black/50 backdrop-blur-sm transition-opacity duration-200 ${
              animationClass.includes('opacity-100') ? 'opacity-100' : 'opacity-0'
            }`}
            onClick={handleClose}
            style={{ WebkitTapHighlightColor: 'transparent' }}
          />

          {/* منوی اصلی */}
          <div
            className={`fixed top-20 left-0 right-0 z-50 w-full bg-[#1E1E24] border-t border-white/10 shadow-2xl shadow-black/50 transition-all duration-200 ease-out transform ${animationClass}`}
          >
            <div className="container mx-auto px-4 sm:px-6 py-4">
              <nav className="flex flex-col gap-1">
                {items.map((item) => {
                  const href = `/${locale}${item.href === '/' ? '' : item.href}`;
                  const isActive =
                    pathname === href ||
                    (item.href !== '/' && pathname.startsWith(`/${locale}${item.href}`));

                  return (
                    <Link
                      key={item.href}
                      href={href}
                      onClick={handleClose}
                      className={`px-4 py-3 rounded-lg text-sm font-medium min-h-[44px] flex items-center ${
                        isActive
                          ? 'bg-white/10 text-white'
                          : 'text-gray-300 hover:bg-white/5 hover:text-white'
                      } transition-colors`}
                      style={{ WebkitTapHighlightColor: 'transparent', touchAction: 'manipulation' }}
                    >
                      {item.label}
                    </Link>
                  );
                })}
                <div className="border-t border-white/10 my-2" />
                <Link
                  href="/resume.pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={handleClose}
                  className="px-4 py-3 rounded-lg text-sm font-medium text-center min-h-[44px] flex items-center justify-center bg-[#E0E0E0] text-[#1E1E24] hover:bg-white transition-colors"
                  style={{ WebkitTapHighlightColor: 'transparent', touchAction: 'manipulation' }}
                >
                  {locale === 'fa' ? 'دانلود رزومه' : 'Download Resume'}
                </Link>
              </nav>
            </div>
          </div>
        </>
      )}
    </div>
  );
}