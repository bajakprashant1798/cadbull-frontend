// ✅ PRODUCTION-READY: PurgeCSS enabled with bulletproof configuration
module.exports = {
  plugins: [
    // Only enable PurgeCSS in production builds for safety
    ...(process.env.NODE_ENV === 'production' 
      ? [
          [
            '@fullhuman/postcss-purgecss',
            {
              content: [
                './src/pages/**/*.{js,ts,jsx,tsx}',
                './src/components/**/*.{js,ts,jsx,tsx}',
                './src/layouts/**/*.{js,ts,jsx,tsx}',
                './src/**/*.{js,ts,jsx,tsx}',
              ],
              // ✅ REVENUE PROTECTION: Comprehensive safelist 
              safelist: {
                standard: [
                  // ✅ CRITICAL: AdSense classes (NEVER REMOVE)
                  /^adsbygoogle/,
                  /^ad-/,
                  /^ad$/,
                  /^google/,
                  /^goog/,
                  
                  // Bootstrap classes used dynamically
                  /^btn/,
                  /^modal/,
                  /^dropdown/,
                  /^nav/,
                  /^carousel/,
                  /^toast/,
                  /^alert/,
                  /^badge/,
                  /^card/,
                  /^table/,
                  /^form/,
                  /^input/,
                  /^list/,
                  /^pagination/,
                  /^container/,
                  /^row/,
                  /^col/,
                  
                  // State classes
                  'active',
                  'show',
                  'hide',
                  'collapse',
                  'collapsing',
                  'fade',
                  'in',
                  'open',
                  
                  // FontAwesome
                  /^fa/,
                  
                  // React Share
                  /^react-share/,
                  
                  // Utility classes
                  /^d-/,
                  /^p-/,
                  /^m-/,
                  /^text-/,
                  /^bg-/,
                  /^border/,
                  /^rounded/,
                  /^shadow/,
                  /^position/,
                  /^flex/,
                  /^justify/,
                  /^align/,
                  /^w-/,
                  /^h-/,
                ],
                deep: [
                  /adsbygoogle/,
                  /google/,
                ],
                greedy: [
                  /adsbygoogle/,
                ]
              },
              defaultExtractor: content => {
                const matches = content.match(/[\w-/:]+(?<!:)/g) || [];
                return matches;
              },
            }
          ]
        ] 
      : []
    ),
  ],
};
