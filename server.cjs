var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));

// server.ts
var import_express = __toESM(require("express"), 1);
var import_path = __toESM(require("path"), 1);
var import_https = __toESM(require("https"), 1);
var import_vite = require("vite");
async function startServer() {
  const app = (0, import_express.default)();
  const PORT = 3e3;
  app.get("/api/performance-stats", async (req, res) => {
    try {
      console.log("Fetching performance stats from Google Sheets source...");
      const sheetUrl = "https://docs.google.com/spreadsheets/d/1GjsqJI7ivGiT3xZQ6VJ2Sy7rQ42ePfC1I6NKiNMRxCU/export?format=csv&gid=0";
      let csvData = "";
      try {
        const response = await fetch(sheetUrl);
        if (response.ok) {
          csvData = await response.text();
          console.log("Successfully fetched stats using native fetch.");
        } else {
          console.warn(`Native fetch returned status: ${response.status}. Trying HTTPS fallback...`);
          throw new Error(`HTTP Status ${response.status}`);
        }
      } catch (fetchErr) {
        console.warn("Native fetch failed or returned non-200. Using HTTPS module fallback...", fetchErr);
        csvData = await new Promise((resolve, reject) => {
          const fetchWithRedirect = (targetUrl, depth = 0) => {
            if (depth > 5) {
              return reject(new Error("Too many redirects (depth > 5)"));
            }
            const reqGet = import_https.default.get(targetUrl, (resGet) => {
              const statusCode = resGet.statusCode || 0;
              if (statusCode >= 300 && statusCode < 400 && resGet.headers.location) {
                console.log(`Following redirect to: ${resGet.headers.location}`);
                fetchWithRedirect(resGet.headers.location, depth + 1);
                return;
              }
              if (statusCode < 200 || statusCode >= 300) {
                return reject(new Error(`HTTPS fallback returned status code ${statusCode}`));
              }
              const chunks = [];
              resGet.on("data", (chunk) => chunks.push(chunk));
              resGet.on("end", () => {
                resolve(Buffer.concat(chunks).toString("utf8"));
              });
            });
            reqGet.on("error", (err) => {
              reject(err);
            });
            reqGet.setTimeout(1e4, () => {
              reqGet.destroy();
              reject(new Error("Request timed out (10s)"));
            });
          };
          fetchWithRedirect(sheetUrl);
        });
        console.log("Successfully fetched stats using HTTPS fallback.");
      }
      res.setHeader("Content-Type", "text/csv; charset=utf-8");
      res.send(csvData);
    } catch (err) {
      console.error("Proxy error fetching performance stats:", err);
      res.status(500).json({
        error: "Internal server error fetching data",
        details: err instanceof Error ? err.message : String(err)
      });
    }
  });
  if (process.env.NODE_ENV !== "production") {
    const vite = await (0, import_vite.createServer)({
      server: { middlewareMode: true },
      appType: "spa"
    });
    app.use(vite.middlewares);
  } else {
    const distPath = import_path.default.join(process.cwd(), "dist");
    app.use(import_express.default.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(import_path.default.join(distPath, "index.html"));
    });
  }
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}
startServer();
//# sourceMappingURL=server.cjs.map
