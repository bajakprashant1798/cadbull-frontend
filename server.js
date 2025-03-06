// server.js
require("dotenv").config();
const { createServer } = require("http");
const { parse } = require("url");
const next = require("next");
const { createProxyMiddleware } = require("http-proxy-middleware");

const dev = true;
const app = next({ dev });
const handle = app.getRequestHandler();

// Set your backend API target (make sure to include the /api part if needed)
const API_TARGET = "https://cadbull-backend.onrender.com";

// Start Next.js and our custom server
app.prepare().then(() => {
  createServer((req, res) => {
    const parsedUrl = parse(req.url, true);

    // If the request URL starts with /api, proxy it to your backend API.
    if (parsedUrl.pathname.startsWith("/api")) {
      // You can optionally rewrite the path. For example, if your backend expects the route without the /api prefix:
      createProxyMiddleware({
        target: API_TARGET,
        changeOrigin: true,
        secure: true,
        // pathRewrite: { "^/api": "" }, // remove /api prefix when forwarding
        logLevel: "debug",
      })(req, res, (err) => {
        if (err) {
          console.error("Proxy error:", err);
          res.writeHead(500);
          res.end("Proxy error");
        }
      });
    } else {
      // Otherwise, let Next.js handle the request.
      handle(req, res, parsedUrl);
    }
  }).listen(3000, (err) => {
    if (err) throw err;
    console.log("> Ready on http://localhost:3000");
  });
});
