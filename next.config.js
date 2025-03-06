/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
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

