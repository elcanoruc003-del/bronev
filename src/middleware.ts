import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

/**
 * Production-Safe Middleware
 */

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const session = request.cookies.get('bronev_session');

  // If accessing /admin (login page)
  if (pathname === '/admin') {
    // If already logged in, redirect to dashboard
    if (session) {
      try {
        const decoded = Buffer.from(session.value, 'base64').toString('utf-8');
        const user = JSON.parse(decoded);
        
        if (user.role && ['ADMIN', 'SUPER_ADMIN'].includes(user.role)) {
          return NextResponse.redirect(new URL('/admin/dashboard', request.url));
        }
      } catch {
        // Invalid session, continue to login page
      }
    }
    // No session or invalid, show login page
    return NextResponse.next();
  }

  // Protect /admin/dashboard and deeper routes
  if (pathname.startsWith('/admin/dashboard')) {
    if (!session) {
      return NextResponse.redirect(new URL('/admin', request.url));
    }

    // Basic session validation
    try {
      const decoded = Buffer.from(session.value, 'base64').toString('utf-8');
      const user = JSON.parse(decoded);
      
      if (!user.role || !['ADMIN', 'SUPER_ADMIN'].includes(user.role)) {
        return NextResponse.redirect(new URL('/admin', request.url));
      }
    } catch {
      return NextResponse.redirect(new URL('/admin', request.url));
    }
  }

  // Security headers for all routes
  const response = NextResponse.next();
  
  response.headers.set('X-Frame-Options', 'SAMEORIGIN');
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');

  return response;
}

export const config = {
  matcher: [
    '/admin/:path*',
  ],
};
