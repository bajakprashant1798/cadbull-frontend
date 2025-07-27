import { useEffect } from "react";
import { useRouter } from "next/router";

const AdSense = ({
  style = { display: "block", textAlign: "center" },
  slot , // <-- replace with your real slot ID!
  format = "auto",
  layout = "", // New prop for things like "in-article"
}) => {
  const router = useRouter();
  useEffect(() => {
    try {
      if (window) {
        (window.adsbygoogle = window.adsbygoogle || []).push({});
      }
    } catch (e) {
      // ignore for SSR
    }
  }, [router.asPath]);
  return (
    <ins
      className="adsbygoogle"
      style={style}
      data-ad-client={process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID}
      data-ad-slot={slot}
      data-ad-format={format}
      data-ad-layout={layout}
      data-full-width-responsive="true"
    ></ins>
  );
};

export default AdSense;
