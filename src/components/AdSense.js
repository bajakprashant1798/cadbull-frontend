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
    try {
      // if (window) {
      //   (window.adsbygoogle = window.adsbygoogle || []).push({});
      // }
      //// The AdSense script checks this array and loads ads accordingly.
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch (err) {
      // Log the error for debugging in production, but don't crash the app.
      console.error("AdSense error:", err);
    }
  }, [router.asPath, slot]); // Re-run effect when path or slot changes
  return (
    <ins
      className="adsbygoogle"
      style={style}
      data-ad-client={process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID}
      data-ad-slot={slot}
      data-ad-format={format}
      data-ad-layout={layout}
      // data-full-width-responsive="true"
      data-full-width-responsive={responsive}
    ></ins>
  );
};

export default AdSense;
