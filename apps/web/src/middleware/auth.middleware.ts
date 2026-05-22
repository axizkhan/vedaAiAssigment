import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const protectedRoutes = ['/dashboard', '/assignments', '/settings'];
const authRoutes = ['/login', '/register'];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Refresh token is the only thing persisted across page loads reliably (in httpOnly cookie)
  // We can't read it natively via JS, but Next.js middleware CAN check if the cookie exists.
  const hasRefreshToken = request.cookies.has('refreshToken');

  const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route));
  const isAuthRoute = authRoutes.some(route => pathname.startsWith(route));

  // 1. If trying to access protected route without a refresh token cookie, redirect to login
  if (isProtectedRoute && !hasRefreshToken) {
    const url = new URL('/login', request.url);
    url.searchParams.set('redirect', pathname);
    return NextResponse.redirect(url);
  }

  // 2. If trying to access login/register while already having a refresh token, redirect to dashboard
  if (isAuthRoute && hasRefreshToken) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/dashboard/:path*', 
    '/assignments/:path*',
    '/settings/:path*',
    '/login',
    '/register'
  ]
};
