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

  // Additional security headers via Next.js headers()
  async headers() {
    return [
      {
        source: '/api/:path*',
        headers: [
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