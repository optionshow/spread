import express from "express";
import path from "path";
import https from "https";
import { createServer as createViteServer } from "vite";

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Proxy API route to hide Google Sheets source URL
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
        
        // Define robust HTTPS fetch with redirect support
        csvData = await new Promise<string>((resolve, reject) => {
          const fetchWithRedirect = (targetUrl: string, depth = 0) => {
            if (depth > 5) {
              return reject(new Error("Too many redirects (depth > 5)"));
            }
            
            const reqGet = https.get(targetUrl, (resGet) => {
              const statusCode = resGet.statusCode || 0;
              
              // Handle redirect (e.g. 301, 302, 307, 308)
              if (statusCode >= 300 && statusCode < 400 && resGet.headers.location) {
                console.log(`Following redirect to: ${resGet.headers.location}`);
                fetchWithRedirect(resGet.headers.location, depth + 1);
                return;
              }
              
              if (statusCode < 200 || statusCode >= 300) {
                return reject(new Error(`HTTPS fallback returned status code ${statusCode}`));
              }
              
              const chunks: any[] = [];
              resGet.on("data", (chunk) => chunks.push(chunk));
              resGet.on("end", () => {
                resolve(Buffer.concat(chunks).toString("utf8"));
              });
            });
            
            reqGet.on("error", (err) => {
              reject(err);
            });
            
            // Set timeout for safety
            reqGet.setTimeout(10000, () => {
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

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
