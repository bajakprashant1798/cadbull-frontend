// components/withAdSense.js
import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { refreshAds, isAdSenseLoaded } from '../lib/adsense';

const withAdSense = (WrappedComponent) => {
  const AdSenseWrapper = (props) => {
    const router = useRouter();

    useEffect(() => {
      // ✅ Refresh ads when page changes
      const handleRouteChange = () => {
        if (isAdSenseLoaded()) {
          // Small delay to ensure DOM is ready
          setTimeout(() => {
            refreshAds();
          }, 100);
        }
      };

      router.events.on('routeChangeComplete', handleRouteChange);
      
      // Initial load
      handleRouteChange();

      return () => {
        router.events.off('routeChangeComplete', handleRouteChange);
      };
    }, [router.events]);

    return <WrappedComponent {...props} />;
  };

  AdSenseWrapper.displayName = `withAdSense(${WrappedComponent.displayName || WrappedComponent.name})`;
  
  return AdSenseWrapper;
};

export default withAdSense;
