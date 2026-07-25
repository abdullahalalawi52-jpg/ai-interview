import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { decodeJwt } from 'jose';

export function middleware(request: NextRequest) {
  // Get the auth cookie
  const authCookie = request.cookies.get('auth');
  const token = authCookie?.value;
  let isAuthenticated = false;

  if (token) {
    try {
      const decoded = decodeJwt(token);
      const currentTime = Math.floor(Date.now() / 1000);
      if (decoded.exp && decoded.exp > currentTime) {
        isAuthenticated = true;
      }
    } catch (_error) {
      console.warn("Invalid JWT in middleware");
    }
  }

  const path = request.nextUrl.pathname;

  // Protect /dashboard route
  const isProtectedPath = path.startsWith('/dashboard');

  if (isProtectedPath && !isAuthenticated) {
    // Redirect to home and append login=true so we can open the modal
    const url = new URL('/?login=true', request.url);
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: [
    '/dashboard/:path*',
  ],
};
