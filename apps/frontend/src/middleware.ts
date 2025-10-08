
import { NextRequest, NextResponse } from 'next/server';
import { locales } from './i18n';

export function middleware(request: NextRequest) {
  // Get locale from cookie or Accept-Language header
  const cookieLocale = request.cookies.get('NEXT_LOCALE')?.value;
  const acceptLanguage = request.headers.get('Accept-Language');
  
  let selectedLocale = 'en'; // default
  
  // Check if cookie locale is valid
  if (cookieLocale && locales.includes(cookieLocale as any)) {
    selectedLocale = cookieLocale;
  } else if (acceptLanguage) {
    // Parse Accept-Language header to find best match
    const languages = acceptLanguage
      .split(',')
      .map(lang => lang.split(';')[0].trim().toLowerCase().substring(0, 2));
    
    for (const lang of languages) {
      if (locales.includes(lang as any)) {
        selectedLocale = lang;
        break;
      }
    }
  }
  
  // Set locale header for next-intl
  const response = NextResponse.next();
  response.headers.set('x-next-intl-locale', selectedLocale);
  
  return response;
}

export const config = {
  // Match all pathnames except for
  // - /api (API routes)
  // - /_next (Next.js internals)
  // - /favicon.ico, /robots.txt, etc. (static files)
  matcher: ['/((?!api|_next|.*\\..*).*)']
};
