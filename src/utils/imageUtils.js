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
