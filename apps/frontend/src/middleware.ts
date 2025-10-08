
import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
  // Set locale header for next-intl
  const response = NextResponse.next();
  response.headers.set('x-next-intl-locale', 'en');
  return response;
}

export const config = {
  // Match all pathnames except for
  // - /api (API routes)
  // - /_next (Next.js internals)
  // - /favicon.ico, /robots.txt, etc. (static files)
  matcher: ['/((?!api|_next|.*\\..*).*)']
};
