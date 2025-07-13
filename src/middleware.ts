import { NextRequest, NextResponse } from 'next/server';

// Define supported locales
const locales = ['en', 'zh'] as const;
const defaultLocale = 'en' as const;

type Locale = typeof locales[number];

function getLocale(request: NextRequest): Locale {
  // Check if there is any supported locale in the pathname
  const { pathname } = request.nextUrl;
  const pathnameHasLocale = locales.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  );

  if (pathnameHasLocale) {
    return pathname.split('/')[1] as Locale;
  }

  // Check accept-language header
  const acceptLanguage = request.headers.get('accept-language');
  if (acceptLanguage) {
    const preferredLocale = acceptLanguage
      .split(',')
      .map((lang) => lang.split(';')[0].trim())
      .find((lang) => {
        const locale = lang.toLowerCase().split('-')[0];
        return locales.includes(locale as Locale);
      });

    if (preferredLocale) {
      const locale = preferredLocale.toLowerCase().split('-')[0];
      return locale as Locale;
    }
  }

  // Check cookies
  const localeCookie = request.cookies.get('locale')?.value as Locale;
  if (localeCookie && locales.includes(localeCookie)) {
    return localeCookie;
  }

  return defaultLocale;
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Skip middleware for API routes, static files, and _next
  if (
    pathname.startsWith('/api/') ||
    pathname.startsWith('/_next/') ||
    pathname.includes('.') ||
    pathname.startsWith('/favicon')
  ) {
    return NextResponse.next();
  }

  // For now, disable locale redirects to fix deployment issues
  // TODO: Implement proper i18n routing later
  
  // Just set locale cookie based on preference without redirecting
  const locale = getLocale(request);
  const response = NextResponse.next();
  response.cookies.set('locale', locale, {
    maxAge: 365 * 24 * 60 * 60, // 1 year
    path: '/',
    sameSite: 'lax',
  });
  
  return response;
}

export const config = {
  matcher: [
    // Skip all internal paths (_next)
    '/((?!_next/static|_next/image|favicon.ico|api/).*)',
  ],
};