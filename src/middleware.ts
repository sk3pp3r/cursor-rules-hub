import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Create response
  const response = NextResponse.next();

  // Enhanced Content Security Policy (CSP)
  const cspPolicy = [
    "default-src 'self'",
    "script-src 'self' 'unsafe-eval' 'unsafe-inline' https://vercel.live https://va.vercel-scripts.com https://static.cloudflareinsights.com",
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
    "img-src 'self' data: blob: https: http:",
    "font-src 'self' https://fonts.gstatic.com data:",
    "connect-src 'self' https://vercel.live https://api.github.com https://github.com https://vitals.vercel-insights.com",
    "frame-src 'self' https://vercel.live",
    "media-src 'self' data:",
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    "frame-ancestors 'none'",
    "upgrade-insecure-requests",
    "block-all-mixed-content"
  ].join('; ');

  // Security Headers
  const securityHeaders = {
    // Content Security Policy
    'Content-Security-Policy': cspPolicy,
    
    // Frame Protection (redundant with CSP frame-ancestors, but good for older browsers)
    'X-Frame-Options': 'DENY',
    
    // Additional Security Headers
    'X-Content-Type-Options': 'nosniff',
    'X-XSS-Protection': '1; mode=block',
    'Referrer-Policy': 'strict-origin-when-cross-origin',
    'Permissions-Policy': 'camera=(), microphone=(), geolocation=(), browsing-topics=(), interest-cohort=()',
    
    // HSTS (HTTP Strict Transport Security) - Only set in production
    ...(process.env.NODE_ENV === 'production' && {
      'Strict-Transport-Security': 'max-age=63072000; includeSubDomains; preload'
    })
  };

  // Apply all security headers
  Object.entries(securityHeaders).forEach(([key, value]) => {
    if (value) {
      response.headers.set(key, value);
    }
  });

  return response;
}

export const config = {
  // Apply middleware to all routes including API routes
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (images, etc.)
     */
    '/((?!_next/static|_next/image|favicon|.*\\.(?:ico|png|jpg|jpeg|gif|svg|webp|js|css|woff|woff2|ttf|otf|eot)$).*)',
  ],
}; 