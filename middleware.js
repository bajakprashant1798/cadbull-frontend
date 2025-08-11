import { NextResponse } from 'next/server';

export function middleware(request) {
  const { pathname, search } = request.nextUrl;
  
  // ✅ BLOCK OLD DOWNLOAD URLS - Return 410 Gone
  if (pathname.startsWith('/products/download/') || pathname.startsWith('/products/ampdownload/')) {
    return NextResponse.rewrite(new URL('/410', request.url));
  }
  
  // ✅ BLOCK OLD URL PATTERNS
  if (pathname === '/gold' || pathname === '/1.CAD') {
    return NextResponse.redirect(new URL('/categories', request.url), 301);
  }
  
  // ✅ HANDLE DETAIL PAGES WITH INVALID SLUG FORMATS
  const detailMatch = pathname.match(/^\/detail\/(\d+)\/(.+)$/);
  if (detailMatch) {
    const [, id, slug] = detailMatch;
    
    // Check if slug has invalid format (no hyphens, spaces, or special chars)
    const hasInvalidFormat = 
      !slug.includes('-') || 
      slug.includes(' ') || 
      slug.includes('?') || 
      slug.includes('.') ||
      slug.length < 5;
    
    if (hasInvalidFormat) {
      // Return 404 for invalid slug formats to prevent indexing
      return NextResponse.rewrite(new URL('/404', request.url));
    }
  }
  
  // ✅ BLOCK SPECIFIC REJECTED/PENDING PRODUCT IDs
  const detailProductMatch = pathname.match(/^\/detail\/(\d+)\//);
  if (detailProductMatch) {
    const [, productId] = detailProductMatch;
    // Note: REJECTED_PRODUCT_IDS would need to be imported if used
    // For now, add specific known rejected IDs here
    const rejectedIds = ['71588']; // Add more as needed
    if (rejectedIds.includes(productId)) {
      // Return 410 Gone for known rejected products
      return NextResponse.rewrite(new URL('/410', request.url));
    }
  }
  
  // ✅ BLOCK AMP PAGES FOR REJECTED PRODUCTS
  const ampProductMatch = pathname.match(/^\/amp\/(\d+)\//);
  if (ampProductMatch) {
    const [, productId] = ampProductMatch;
    const rejectedIds = ['71588']; // Add more as needed
    if (rejectedIds.includes(productId)) {
      // Return 410 Gone for known rejected products
      return NextResponse.rewrite(new URL('/410', request.url));
    }
  }
  
  // ✅ BLOCK CRAWLING OF PAGINATED URLS WITH QUERY PARAMS IN OLD FORMAT
  if (search.includes('page=') && search.includes('ext=')) {
    return NextResponse.rewrite(new URL('/404', request.url));
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - robots.txt
     * - sitemap.xml
     * - ads.txt
     */
    '/((?!api|_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml|ads.txt).*)',
  ],
};
