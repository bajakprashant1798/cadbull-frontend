// pages/download-redirect/[id].js
export default function DownloadRedirectFallback() {
  return (
    <div style={{ padding: 60, textAlign: "center" }}>
      <h2>Preparing your download...</h2>
      <p>If you are not redirected, <a href="/">return to homepage</a>.</p>
    </div>
  );
}

export async function getServerSideProps({ params, req, res }) {
  const { id } = params;

  // Pass cookies to your backend for authentication
  const apiBase = process.env.NEXT_PUBLIC_API_MAIN || process.env.API_MAIN;

  try {
    const fetchRes = await fetch(`${apiBase}/projects/download/${id}`, {
      headers: {
        Cookie: req.headers.cookie || "", // Pass cookies for auth
        "User-Agent": req.headers["user-agent"] || "",
      },
    });

    // Handle gold/pricing redirect
    if (fetchRes.status === 403) {
      const data = await fetchRes.json();
      if (data?.redirectUrl) {
        return {
          redirect: { destination: data.redirectUrl, permanent: false }
        };
      }
      if (data?.message?.toLowerCase().includes("download limit")) {
        return {
          redirect: { destination: "/download-limit", permanent: false }
        };
      }
    }
    if (fetchRes.status === 401) {
      // Not logged in
      return {
        redirect: { destination: "/auth/login", permanent: false }
      };
    }
    if (fetchRes.status === 404) {
      return { notFound: true };
    }

    // Success: { url }
    const result = await fetchRes.json();
    if (result?.url) {
      res.writeHead(302, { Location: result.url });
      res.end();
      return { props: {} };
    }
  } catch (e) {
    // Fall through
  }
  return { props: {} }; // fallback UI if something went wrong
}