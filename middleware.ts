import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Define public routes that don't require authentication.
  // Add any other routes here that you want to be accessible without logging in (e.g., '/', '/about')
  const publicRoutes = ['/login', '/signup', '/signin'];
  
  const isPublicRoute = publicRoutes.some(route => pathname === route || pathname.startsWith(route + '/'));

  // Get token/session from cookies
  const token = request.cookies.get('accessToken')?.value || request.cookies.get('session')?.value || request.cookies.get('access_token')?.value;

  if (!token && !isPublicRoute) {
    // If there is no token and the route is not public, redirect to login
    return NextResponse.redirect(new URL('/login', request.url));
  }

  if (token && isPublicRoute) {
    // If the user is logged in and tries to access login/signup, redirect to dashboard or home
    return NextResponse.redirect(new URL('/dashboard/notifications', request.url));
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
