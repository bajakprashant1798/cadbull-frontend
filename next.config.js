/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  poweredByHeader: false,                 // small security hardening
  compress: true,
  output: 'standalone',                   // ✅ important for EC2 (smaller runtime image)
  productionBrowserSourceMaps: false,     // reduce bundle size/telemetry
  httpAgentOptions: { keepAlive: true },  // fewer TCP handshakes when SSR calls your API
  
  // ✅ CRITICAL: Production optimizations for 35-100 concurrent users
  experimental: {
    // ✅ HTTP optimizations for high concurrency
    serverMinification: true,
    serverSourceMaps: false,
    optimizeCss: false, // Disabled due to dependency issues
    esmExternals: true,
    scrollRestoration: true,
    // ✅ Memory optimization for concurrent requests
    workerThreads: false,
    cpus: 1, // Limit CPU usage in containers
  },

  // ✅ Performance monitoring and limits
  onDemandEntries: {
    // Period (in ms) where the server will keep pages in the buffer
    maxInactiveAge: 25 * 1000, // 25 seconds
    // Number of pages that should be kept simultaneously without being disposed
    pagesBufferLength: 5, // Reduced from default to save memory
  },
  
  // AMP configuration
  amp: {
    canonicalBase: 'https://cadbull.com',
    skipValidation: false,
  },
  
  // Build optimizations to reduce compute costs
  compiler: {
    // ✅ SELECTIVE CONSOLE REMOVAL: Keep performance logs, remove debug logs
    removeConsole: process.env.NODE_ENV === 'production' ? {
      exclude: ['info', 'warn', 'error'] // Keep these for CloudWatch logging
    } : false,
    // ✅ SPEED OPTIMIZATION: Enable styled-jsx for better CSS optimization
    styledJsx: true,
  },
  
  // ✅ Ensure custom error pages are properly built
  generateBuildId: async () => {
    // Ensure consistent builds and proper 404 page generation
    return `build-${Date.now()}`;
  },
  
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'beta-assets.cadbull.com',
      },
      {
        protocol: 'http',
        hostname: 'localhost',
      },
      { protocol: 'https', hostname: 'lh3.googleusercontent.com' },
      { protocol: 'https', hostname: '*.googleusercontent.com' },
      { protocol: 'https', hostname: 's3.amazonaws.com' },
    ],
    // Add optimization settings to reduce bandwidth
    formats: ['image/webp', 'image/avif'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 31536000, // 1 year cache
  },
  
  // ✅ PERFORMANCE MONITORING: Add logging configuration
  logging: {
    fetches: {
      fullUrl: true,
    },
  },

  async headers() {
    return [
      // Long cache for static assets (not HTML)
      // immutable Next static chunks
      {
        source: '/_next/static/:path*',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=31536000, immutable' },
        ],
      },
      // Let Next/CloudFront control ISR HTML caching. No extra header here.

      // optional: static public assets if you serve any from /public
      {
        source: '/assets/:path*',
        headers: [{ key: 'Cache-Control', value: 'public, max-age=31536000, immutable' }],
      },
    ];
  },

  async redirects() {
    return [
      {
        source: '/categories/view/:id/:slug',
        destination: '/detail/:id/:slug',
        permanent: true,
      },
      {
        source: '/house-plan',
        destination: '/Architecture-House-Plan-CAD-Drawings',
        permanent: true,
      },
      // SEO redirect: numbered pages to query parameter format
      {
        source: '/:pageNumber(\\d+)',
        destination: '/?page=:pageNumber',
        permanent: true,
      },
      
      // ✅ BLOCK OLD DOWNLOAD URLS - Return 410 Gone
      {
        source: '/products/download/:path*',
        destination: '/410',
        permanent: true,
      },
      {
        source: '/products/ampdownload/:path*',
        destination: '/410',
        permanent: true,
      },
      
      // ✅ BLOCK OLD URL PATTERNS
      {
        source: '/gold',
        destination: '/categories',
        permanent: true,
      },
      {
        source: '/1.CAD',
        destination: '/categories',
        permanent: true,
      },
      { source: '/login',  destination: '/auth/login',  permanent: true },
      { source: '/signup', destination: '/auth/register', permanent: true },
      // Optional: handle trailing slashes explicitly
      { source: '/login/',  destination: '/auth/login',  permanent: true },
      { source: '/signup/', destination: '/auth/register', permanent: true },
      
      // // ✅ REDIRECT OLD DETAIL URLS WITHOUT PROPER SLUGS TO 404
      // {
      //   source: '/detail/:id/:slug*',
      //   has: [
      //     {
      //       type: 'query',
      //       key: 'redirect_old_format',
      //     },
      //   ],
      //   destination: '/404',
      //   permanent: false,
      // },
    ];
  },
  // Uncomment if you want to add rewrites (API proxy)
  // async rewrites() {
  //   return [
  //     {
  //       source: '/api/:path*',
  //       destination: 'https://cadbull-backend.onrender.com/api/:path*', // Proxy to your backend API
  //     },
  //   ];
  // },
};

module.exports = nextConfig;
