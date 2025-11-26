// lib/serverApi.js
import axios from "axios";
import crypto from "crypto";
import https from "https";
import { URL } from "url";

export function createServerApi(reqOrCtx) {
  const req = reqOrCtx?.req || reqOrCtx || {};
  // pick base - ensure no trailing slash
  const envBase = (process.env.API_BASE_URL_INTERNAL || process.env.NEXT_PUBLIC_API_MAIN || "https://api.cadbull.com:7081").replace(/\/$/, "");
  const baseURL = envBase; // e.g. https://api.cadbull.com:7081 (no /api suffix)

  let hostname = "api.cadbull.com";
  try {
    const parsed = new URL(baseURL);
    if (parsed.hostname) hostname = parsed.hostname;
  } catch (e) {}

  const viewerIp =
    req?.headers?.["cf-connecting-ip"] ||
    (req?.headers?.["x-forwarded-for"] || "").split(",")[0]?.trim() ||
    req?.socket?.remoteAddress ||
    "127.0.0.1";

  const ts = Math.floor(Date.now() / 1000).toString();

  const headers = {
    "x-viewer-ip": viewerIp,
    "x-ssr-ts": ts,
    "x-internal-ssr": "1",
    Host: hostname,
    ...(req?.headers?.cookie ? { Cookie: req.headers.cookie } : {}),
  };

  const SECRET = process.env.SSR_SIGNING_SECRET || "";
  if (SECRET) {
    try {
      headers["x-ssr-sig"] = crypto.createHmac("sha256", SECRET).update(`${viewerIp}.${ts}`).digest("hex");
    } catch (e) {
      console.warn("createServerApi: HMAC failed", e?.message || e);
    }
  }

  const instance = axios.create({
    baseURL,
    timeout: 20000,
    withCredentials: true,
    headers,
    httpsAgent: new https.Agent({
      servername: hostname,
      rejectUnauthorized: false, // set true in prod if you want TLS verification
    }),
  });

  instance.interceptors.response.use(
    (res) => res,
    (err) => {
      if (err?.config) {
        err.meta = {
          url: err.config.url,
          method: err.config.method,
          baseURL: err.config.baseURL,
          timeout: err.config.timeout,
          status: err.response?.status,
          data: err.response?.data,
        };
      }
      return Promise.reject(err);
    }
  );

  return instance;
}

export default createServerApi;