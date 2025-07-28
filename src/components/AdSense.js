import { useEffect } from "react";
import { useRouter } from "next/router";

const AdSense = ({
  style = { display: "block", textAlign: "center" },
  slot,
  format = "auto",
  layout = "", // New prop for things like "in-article"
  responsive = "true",
}) => {
  const router = useRouter();

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
  }, [router.asPath, slot]); // Re-run effect when path or slot changes

  // In development, render a placeholder for layout purposes.
  // This is the "box" you are seeing, which is correct for localhost.
  if (process.env.NODE_ENV === "development") {
    return (
      <div
        style={{
          ...style,
          background: "#f0f0f0",
          border: "1px solid #ccc",
          color: "#999",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          minHeight: '90px'
        }}
      >
        Ad Placeholder (Slot: {slot})
      </div>
    );
  }

  return (
    // The key is crucial for ads to reload on client-side navigation
    // Using the slot as a key ensures each ad unit is unique on the page.
    // <div key={slot}>
      <ins
        className="adsbygoogle"
        style={style}
        data-ad-client={process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID}
        data-ad-slot={slot}
        data-ad-format={format}
        data-ad-layout={layout}
        data-full-width-responsive={responsive}
      ></ins>
    // </div>
  );
};

export default AdSense;
