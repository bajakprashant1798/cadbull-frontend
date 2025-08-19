// import { useEffect, useRef, useState } from "react";
// import { useRouter } from "next/router";

// const AdSense = ({
//   // style = { display: "block", textAlign: "center", minHeight: 280 },
//   style, // no default here
//   slot,
//   format = "auto",
//   layout, // New prop for things like "in-article"
//   responsive = "true",
//   sidebar = false 
// }) => {
//   const router = useRouter();
//   const adRef = useRef(null);
//   const isAdLoaded = useRef(false);
//   const [uniqueKey, setUniqueKey] = useState(0);

//   // ✅ Read once; Next will inline this at build time
//   const clientId = process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID;

//   const baseStyle = { display: "block", textAlign: "center" };
//   const styleFinal = style
//     ? style
//     : (layout === "in-article" || format === "fluid")
//       ? baseStyle                      // no minHeight for fluid/in-article
//       : { ...baseStyle, minHeight: 280 }; // reserve space for standard display


//   useEffect(() => {
//     // Reset on route change
//     isAdLoaded.current = false;
//     setUniqueKey(prev => prev + 1);

//     // Don't run ad code in development to prevent errors and allow for styling.
//     if (process.env.NODE_ENV === "development") {
//       return;
//     }

//     // If clientId is missing, don't try to load/push ads
//     if (!clientId) return;

//     // ✅ Enhanced ad loading with better error handling
//     const loadAd = () => {
//       try {
//         const adElement = adRef.current?.querySelector('.adsbygoogle');
        
//         // Check if element exists and is empty
//         if (!adElement) {
//           // console.warn(`AdSense element not found for slot: ${slot}`);
//           return;
//         }

//         // Check if already loaded
//         if (adElement.getAttribute('data-ad-status') === 'filled' || 
//             adElement.children.length > 0 ||
//             isAdLoaded.current) {
//           // console.log(`AdSense slot ${slot} already loaded`);
//           return;
//         }

//         // Check if adsbygoogle is available
//         if (typeof window !== 'undefined' && window.adsbygoogle) {
//           try {
//             // ✅ FIXED: Force refresh for SSG pages
//             if (adElement.hasAttribute('data-adsbygoogle-status')) {
//               adElement.removeAttribute('data-adsbygoogle-status');
//             }
            
//             // Push the ad request
//             (window.adsbygoogle = window.adsbygoogle || []).push({});
//             isAdLoaded.current = true;
//             // console.log(`✅ AdSense ad loaded for slot: ${slot}`);
//           } catch (pushError) {
//             console.error("AdSense push error:", pushError);
//             // Handle "already have ads" error gracefully
//             if (pushError.message && pushError.message.includes('already have ads')) {
//               isAdLoaded.current = true;
//             }
//           }
//         } else {
//           console.warn('AdSense script not loaded yet, retrying...');
//           // Retry after a short delay
//           setTimeout(loadAd, 1000);
//         }
//       } catch (err) {
//         console.error("AdSense error:", err);
//         // Retry once after error
//         if (!isAdLoaded.current) {
//           setTimeout(loadAd, 2000);
//         }
//       }
//     };

//     // ✅ Delay initial load to ensure script is ready
//     const timer = setTimeout(loadAd, 500);

//     return () => {
//       clearTimeout(timer);
//     };
//   }, [router.asPath, slot, clientId]); // Re-run effect when path or slot changes

//   // In development, render a placeholder for layout purposes.
//   if (process.env.NODE_ENV === "development") {
//     return (
//       <div
//         className="ad-container"
//         style={{
//           ...style,
//           background: "#f0f0f0",
//           color: "#999",
//           display: "flex",
//           alignItems: "center",
//           justifyContent: "center",
//           // minHeight: '90px',
//           border: '1px dashed #ccc',
//           borderRadius: '4px'
//         }}
//       >
//         🟦 Ad Placeholder (Slot: {slot})
//       </div>
//     );
//   }

//   // ✅ Guardrail: if client ID is missing, avoid rendering a broken ad tag
//   if (!clientId) {
//     // In production, silently render nothing
//     // (You can log once here if you want)
//     if (typeof window !== "undefined") {
//       // console.warn("AdSense client ID is missing");
//     }
//     return null;
//   }

