import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

/**
 * Middleware — protects admin dashboard routes.
 * Edge Runtime compatible (no Node.js APIs).
 */
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Protect admin dashboard and properties routes
  if (pathname.startsWith('/admin/dashboard') || pathname.startsWith('/admin/properties')) {
    const session = request.cookies.get('bronev_session');

    if (!session?.value) {
      const loginUrl = new URL('/admin', request.url);
      loginUrl.searchParams.set('redirect', pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  // Add security headers to all responses
  const response = NextResponse.next();
  response.headers.set('X-Frame-Options', 'SAMEORIGIN');
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  response.headers.set(
    'Permissions-Policy',
    'camera=(), microphone=(), geolocation=()'
  );

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all admin routes except:
     * - /admin (login page)
     * - /admin/_next (Next.js internals)
     * - /admin/api (API routes)
     */
    '/admin/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
