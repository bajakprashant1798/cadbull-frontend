import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/router";

const AdSense = ({
  style = { display: "block", textAlign: "center", minHeight: 250 },
  slot,
  format = "auto",
  layout = "",
  responsive = "true",
}) => {
  const router = useRouter();
  const wrapRef = useRef(null);
  const insRef = useRef(null);
  const [keyBump, setKeyBump] = useState(0);
  const visObsRef = useRef(null);
  const pushedRef = useRef(false);

  // Dev placeholder for layout
  if (process.env.NODE_ENV === "development") {
    return (
      <div
        style={{
          ...style,
          background: "#f0f0f0",
          color: "#999",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          border: "1px dashed #ccc",
          borderRadius: 4,
        }}
      >
        🟦 Ad Placeholder (Slot: {slot})
      </div>
    );
  }

  // Clean up ad slot before new push
  const resetIns = () => {
    const el = insRef.current;
    if (!el) return;
    el.innerHTML = "";
    el.removeAttribute("data-ad-status");
    el.removeAttribute("data-adsbygoogle-status");
    pushedRef.current = false;
  };

  // Push ad when visible
  const pushAd = () => {
    if (pushedRef.current) return;
    if (typeof window === "undefined" || !window.adsbygoogle) {
      setTimeout(pushAd, 500);
      return;
    }
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
      pushedRef.current = true;
    } catch (e) {
      pushedRef.current = true;
    }
  };

  useEffect(() => {
    setKeyBump(k => k + 1);
    resetIns();

    // Disconnect previous observer
    if (visObsRef.current) {
      visObsRef.current.disconnect();
      visObsRef.current = null;
    }

    const el = wrapRef.current;
    if (!el) return;

    // Intersection Observer for lazy ad loading
    const obs = new window.IntersectionObserver(
      entries => {
        const first = entries[0];
        if (first && first.isIntersecting) {
          pushAd();
          obs.disconnect();
          visObsRef.current = null;
        }
      },
      { rootMargin: "200px 0px" }
    );
    obs.observe(el);
    visObsRef.current = obs;

    // Cleanup on unmount or route change
    return () => {
      if (visObsRef.current) {
        visObsRef.current.disconnect();
        visObsRef.current = null;
      }
    };
  }, [router.asPath, slot]);

  return (
    <div ref={wrapRef} className="ad-container" style={{ minHeight: 90, ...style }}>
      <ins
        key={`ad-${slot}-${keyBump}-${router.asPath}`}
        ref={insRef}
        className="adsbygoogle"
        style={style}
        data-ad-client={process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID}
        data-ad-slot={slot}
        data-ad-format={format}
        data-ad-layout={layout}
        data-full-width-responsive={responsive}
        {...(process.env.NODE_ENV !== "production" ? { "data-adtest": "on" } : {})}
      />
    </div>
  );
};

export default AdSense;