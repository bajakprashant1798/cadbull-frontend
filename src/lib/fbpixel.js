// Facebook Pixel utility functions
export const FB_PIXEL_ID = '295971664520262';

// Initialize Facebook Pixel (already done in _document.js)
export const initFacebookPixel = () => {
  if (typeof window !== 'undefined' && window.fbq) {
    window.fbq('init', FB_PIXEL_ID);
    window.fbq('track', 'PageView');
  }
};

// Track page view
export const trackPageView = () => {
  if (typeof window !== 'undefined' && window.fbq) {
    window.fbq('track', 'PageView');
  }
};

// Track custom events
export const trackEvent = (eventName, parameters = {}) => {
  if (typeof window !== 'undefined' && window.fbq) {
    window.fbq('track', eventName, parameters);
  }
};

// Predefined tracking functions for common events
export const trackPurchase = (value, currency = 'USD') => {
  trackEvent('Purchase', { value, currency });
};

export const trackAddToCart = (contentName, value, currency = 'USD') => {
  trackEvent('AddToCart', { 
    content_name: contentName,
    value,
    currency 
  });
};

export const trackViewContent = (contentName, contentType = 'product') => {
  trackEvent('ViewContent', { 
    content_name: contentName,
    content_type: contentType 
  });
};

export const trackSearch = (searchString) => {
  trackEvent('Search', { search_string: searchString });
};

export const trackLead = () => {
  trackEvent('Lead');
};

export const trackCompleteRegistration = () => {
  trackEvent('CompleteRegistration');
};

export const trackContact = () => {
  trackEvent('Contact');
};

export const trackDownload = (fileName, fileType = 'dwg') => {
  trackEvent('Download', { 
    content_name: fileName,
    content_type: fileType 
  });
};

// Track custom events with parameters
export const trackCustomEvent = (eventName, parameters = {}) => {
  trackEvent(eventName, parameters);
};
