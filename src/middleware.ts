import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Create response
  const response = NextResponse.next();

  // Content Security Policy (CSP)
  const cspPolicy = [
    "default-src 'self'",
    "script-src 'self' 'unsafe-eval' 'unsafe-inline' https://vercel.live https://va.vercel-scripts.com",
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
    "img-src 'self' data: blob: https: http:",
    "font-src 'self' https://fonts.gstatic.com",
    "connect-src 'self' https://vercel.live https://api.github.com https://github.com",
    "frame-src 'self' https://vercel.live",
    "media-src 'self'",
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    "frame-ancestors 'none'",
    "upgrade-insecure-requests"
  ].join('; ');

  // Security Headers
  const securityHeaders = {
    // Content Security Policy
    'Content-Security-Policy': cspPolicy,
    
    // Frame Protection (redundant with CSP frame-ancestors, but good for older browsers)
    'X-Frame-Options': 'DENY',
    
    // Remove X-Powered-By header (this removes server information leakage)
    'X-Powered-By': '',
    
    // Additional Security Headers
    'X-Content-Type-Options': 'nosniff',
    'X-XSS-Protection': '1; mode=block',
    'Referrer-Policy': 'strict-origin-when-cross-origin',
    'Permissions-Policy': 'camera=(), microphone=(), geolocation=(), browsing-topics=()',
    
    // HSTS (HTTP Strict Transport Security) - Only set in production
    ...(process.env.NODE_ENV === 'production' && {
      'Strict-Transport-Security': 'max-age=31536000; includeSubDomains; preload'
    })
  };

  // Apply all security headers
  Object.entries(securityHeaders).forEach(([key, value]) => {
    if (value) {
      response.headers.set(key, value);
    } else {
      // Remove header if value is empty (for X-Powered-By)
      response.headers.delete(key);
    }
  });

  return response;
}

export const config = {
  // Apply middleware to all routes except static files and API routes that don't need CSP
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}; 