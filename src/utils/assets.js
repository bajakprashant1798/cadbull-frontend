// src/utils/assets.js
const CDN_PREFIX = "https://assets.cadbull.com/assets";

// Small helpers
const stripSlashes = (s) => String(s).replace(/^\/+|\/+$/g, "");
const urlFor = (...parts) => `${CDN_PREFIX}/${parts.map(stripSlashes).join("/")}`;

// Export a single object that supports BOTH:
// - top-level helpers (assets.icons, assets.image, assets.filetype, assets.social)
// - the old nested style (assets.images.filetype, assets.images.icons, assets.images.social)
export const assets = {
  base: CDN_PREFIX,
  url: urlFor,

  // ✅ New top-level helpers
  icons: (filename) => urlFor("icons", filename),
  image: (filename) => urlFor("images", filename),
  filetype: (filename) => urlFor("images/filetype", filename),
  social: (filename) => urlFor("icons/social", filename),

  // ✅ Backwards-compatible nested group (keeps your existing usage working)
  images: {
    filetype: (filename) => urlFor("images/filetype", filename),
    icons: (filename) => urlFor("icons", filename),
    social: (filename) => urlFor("icons/social", filename),
  },
};
