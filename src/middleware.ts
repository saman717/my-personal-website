import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifySessionToken, SESSION_COOKIE } from '@/lib/auth';

const locales = ['fa', 'en'];
const defaultLocale = 'fa';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // ─── ۱. Locale Redirect ───────────────────────────────────────────────────
  const pathnameIsMissingLocale = locales.every(
    (locale) => !pathname.startsWith(`/${locale}/`) && pathname !== `/${locale}`
  );

  if (pathnameIsMissingLocale) {
    const newUrl = new URL(`/${defaultLocale}${pathname}`, request.url);
    return NextResponse.redirect(newUrl, 301);
  }

  // ─── ۲. Admin Auth Guard ─────────────────────────────────────────────────
  // تشخیص مسیر ادمین
  const isAdminPath = locales.some((locale) =>
    pathname.startsWith(`/${locale}/admin`)
  );

  if (isAdminPath) {
    // صفحه login خودش محافظ ندارد
    const isLoginPage = locales.some(
      (locale) => pathname === `/${locale}/admin/login`
    );

    const token = request.cookies.get(SESSION_COOKIE)?.value;
    const isAuthenticated = token ? await verifySessionToken(token) : false;

    if (!isLoginPage && !isAuthenticated) {
      // بدون توکن معتبر → ریدایرکت به login
      const locale =
        locales.find((l) => pathname.startsWith(`/${l}/`)) ?? defaultLocale;
      const loginUrl = new URL(`/${locale}/admin/login`, request.url);
      // نگه‌داشتن مسیر اصلی برای redirect بعد از login (اختیاری)
      loginUrl.searchParams.set('from', pathname);
      return NextResponse.redirect(loginUrl);
    }

    if (isLoginPage && isAuthenticated) {
      // قبلاً لاگین شده → ریدایرکت به dashboard
      const locale =
        locales.find((l) => pathname.startsWith(`/${l}/`)) ?? defaultLocale;
      return NextResponse.redirect(new URL(`/${locale}/admin`, request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
