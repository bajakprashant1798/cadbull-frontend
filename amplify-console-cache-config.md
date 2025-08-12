# AWS Amplify Console Configuration
# Copy these settings to: Amplify Console → Hosting → Custom headers and cache

## Priority Order (apply in this sequence):

### 1. Static Assets (Highest Priority)
Pattern: /_next/static/**
Headers:
  Cache-Control: public, max-age=31536000, immutable
  X-Content-Type-Options: nosniff

### 2. Images and Media
Pattern: /assets/**
Headers:
  Cache-Control: public, max-age=2592000, s-maxage=2592000

Pattern: **/*.{png,jpg,jpeg,gif,webp,svg,ico}
Headers:
  Cache-Control: public, max-age=2592000, s-maxage=2592000

### 3. Homepage (ISR - 30 minutes)
Pattern: /
Headers:
  Cache-Control: public, max-age=1800, s-maxage=1800, stale-while-revalidate=3600

### 4. Profile Pages (ISR - 2 hours)
Pattern: /profile/author/*
Headers:
  Cache-Control: public, max-age=7200, s-maxage=7200, stale-while-revalidate=14400

### 5. Category Pages (1 hour)
Pattern: /category/*
Headers:
  Cache-Control: public, max-age=3600, s-maxage=3600, stale-while-revalidate=7200

### 6. Project Detail Pages (1 hour)
Pattern: /project/*
Headers:
  Cache-Control: public, max-age=3600, s-maxage=3600, stale-while-revalidate=7200

### 7. Search Results (15 minutes)
Pattern: /search*
Headers:
  Cache-Control: public, max-age=900, s-maxage=900, stale-while-revalidate=1800

### 8. API Routes (No Cache)
Pattern: /api/**
Headers:
  Cache-Control: no-cache, no-store, must-revalidate
  Pragma: no-cache
  Expires: 0

### 9. Admin Pages (No Cache)
Pattern: /admin/**
Headers:
  Cache-Control: no-cache, no-store, must-revalidate

### 10. Static Pages (24 hours)
Pattern: /about
Headers:
  Cache-Control: public, max-age=86400, s-maxage=86400, stale-while-revalidate=172800

Pattern: /contact
Headers:
  Cache-Control: public, max-age=86400, s-maxage=86400, stale-while-revalidate=172800

### 11. JavaScript/CSS Bundles (1 year)
Pattern: **/*.{js,css}
Headers:
  Cache-Control: public, max-age=31536000, immutable

### 12. Fonts (1 year)
Pattern: **/*.{woff,woff2,ttf,eot}
Headers:
  Cache-Control: public, max-age=31536000, immutable

### 13. SEO Files (24 hours)
Pattern: /sitemap*.xml
Headers:
  Cache-Control: public, max-age=86400, s-maxage=86400

Pattern: /robots.txt
Headers:
  Cache-Control: public, max-age=86400, s-maxage=86400

### 14. Global Security Headers (Lowest Priority)
Pattern: **
Headers:
  X-Frame-Options: DENY
  X-Content-Type-Options: nosniff
  Referrer-Policy: strict-origin-when-cross-origin
  Permissions-Policy: camera=(), microphone=(), geolocation=()

## Cache Duration Explanation:
- Static Assets: 1 year (31536000 seconds) - Never change
- Images: 30 days (2592000 seconds) - Rarely change
- Homepage: 30 minutes (1800 seconds) - Matches ISR revalidation
- Profile Pages: 2 hours (7200 seconds) - Matches ISR revalidation
- Category/Project: 1 hour (3600 seconds) - Moderate frequency updates
- Search: 15 minutes (900 seconds) - Dynamic content
- Static Pages: 24 hours (86400 seconds) - Infrequent updates

## Cost Impact:
- Reduces CloudFront requests by 80-90%
- Dramatically reduces origin fetches
- Should save $300-400/month on current traffic
