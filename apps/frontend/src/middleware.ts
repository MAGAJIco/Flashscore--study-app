
import createMiddleware from 'next-intl/middleware';
import { locales } from './i18n';

export default createMiddleware({
  // A list of all locales that are supported
  locales,
  
  // Used when no locale matches
  defaultLocale: 'en',
  
  // Automatically detect locale from Accept-Language header
  localeDetection: true,
  
  // Prefix for locale in URL (e.g., /en, /es, /fr)
  localePrefix: 'as-needed'
});

export const config = {
  // Match all pathnames except for
  // - /api (API routes)
  // - /_next (Next.js internals)
  // - /favicon.ico, /robots.txt, etc. (static files)
  matcher: ['/((?!api|_next|.*\\..*).*)']
};
