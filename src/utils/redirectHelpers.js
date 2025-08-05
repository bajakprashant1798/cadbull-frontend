// utils/redirectHelpers.js

/**
 * Redirects user to login with current page as return URL
 * @param {Object} router - Next.js router object
 * @param {string} loginPath - Login page path (default: '/auth/login')
 */
export const redirectToLogin = (router, loginPath = '/auth/login') => {
  const currentPath = router.asPath;
  const loginUrl = `${loginPath}?redirect=${encodeURIComponent(currentPath)}`;
  
  console.log('🔑 redirectToLogin called:', {
    currentPath,
    encodedPath: encodeURIComponent(currentPath),
    loginUrl
  });
  
  router.push(loginUrl);
};

/**
 * Redirects user after successful login
 * @param {Object} router - Next.js router object
 * @param {Object} user - User object
 * @param {string} defaultPath - Default redirect path
 */
export const redirectAfterLogin = (router, user, defaultPath = '/') => {
  const redirectUrl = router.query.redirect;
  
  console.log('🔄 redirectAfterLogin called with:', {
    redirectUrl,
    userRole: user.role,
    routerQuery: router.query,
    defaultPath,
    routerAsPath: router.asPath,
    currentURL: typeof window !== 'undefined' ? window.location.href : 'SSR'
  });
  
  // Admin users always go to dashboard
  if (user.role === 1 || user.role === 5) {
    console.log('👤 Admin user detected, redirecting to dashboard');
    router.push('/admin/dashboard');
    return;
  }
  
  // Regular users: redirect to original page or default
  if (redirectUrl && redirectUrl !== '/auth/login') {
    const decodedUrl = decodeURIComponent(redirectUrl);
    console.log('🎯 Redirecting to original page:', decodedUrl);
    router.push(decodedUrl);
  } else {
    console.log('🏠 No redirect URL found, going to default:', defaultPath);
    console.log('🔍 Full debug info:', {
      redirectUrl,
      redirectUrlType: typeof redirectUrl,
      redirectUrlLength: redirectUrl ? redirectUrl.length : 0,
      isEqualToLogin: redirectUrl === '/auth/login',
      allQueryParams: Object.keys(router.query)
    });
    router.push(defaultPath);
  }
};

/**
 * Checks if user is authenticated and redirects to login if not
 * @param {boolean} isAuthenticated - Authentication status
 * @param {Object} router - Next.js router object
 * @returns {boolean} - Returns true if authenticated, false if redirected to login
 */
export const requireAuth = (isAuthenticated, router) => {
  if (!isAuthenticated) {
    redirectToLogin(router);
    return false;
  }
  return true;
};
