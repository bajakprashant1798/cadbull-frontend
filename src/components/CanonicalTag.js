// components/CanonicalTag.js
import Head from "next/head";
import { useRouter } from "next/router";

export default function CanonicalTag({ baseUrl = "https://beta.cadbull.com" }) {
  const router = useRouter();
  // Remove hash and query strings
  const path = router.asPath.split(/[?#]/)[0];
  // Avoid double slash at root
  const canonicalUrl = baseUrl + (path === "/" ? "" : path);

  return (
    <Head>
      <link rel="canonical" href={canonicalUrl} />
    </Head>
  );
}
