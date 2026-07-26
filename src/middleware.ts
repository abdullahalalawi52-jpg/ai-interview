import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify, createRemoteJWKSet } from 'jose';

// Firebase JWKS URL for ID Tokens
const FIREBASE_JWKS_URL = 'https://www.googleapis.com/service_accounts/v1/jwk/securetoken@system.gserviceaccount.com';
const jwks = createRemoteJWKSet(new URL(FIREBASE_JWKS_URL));

export async function middleware(request: NextRequest) {
  // Get the auth cookie
  const authCookie = request.cookies.get('auth');
  const token = authCookie?.value;
  let isAuthenticated = false;

  if (token) {
    try {
      // Verify JWT signature using Firebase's public keys
      const { payload } = await jwtVerify(token, jwks, {
        issuer: `https://securetoken.google.com/${process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID}`,
        audience: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
      });

      const currentTime = Math.floor(Date.now() / 1000);
      if (payload.exp && payload.exp > currentTime) {
        isAuthenticated = true;
      }
    } catch (error) {
      console.warn("Invalid JWT in middleware:", error instanceof Error ? error.message : "Unknown error");
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
