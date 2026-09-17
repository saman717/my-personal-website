import { NextRequest, NextResponse } from 'next/server';

const LOCALES = ['fa', 'en'];
const DEFAULT_LOCALE = 'fa';

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const pathnameHasLocale = LOCALES.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  );
  if (pathnameHasLocale) return NextResponse.next();

  const acceptLanguage = request.headers.get('accept-language') ?? '';
  const preferredLocale = acceptLanguage.startsWith('en') ? 'en' : DEFAULT_LOCALE;

  return NextResponse.redirect(
    new URL(`/${preferredLocale}${pathname}`, request.url)
  );
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|icons|images|og-image|api).*)',
  ],
};
