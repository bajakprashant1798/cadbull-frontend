/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
}


// next.config.js
module.exports = {
  async redirects() {
    return [
      {
        source: '/categories/view/:id',
        destination: '/detail/:id/:slug', // (slug will be missing, see note below)
        permanent: true,
      },
    ]
  },
}


module.exports = nextConfig

// /** @type {import('next').NextConfig} */
// const nextConfig = {
//   reactStrictMode: false,
//   async rewrites() {
//     return [
//       {
//         source: '/api/:path*',
//         destination: 'https://cadbull-backend.onrender.com/api/:path*', // Proxy to your backend API
//       },
//     ];
//   },
// };

// module.exports = nextConfig;

