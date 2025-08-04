import { useEffect, useRef } from "react";
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

  useEffect(() => {
    // Don't run ad code in development to prevent errors and allow for styling.
    if (process.env.NODE_ENV === "development") {
      return;
    }

    // ✅ Enhanced ad loading with better error handling
    const loadAd = () => {
      try {
        // Check if adsbygoogle is available
        if (typeof window !== 'undefined' && window.adsbygoogle) {
          // Clear any existing ad content
          if (adRef.current) {
            // Remove any existing ad content but keep the ins element
            const existingAds = adRef.current.querySelectorAll('.adsbygoogle');
            existingAds.forEach(ad => {
              if (ad !== adRef.current.querySelector('.adsbygoogle')) {
                ad.remove();
              }
            });
          }

          // Push the ad request
          (window.adsbygoogle = window.adsbygoogle || []).push({});
          isAdLoaded.current = true;
          console.log(`AdSense ad loaded for slot: ${slot}`);
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
    const timer = setTimeout(loadAd, 100);

    return () => {
      clearTimeout(timer);
      isAdLoaded.current = false;
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
    <div ref={adRef} key={`${slot}-${router.asPath}`} className="ad-container">
      <ins
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
