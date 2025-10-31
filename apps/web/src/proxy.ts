
import createMiddleware from 'next-intl/middleware';
import { NextRequest } from 'next/server';

const handleI18nRouting = createMiddleware({
  locales: ['en', 'es', 'fr', 'de'],
  defaultLocale: 'en',
  localePrefix: 'always',
  localeDetection: true
});

export default function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  
  // Skip i18n for empire routes (handled by locale structure)
  if (pathname.startsWith('/empire')) {
    return;
  }
  
  const response = handleI18nRouting(request);
  
  // Extract locale from pathname
  const pathLocale = pathname.split('/')[1];
  
  if (['en', 'es', 'fr', 'de'].includes(pathLocale)) {
    // Set cookie to match URL locale
    response.cookies.set('NEXT_LOCALE', pathLocale, {
      path: '/',
      maxAge: 31536000,
      sameSite: 'lax'
    });
  }
  
  return response;
}

export const config = {
  matcher: ['/((?!api|_next|_vercel|.*\\..*).*)']
};
