import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

/**
 * Production-Safe Middleware
 * Edge Runtime compatible - No Buffer usage
 */

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Only protect dashboard routes, let /admin login page be public
  if (pathname.startsWith('/admin/dashboard')) {
    const session = request.cookies.get('bronev_session');
    
    if (!session?.value) {
      return NextResponse.redirect(new URL('/admin', request.url));
    }
  }

  // Add security headers
  const response = NextResponse.next();
  response.headers.set('X-Frame-Options', 'SAMEORIGIN');
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');

  return response;
}

export const config = {
  matcher: [
    '/admin/dashboard/:path*',
  ],
};