//   const dataProps = sidebar
//     ? { "data-ad-format": "auto" }     // standard responsive
//     : { "data-ad-format": format, ...(layout ? { "data-ad-layout": layout } : {}) };

//   return (
//     <div ref={adRef} className="ad-container">
//       <ins
//         key={`adsense-${slot}-${uniqueKey}-${router.asPath}`}
//         className="adsbygoogle"
//         // style={style}
//         style={styleFinal}
//         data-ad-client={clientId}
//         data-ad-slot={slot}
//         // data-ad-format={format}
//         // data-ad-layout={layout}
//         // data-full-width-responsive={responsive}
//         {...dataProps}
//         data-full-width-responsive={responsive}
//       />
//     </div>
//   );
// };

// export default AdSense;



import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/router";

const AdSense = ({
  style,
  slot,
  format = "auto",
  layout,               // e.g. "in-article"
  responsive = "true",
  sidebar = false,
  lazy = true,          // 👈 default: lazy mount; set lazy={false} for the first ad
  className
}) => {
  const router = useRouter();
  const containerRef = useRef(null);
  const pushedRef = useRef(false);
  const [mounted, setMounted] = useState(!lazy); // render <ins> immediately only if not lazy
  const [keyBump, setKeyBump] = useState(0);

  const clientId = process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID;
  const baseStyle = { display: "block", textAlign: "center" };
  const styleFinal = style
    ? style
    : (layout === "in-article" || format === "fluid")
      ? baseStyle                     // use CSS .ad-slot min-heights for fluid/in-article
      : { ...baseStyle, minHeight: 280 };

  // Start observing when lazy
  useEffect(() => {
    if (!lazy) return;
    const el = containerRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setMounted(true);           // now render <ins>
          io.disconnect();
        }
      },
      { rootMargin: "300px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [lazy]);

  // Re-key on route change so <ins> is fresh on new pages
  useEffect(() => {
    pushedRef.current = false;
    setKeyBump(x => x + 1);
  }, [router.asPath, slot]);

  // Push ad request after <ins> is in the DOM
  useEffect(() => {
    if (!mounted || pushedRef.current) return;
    if (typeof window === "undefined") return;
    if (!clientId) return;

    const tryPush = () => {
      const ins = containerRef.current?.querySelector(".adsbygoogle");
      if (!ins) return;

      try {
        if (ins.hasAttribute("data-adsbygoogle-status")) {
          ins.removeAttribute("data-adsbygoogle-status");
        }
        (window.adsbygoogle = window.adsbygoogle || []).push({});
        pushedRef.current = true;
      } catch (err) {
        // Retry once if the script wasn’t ready
        setTimeout(() => {
          try {
            (window.adsbygoogle = window.adsbygoogle || []).push({});
            pushedRef.current = true;
          } catch {}
        }, 600);
      }
    };

    // slight delay to ensure script is ready
    const t = setTimeout(tryPush, 300);
    return () => clearTimeout(t);
  }, [mounted, clientId]);

  if (process.env.NODE_ENV === "development") {
    return (
      <div
        ref={containerRef}
        className={`ad-container ${className || ""}`}
        style={{
          ...styleFinal,
          background: "#f0f0f0",
          color: "#999",
          border: "1px dashed #ccc",
          borderRadius: 4,
          display: "flex",
          alignItems: "center",
          justifyContent: "center"
        }}
      >
        🟦 Ad Placeholder (Slot: {slot})
      </div>
    );
  }

  if (!clientId) return null;

  const dataProps = sidebar
    ? { "data-ad-format": "auto" }
    : { "data-ad-format": format, ...(layout ? { "data-ad-layout": layout } : {}) };

  return (
    <div ref={containerRef} className={`ad-container ${className || ""}`}>
      {mounted && (
        <ins
          key={`adsense-${slot}-${keyBump}`}
          className="adsbygoogle"
          style={styleFinal}
          data-ad-client={clientId}
          data-ad-slot={slot}
          data-full-width-responsive={responsive}
          {...dataProps}
        />
      )}
    </div>
  );
};

export default AdSense;
