import { NextRequest, NextResponse } from 'next/server';
import { match } from '@formatjs/intl-localematcher';
import Negotiator from 'negotiator';

const locales = ['en', 'es', 'fr', 'de', 'pt'];
const defaultLocale = 'en';

function getLocale(request: NextRequest): string {
  // 1. Check cookie first (highest priority - user explicitly selected)
  const cookieLocale = request.cookies.get('NEXT_LOCALE')?.value;
  if (cookieLocale && locales.includes(cookieLocale)) {
    return cookieLocale;
  }

  // 2. Check user preferences cookie
  const preferencesCookie = request.cookies.get('user-preferences')?.value;
  if (preferencesCookie) {
    try {
      const preferences = JSON.parse(preferencesCookie);
      if (preferences.language && locales.includes(preferences.language)) {
        return preferences.language;
      }
    } catch (e) {
      // Invalid JSON, continue
    }
  }

  // 3. Check geo-location header (Cloudflare/Vercel provides this)
  const geoLocale = request.headers.get('x-vercel-ip-country')?.toLowerCase();
  const geoLanguageMap: Record<string, string> = {
    'es': 'es', 'mx': 'es', 'ar': 'es', 'co': 'es', 'cl': 'es',
    'fr': 'fr', 'ca': 'fr', 'be': 'fr',
    'de': 'de', 'at': 'de', 'ch': 'de',
    'pt': 'pt', 'br': 'pt',
    'gb': 'en', 'us': 'en', 'au': 'en', 'nz': 'en'
  };
  if (geoLocale && geoLanguageMap[geoLocale] && locales.includes(geoLanguageMap[geoLocale])) {
    return geoLanguageMap[geoLocale];
  }

  // 4. Check Accept-Language header as fallback
  const negotiatorHeaders: Record<string, string> = {};
  request.headers.forEach((value, key) => {
    negotiatorHeaders[key] = value;
  });

  const languages = new Negotiator({ headers: negotiatorHeaders }).languages();

  try {
    return match(languages, locales, defaultLocale);
  } catch {
    return defaultLocale;
  }
}

export function middleware(request: NextRequest) {
  const locale = getLocale(request);

  // Create the response with locale in headers
  const response = NextResponse.next();

  // Set both cookies for compatibility
  response.cookies.set('NEXT_LOCALE', locale, {
    maxAge: 31536000, // 1 year
    path: '/',
    sameSite: 'lax'
  });

  // Set the locale header for next-intl
  response.headers.set('x-next-intl-locale', locale);

  return response;
}

export const config = {
  // Match all pathnames except for
  // - /api (API routes)
  // - /_next (Next.js internals)
  // - /favicon.ico, /robots.txt, etc. (static files)
  matcher: ['/((?!api|_next|.*\\..*).*)']
};