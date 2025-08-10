// ✅ SPEED OPTIMIZATION: PurgeCSS configuration to remove unused CSS
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx}',
    './src/components/**/*.{js,ts,jsx,tsx}',
    './src/layouts/**/*.{js,ts,jsx,tsx}',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  css: [
    './src/styles/**/*.css',
    './src/styles/**/*.scss',
  ],
  safelist: [
    // ✅ Preserve AdSense related classes (CRITICAL for revenue)
    /^adsbygoogle/,
    /^ad-/,
    /^google/,
    /^goog/,
    
    // Bootstrap classes that might be dynamically added
    /^btn/,
    /^modal/,
    /^dropdown/,
    /^nav/,
    /^carousel/,
    /^toast/,
    
    // FontAwesome classes
    /^fa/,
    /^fas/,
    /^far/,
    /^fab/,
    
    // React-share classes
    /^react-share/,
    
    // Any dynamically added classes
    'active',
    'show',
    'collapse',
    'collapsing',
  ],
  defaultExtractor: content => content.match(/[\w-/:]+(?<!:)/g) || []
};
