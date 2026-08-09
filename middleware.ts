import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Define routes that require authentication
  const protectedRoutes = ['/admin', '/checkout'];
  const isProtectedRoute = protectedRoutes.some(route => pathname === route || pathname.startsWith(route + '/'));

  // Define routes meant only for unauthenticated users
  const authRoutes = ['/login', '/signup', '/signin'];
  const isAuthRoute = authRoutes.some(route => pathname === route || pathname.startsWith(route + '/'));

  // Get token/session from cookies
  const token = request.cookies.get('accessToken')?.value || request.cookies.get('session')?.value || request.cookies.get('access_token')?.value;

  if (!token && isProtectedRoute) {
    // Redirect to login if trying to access a protected route without a token
    return NextResponse.redirect(new URL('/login', request.url));
  }

  if (token && isAuthRoute) {
    // Redirect away from login if already authenticated
    return NextResponse.redirect(new URL('/', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico, sitemap.xml, robots.txt (metadata files)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
