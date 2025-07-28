import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/router";

const AdSense = ({
  style = { display: "block", textAlign: "center" },
  slot,
  format = "auto",
  layout = "", // New prop for things like "in-article"
  responsive = "true",
}) => {
  const router = useRouter();
  const [adVisible, setAdVisible] = useState(false);
  const adContainerRef = useRef(null);

  useEffect(() => {
    // Don't run ad code in development to prevent errors and allow for styling.
    if (process.env.NODE_ENV === "development") {
      return;
    }

    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch (err) {
      console.error("AdSense error:", err);
    }
  }, [router.asPath, slot]);

  useEffect(() => {
    if (process.env.NODE_ENV === "development") {
      setAdVisible(true);
      return;
    }

    const adInsElement = adContainerRef.current?.querySelector('.adsbygoogle');
    if (!adInsElement) return;

    const observer = new MutationObserver(() => {
      // An ad is loaded if the <ins> tag has child nodes or its status is 'filled'.
      if (adInsElement.hasChildNodes() || adInsElement.getAttribute('data-ad-status') === 'filled') {
        setAdVisible(true);
        observer.disconnect();
      }
    });

    observer.observe(adInsElement, {
      attributes: true,
      childList: true,
    });

    return () => observer.disconnect();
  }, [slot]);

  // In development, render a placeholder for layout purposes.
  // This is the "box" you are seeing, which is correct for localhost.
  if (process.env.NODE_ENV === "development") {
    return (
      <div
        ref={adContainerRef}
        className="ad-container ad-loaded" // Always show border in dev
        style={{
          ...style,
          background: "#f0f0f0",
          color: "#999",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        Ad Placeholder (Slot: {slot})
      </div>
    );
  }

  return (
    <div ref={adContainerRef} key={slot} className={`ad-container ${adVisible ? 'ad-loaded' : ''}`}>
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
