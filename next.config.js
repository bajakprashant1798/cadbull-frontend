// /** @type {import('next').NextConfig} */
// const nextConfig = {
//   reactStrictMode: false,
// }


// // next.config.js
// module.exports = {
//   async redirects() {
//     return [
//       {
//         source: '/categories/view/:id',
//         destination: '/detail/:id/:slug', // (slug will be missing, see note below)
//         permanent: true,
//       },
//     ]
//   },
// }


// module.exports = nextConfig

// // /** @type {import('next').NextConfig} */
// // const nextConfig = {
// //   reactStrictMode: false,
// //   async rewrites() {
// //     return [
// //       {
// //         source: '/api/:path*',
// //         destination: 'https://cadbull-backend.onrender.com/api/:path*', // Proxy to your backend API
// //       },
// //     ];
// //   },
// // };

// // module.exports = nextConfig;



/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  images: {
    // domains: [
    //   'beta-assets.cadbull.com',
    //   'localhost/', // Local development
    //   // add other image domains here if needed
    //   // 'cadbull.com', // allows *.cadbull.com and cadbull.com
    //   // 'cdn.cadbull.com',
    // ],
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
  },
  async redirects() {
    return [
      {
        source: '/categories/view/:id/:slug',
        destination: '/detail/:id/:slug',
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
