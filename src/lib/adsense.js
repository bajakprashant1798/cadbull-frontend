// lib/adsense.js
export const initializeAdSense = () => {
  if (typeof window !== 'undefined' && !window.adsbygoogle) {
    const script = document.createElement('script');
    script.async = true;
    script.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID}`;
    script.crossOrigin = 'anonymous';
    
    script.onload = () => {
      console.log('AdSense script loaded successfully');
      window.adsbygoogle = window.adsbygoogle || [];
    };
    
    script.onerror = () => {
      console.error('Failed to load AdSense script');
    };
    
    document.head.appendChild(script);
  }
};

export const refreshAds = () => {
  if (typeof window !== 'undefined' && window.adsbygoogle) {
    try {
      // Force refresh all ads on the page
      const ads = document.querySelectorAll('.adsbygoogle');
      ads.forEach((ad) => {
        if (ad.children.length === 0) {
          (window.adsbygoogle = window.adsbygoogle || []).push({});
        }
      });
    } catch (error) {
      console.error('Error refreshing ads:', error);
    }
  }
};

export const isAdSenseLoaded = () => {
  return typeof window !== 'undefined' && !!window.adsbygoogle;
};
