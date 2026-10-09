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
    // ⚠️ 307 نه 301 — مرورگر 301 را برای همیشه cache می‌کند و اگر یک‌بار
    // ریدایرکت اشتباه بخورد، کاربر تا پاک‌کردن کل cache گیر می‌افتد.
    return NextResponse.redirect(newUrl, 307);
  }

  // ─── ۲. Admin Auth Guard ─────────────────────────────────────────────────
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
      const locale =
        locales.find((l) => pathname.startsWith(`/${l}/`)) ?? defaultLocale;
      const loginUrl = new URL(`/${locale}/admin/login`, request.url);
      loginUrl.searchParams.set('from', pathname);
      return NextResponse.redirect(loginUrl);
    }

    if (isLoginPage && isAuthenticated) {
      const locale =
        locales.find((l) => pathname.startsWith(`/${l}/`)) ?? defaultLocale;
      return NextResponse.redirect(new URL(`/${locale}/admin`, request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    // کل _next مستثنی شود (نه فقط _next/static و _next/image) —
    // وگرنه مسیرهایی مثل /_next/data/... ریدایرکت به /fa/_next/... می‌خورند و 404 می‌شوند.
    '/((?!api|_next|favicon.ico|robots.txt|sitemap.xml|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|txt|xml)$).*)',
  ],
};
