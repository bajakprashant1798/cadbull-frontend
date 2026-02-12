import qs from 'qs';

/**
 * Get full Strapi URL from path
 * @param {string} path Path of the URL
 * @returns {string} Full Strapi URL
 */
export function getStrapiURL(path = "") {
  return `${process.env.NEXT_PUBLIC_STRAPI_API_URL || "http://localhost:1337"
    }${path}`;
}

/**
 * Helper to make GET requests to Strapi API endpoints
 * @param {string} path The API path
 * @param {Object} urlParamsObject URL parameters object, will be stringified
 * @param {Object} options Options passed to fetch
 * @returns Parsed API response
 */
export async function fetchStrapiAPI(path, urlParamsObject = {}, options = {}) {
  // Merge default and user options
  const mergedOptions = {
    headers: {
      "Content-Type": "application/json",
      // Authorization: `Bearer ${process.env.STRAPI_API_TOKEN}`,
    },
    ...options,
  };

  // Build request URL
  const queryString = qs.stringify(urlParamsObject);
  const requestUrl = `${getStrapiURL(
    `/api${path}`
  )}${queryString ? `?${queryString}` : ""}`;

  console.log(`Fetching Strapi API: ${requestUrl}`);

  // Trigger API call
  const response = await fetch(requestUrl, mergedOptions);
  console.log(`Strapi Response Status: ${response.status}`);

  // Handle response
  if (!response.ok) {
    const errorData = await response.json();
    console.error(`❌ [Strapi API] Error fetching ${path}:`, response.status, response.statusText);
    console.error(`❌ [Strapi API] Details:`, JSON.stringify(errorData, null, 2));
    throw new Error(errorData?.error?.message || `An error occurred please try again`);
  }
  const data = await response.json();
  return data;
}

/**
 * Helper to get image URL from Strapi media object
 * @param {Object} image Strapi media object (from API response)
 * @returns {string} Full URL to the image
 */
export function getStrapiMedia(image) {
  if (!image) {
    return null;
  }
  const { url } = image.data?.attributes || image; // Handle standard API response or direct object
  if (!url) {
    return null;
  }
  if (url.startsWith("/")) {
    return getStrapiURL(url);
  }
  return url;
}
