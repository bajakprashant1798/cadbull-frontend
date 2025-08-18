// components/CanonicalTag.js
import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default function CanonicalTag({ baseUrl = "https://cadbull.com" }) {
  const router = useRouter();
  const [canonicalUrl, setCanonicalUrl] = useState("");

  useEffect(() => {
    // Remove hash and query strings
    const path = router.asPath.split(/[?#]/)[0];
    // Avoid double slash at root
    const url = baseUrl + (path === "/" ? "" : path);
    setCanonicalUrl(url);
  }, [router.asPath, baseUrl]); // Update when route changes

  // Only render when we have a canonical URL
  if (!canonicalUrl) return null;

  return (
    <Head>
      <link rel="canonical" href={canonicalUrl} key="canonical" />
    </Head>
  );
}
