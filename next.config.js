/** @type {import('next').NextConfig} */
const nextConfig = {
  // Remove X-Powered-By header globally
  poweredByHeader: false,
  
  images: {
    domains: ['images.unsplash.com', 'github.com', 'avatars.githubusercontent.com'],
    // Add security for image optimization
    unoptimized: false,
    dangerouslyAllowSVG: false,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
  
  typescript: {
    ignoreBuildErrors: false,
  },
  
  eslint: {
    ignoreDuringBuilds: false,
  },

  // Comprehensive security headers via Next.js headers()
  async headers() {
    // Enhanced CSP policy
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

    const securityHeaders = [
      {
        key: 'Content-Security-Policy',
        value: cspPolicy,
      },
      {
        key: 'X-Content-Type-Options',
        value: 'nosniff',
      },
      {
        key: 'X-Frame-Options',
        value: 'DENY',
      },
      {
        key: 'X-XSS-Protection',
        value: '1; mode=block',
      },
      {
        key: 'Referrer-Policy',
        value: 'strict-origin-when-cross-origin',
      },
      {
        key: 'Permissions-Policy',
        value: 'camera=(), microphone=(), geolocation=(), browsing-topics=(), interest-cohort=()',
      },
      // HSTS only in production
      ...(process.env.NODE_ENV === 'production' ? [{
        key: 'Strict-Transport-Security',
        value: 'max-age=63072000; includeSubDomains; preload',
      }] : []),
    ];

    return [
      {
        // Apply to all routes
        source: '/(.*)',
        headers: securityHeaders,
      },
      {
        // Specific headers for API routes
        source: '/api/:path*',
        headers: [
          ...securityHeaders,
          {
            key: 'Cache-Control',
            value: 'no-store, no-cache, must-revalidate, proxy-revalidate',
          },
          {
            key: 'Pragma',
            value: 'no-cache',
          },
          {
            key: 'Expires',
            value: '0',
          },
        ],
      },
    ];
  },

  // Security-focused experimental features
  experimental: {
    // Enable security-related optimizations
    optimizePackageImports: ['lucide-react', 'framer-motion'],
  },
}

module.exports = nextConfig; 