# Meta Pixel Integration Guide

## Overview
This guide explains how Meta Pixel (Facebook Pixel) is integrated into the Cadbull website and how to use the tracking functions.

## Setup
The Meta Pixel code is automatically loaded on every page via `_document.js` with the pixel ID: `295971664520262`

## Available Tracking Functions

### Import the tracking functions:
```javascript
import { 
  trackPageView,
  trackEvent,
  trackPurchase,
  trackAddToCart,
  trackViewContent,
  trackSearch,
  trackLead,
  trackCompleteRegistration,
  trackContact,
  trackDownload,
  trackCustomEvent
} from '@/lib/fbpixel';
```

### Basic Events

#### Page View
```javascript
trackPageView(); // Automatically tracked on route changes
```

#### Search
```javascript
trackSearch('house plans'); // Track when users search
```

#### Registration
```javascript
trackCompleteRegistration(); // Track successful user registration
```

#### Contact
```javascript
trackContact(); // Track contact form submissions
trackLead(); // Track lead generation
```

#### Downloads
```javascript
trackDownload('project_123.dwg', 'dwg'); // Track file downloads
```

### E-commerce Events

#### Purchase
```javascript
trackPurchase(29.99, 'USD'); // Track purchases
```

#### Add to Cart
```javascript
trackAddToCart('Premium Plan', 29.99, 'USD');
```

#### View Content
```javascript
trackViewContent('DWG Architecture Plans', 'product');
```

### Custom Events
```javascript
trackCustomEvent('Newsletter_Signup', {
  source: 'homepage',
  user_type: 'premium'
});
```

## Current Implementation

### Automatic Tracking
- ✅ Page views on all route changes
- ✅ Search queries from home page and category pages
- ✅ User registration completion
- ✅ Contact form submissions
- ✅ File downloads

### Manual Implementation Needed
You can add tracking to other events by importing the functions and calling them at appropriate times:

```javascript
// Example: Track pricing page visits
import { trackViewContent } from '@/lib/fbpixel';

const PricingPage = () => {
  useEffect(() => {
    trackViewContent('Pricing Plans', 'pricing');
  }, []);
  
  return (
    // Your pricing page content
  );
};
```

## Event Parameters
Most tracking functions accept optional parameters to provide more context:

```javascript
trackEvent('CustomEvent', {
  content_name: 'Product Name',
  content_category: 'CAD Files',
  value: 25.00,
  currency: 'USD',
  custom_parameter: 'custom_value'
});
```

## Testing
To verify Meta Pixel is working:
1. Install Facebook Pixel Helper browser extension
2. Visit your website
3. Check that events are firing correctly
4. Use Facebook Events Manager to monitor real-time events

## Privacy Compliance
- The pixel respects user consent
- Works with Facebook's data processing agreements
- Supports GDPR compliance when configured properly

## Notes
- Events are only tracked when `window.fbq` is available
- All functions include browser environment checks
- Failed tracking attempts are handled gracefully
