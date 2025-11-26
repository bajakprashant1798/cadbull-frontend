// lib/serverApi.js
import axios from "axios";
import crypto from "crypto";
import https from "https";
import { URL } from "url";

/**
 * createServerApi(reqOrCtx)
 *
 * - reqOrCtx: Node request (e.g. `req` from getServerSideProps/context) OR context object that contains `req`.
 * - Returns an axios instance configured for internal server -> API calls:
 *    - baseURL from API_BASE_URL_INTERNAL || NEXT_PUBLIC_API_MAIN
 *    - mounts Host header and SNI to ensure proper vhost selection when using IP
 *    - forwards cookies from incoming request (if present)
 *    - includes helpful SSR headers: x-internal-ssr, x-ssr-ts, x-viewer-ip
 *    - optionally signs request with HMAC when SSR_SIGNING_SECRET is set
 */
export function createServerApi(reqOrCtx) {
  const req = reqOrCtx?.req || reqOrCtx || {};
  const envBase = process.env.API_BASE_URL_INTERNAL || "";
  // Ensure we have a base; fallback to localhost loopback if nothing provided
  const baseURL = envBase || "https://127.0.0.1:7081";

  // Derive a sensible hostname for SNI / Host header (default to api.cadbull.com)
  let hostname = "api.cadbull.com";
  try {
    const parsed = new URL(baseURL);
    if (parsed.hostname) hostname = parsed.hostname;
  } catch (e) {
    // ignore, use fallback hostname
  }

  // Determine viewer IP for logging/signing
  const viewerIp =
    req?.headers?.["cf-connecting-ip"] ||
    (req?.headers?.["x-forwarded-for"] || "").split(",")[0]?.trim() ||
    req?.socket?.remoteAddress ||
    "127.0.0.1";

  // Timestamp for SSR header
  const ts = Math.floor(Date.now() / 1000).toString();

  // Prepare headers forwarded to internal API
  const headers = {
    "x-viewer-ip": viewerIp,
    "x-ssr-ts": ts,
    "x-internal-ssr": "1",
    // Set Host header so Apache/nginx selects correct vhost when using IP or manual SNI
    Host: hostname,
    // Forward incoming cookie header to API (so internal APIs can see auth cookies)
    ...(req?.headers?.cookie ? { Cookie: req.headers.cookie } : {}),
  };

  // Optional HMAC signature (if SSR_SIGNING_SECRET is configured)
  const SECRET = process.env.SSR_SIGNING_SECRET || "";
  if (SECRET) {
    try {
      const sig = crypto.createHmac("sha256", SECRET).update(`${viewerIp}.${ts}`).digest("hex");
      headers["x-ssr-sig"] = sig;
    } catch (e) {
      // don't throw — signature is optional
      // eslint-disable-next-line no-console
      console.warn("createServerApi: failed to compute HMAC signature", e?.message || e);
    }
  }

  // Create axios instance
  const instance = axios.create({
    baseURL,
    timeout: 20000,
    withCredentials: true, // allow cookies to be sent/received
    headers,
    httpsAgent: new https.Agent({
      servername: hostname,      // force SNI to hostname even when connecting to IP
      rejectUnauthorized: false, // set to true in prod if you have valid certs and want verification
    }),
  });

  // Response interceptor: helpful debug info (optional)
  instance.interceptors.response.use(
    (res) => res,
    (err) => {
      // attach some request meta to error for logging in SSR
      if (err?.config) {
        err.meta = {
          url: err.config.url,
          method: err.config.method,
          baseURL: err.config.baseURL,
          timeout: err.config.timeout,
        };
      }
      return Promise.reject(err);
    }
  );

  return instance;
}

export default createServerApi;