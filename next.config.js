/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  
  // AMP configuration
  amp: {
    canonicalBase: 'https://cadbull.com',
    skipValidation: false,
  },
  
  // Build optimizations to reduce compute costs
  // compiler: {
  //   removeConsole: process.env.NODE_ENV === 'production',
  //   // Disable styled-jsx to prevent empty amp-custom tag injection
  //   styledJsx: false,
  // },
  
  // Disable automatic CSS optimization for AMP compatibility
  experimental: {
    optimizeCss: false,
  },
  
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'beta-assets.cadbull.com',
      },
      {
        protocol: 'http',
        hostname: 'localhost',
      },
    ],
    // Add optimization settings to reduce bandwidth
    formats: ['image/webp', 'image/avif'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 31536000, // 1 year cache
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
