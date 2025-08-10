import product from "@/assets/images/product.jpg";

/**
 * Get a safe image URL with fallback to default placeholder
 * This prevents unnecessary HTTP requests to S3 when there's no image
 * 
 * @param {string} imageUrl - The image URL from the database
 * @param {string} fallbackUrl - Optional custom fallback URL
 * @returns {string} - Safe image URL or fallback
 */
export const getSafeImageUrl = (imageUrl, fallbackUrl = product) => {
  // Check if imageUrl exists and is not empty/null/undefined
  if (!imageUrl || typeof imageUrl !== 'string' || imageUrl.trim() === '') {
    return fallbackUrl;
  }

  // Check for common invalid values that might be in the database
  const invalidValues = ['null', 'undefined', 'none', '', 'N/A', 'n/a'];
  const trimmedUrl = imageUrl.trim().toLowerCase();
  
  if (invalidValues.includes(trimmedUrl)) {
    return fallbackUrl;
  }

  // Additional check for malformed URLs (optional)
  try {
    // Check if it's a valid URL structure
    if (imageUrl.includes('http') || imageUrl.includes('/')) {
      return imageUrl.trim();
    }
    // If it's just a filename without path, return fallback
    return fallbackUrl;
  } catch (error) {
    return fallbackUrl;
  }
};

/**
 * Handle image error events consistently
 * 
 * @param {Event} event - The error event
 * @param {string} fallbackUrl - Fallback image URL
 */
export const handleImageError = (event, fallbackUrl = product) => {
  // Prevent infinite error loops
  if (event.target.src !== fallbackUrl && event.target.src !== fallbackUrl.src) {
    event.target.src = fallbackUrl.src || fallbackUrl;
  }
};

/**
 * Check if an image URL is likely to be valid before making a request
 * 
 * @param {string} imageUrl - The image URL to validate
 * @returns {boolean} - Whether the URL appears valid
 */
export const isValidImageUrl = (imageUrl) => {
  if (!imageUrl || typeof imageUrl !== 'string') {
    return false;
  }

  const trimmedUrl = imageUrl.trim();
  
  // Check for empty or invalid values
  if (trimmedUrl === '' || trimmedUrl.toLowerCase() === 'null' || trimmedUrl.toLowerCase() === 'undefined') {
    return false;
  }

  // Check for proper URL structure
  return trimmedUrl.includes('http') || trimmedUrl.startsWith('/') || trimmedUrl.includes('.');
};

/**
 * Generate responsive image URLs for different screen sizes
 * This helps with mobile performance by serving appropriately sized images
 * 
 * @param {string} baseUrl - The base S3 image URL
 * @param {Object} options - Size and format options
 * @returns {Object} - Object with different sized image URLs
 */
export const getResponsiveImageUrls = (baseUrl, options = {}) => {
  if (!isValidImageUrl(baseUrl)) {
    return {
      mobile: product,
      tablet: product,
      desktop: baseUrl || product,
      webp_mobile: product,
      webp_tablet: product,
      webp_desktop: product
    };
  }

  // If it's already a processed/resized image, return as-is
  if (baseUrl.includes('?') || baseUrl.includes('_resized') || baseUrl.includes('_mobile')) {
    return {
      mobile: baseUrl,
      tablet: baseUrl,
      desktop: baseUrl,
      webp_mobile: baseUrl,
      webp_tablet: baseUrl,
      webp_desktop: baseUrl
    };
  }

  const {
    mobileWidth = 480,
    tabletWidth = 768,
    desktopWidth = 1200,
    quality = 85
  } = options;

  // For AWS S3/CloudFront, we can add query parameters for resizing
  // This is a common pattern for image optimization services
  const getResizedUrl = (width, format = 'jpg') => {
    // If using AWS Lambda@Edge or CloudFront with image optimization
    if (baseUrl.includes('cloudfront') || baseUrl.includes('amazonaws')) {
      return `${baseUrl}?w=${width}&q=${quality}&f=${format}`;
    }
    
    // For other CDNs or if you have image processing service
    return baseUrl;
  };

  return {
    mobile: getResizedUrl(mobileWidth),
    tablet: getResizedUrl(tabletWidth),
    desktop: getResizedUrl(desktopWidth),
    webp_mobile: getResizedUrl(mobileWidth, 'webp'),
    webp_tablet: getResizedUrl(tabletWidth, 'webp'),
    webp_desktop: getResizedUrl(desktopWidth, 'webp')
  };
};

/**
 * Get optimal image size based on device/screen size
 * 
 * @param {string} baseUrl - The base image URL
 * @param {string} deviceType - 'mobile', 'tablet', or 'desktop'
 * @returns {string} - Optimized image URL
 */
export const getOptimizedImageUrl = (baseUrl, deviceType = 'desktop') => {
  const responsiveUrls = getResponsiveImageUrls(baseUrl);
  
  // Return WebP version if supported, otherwise fallback to regular
  const supportsWebP = typeof window !== 'undefined' && 
    window.HTMLCanvasElement && 
    window.HTMLCanvasElement.prototype.toDataURL &&
    window.HTMLCanvasElement.prototype.toDataURL('image/webp').indexOf('image/webp') === 5;
  
  if (supportsWebP) {
    switch (deviceType) {
      case 'mobile':
        return responsiveUrls.webp_mobile;
      case 'tablet':
        return responsiveUrls.webp_tablet;
      default:
        return responsiveUrls.webp_desktop;
    }
  }
  
  switch (deviceType) {
    case 'mobile':
      return responsiveUrls.mobile;
    case 'tablet':
      return responsiveUrls.tablet;
    default:
      return responsiveUrls.desktop;
  }
};

/**
 * Detect device type based on window width
 * 
 * @returns {string} - 'mobile', 'tablet', or 'desktop'
 */
export const getDeviceType = () => {
  if (typeof window === 'undefined') return 'desktop';
  
  const width = window.innerWidth;
  if (width <= 480) return 'mobile';
  if (width <= 768) return 'tablet';
  return 'desktop';
};

/**
 * Generate sizes attribute for responsive images
 * 
 * @param {Object} options - Size configuration options
 * @returns {string} - Sizes attribute string
 */
export const getImageSizes = (options = {}) => {
  const {
    mobileSize = '100vw',
    tabletSize = '50vw', 
    desktopSize = '33vw',
    mobileBreakpoint = '480px',
    tabletBreakpoint = '768px'
  } = options;

  return `(max-width: ${mobileBreakpoint}) ${mobileSize}, (max-width: ${tabletBreakpoint}) ${tabletSize}, ${desktopSize}`;
};
