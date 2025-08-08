import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/router";

const AdSense = ({
  style = { display: "block", textAlign: "center" },
  slot,
  format = "auto",
  layout = "", // New prop for things like "in-article"
  responsive = "true",
}) => {
  const router = useRouter();
  const adRef = useRef(null);
  const isAdLoaded = useRef(false);
  const [uniqueKey, setUniqueKey] = useState(0);

  useEffect(() => {
    // Reset on route change
    isAdLoaded.current = false;
    setUniqueKey(prev => prev + 1);

    // Don't run ad code in development to prevent errors and allow for styling.
    if (process.env.NODE_ENV === "development") {
      return;
    }

    // ✅ Enhanced ad loading with better error handling
    const loadAd = () => {
      try {
        const adElement = adRef.current?.querySelector('.adsbygoogle');
        
        // Check if element exists and is empty
        if (!adElement) {
          console.warn(`AdSense element not found for slot: ${slot}`);
          return;
        }

        // Check if already loaded
        if (adElement.getAttribute('data-ad-status') === 'filled' || 
            adElement.children.length > 0 ||
            isAdLoaded.current) {
          console.log(`AdSense slot ${slot} already loaded`);
          return;
        }

        // Check if adsbygoogle is available
        if (typeof window !== 'undefined' && window.adsbygoogle) {
          try {
            // ✅ FIXED: Force refresh for SSG pages
            if (adElement.hasAttribute('data-adsbygoogle-status')) {
              adElement.removeAttribute('data-adsbygoogle-status');
            }
            
            // Push the ad request
            (window.adsbygoogle = window.adsbygoogle || []).push({});
            isAdLoaded.current = true;
            console.log(`✅ AdSense ad loaded for slot: ${slot}`);
          } catch (pushError) {
            console.error("AdSense push error:", pushError);
            // Handle "already have ads" error gracefully
            if (pushError.message && pushError.message.includes('already have ads')) {
              isAdLoaded.current = true;
            }
          }
        } else {
          console.warn('AdSense script not loaded yet, retrying...');
          // Retry after a short delay
          setTimeout(loadAd, 1000);
        }
      } catch (err) {
        console.error("AdSense error:", err);
        // Retry once after error
        if (!isAdLoaded.current) {
          setTimeout(loadAd, 2000);
        }
      }
    };

    // ✅ Delay initial load to ensure script is ready
    const timer = setTimeout(loadAd, 500);

    return () => {
      clearTimeout(timer);
    };
  }, [router.asPath, slot]); // Re-run effect when path or slot changes

  // In development, render a placeholder for layout purposes.
  if (process.env.NODE_ENV === "development") {
    return (
      <div
        className="ad-container"
        style={{
          ...style,
          background: "#f0f0f0",
          color: "#999",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          minHeight: '90px',
          border: '1px dashed #ccc',
          borderRadius: '4px'
        }}
      >
        🟦 Ad Placeholder (Slot: {slot})
      </div>
    );
  }

  return (
    <div ref={adRef} className="ad-container">
      <ins
        key={`adsense-${slot}-${uniqueKey}`}
        className="adsbygoogle"
        style={style}
        data-ad-client={process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID}
        data-ad-slot={slot}
        data-ad-format={format}
        data-ad-layout={layout}
        data-full-width-responsive={responsive}
      ></ins>
    </div>
  );
};

export default AdSense;
