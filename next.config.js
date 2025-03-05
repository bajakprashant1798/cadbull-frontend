// /** @type {import('next').NextConfig} */
// const nextConfig = {
//   reactStrictMode: false,
// }

// module.exports = nextConfig

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'http://localhost:5001/api/:path*',
      },
    ];
  },
};

module.exports = nextConfig;
