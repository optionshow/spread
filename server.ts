import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Proxy API route to hide Google Sheets source URL
  app.get("/api/performance-stats", async (req, res) => {
    try {
      const sheetUrl = "https://docs.google.com/spreadsheets/d/1GjsqJI7ivGiT3xZQ6VJ2Sy7rQ42ePfC1I6NKiNMRxCU/export?format=csv&gid=0";
      const response = await fetch(sheetUrl);
      if (!response.ok) {
        return res.status(response.status).json({ error: "Failed to fetch spreadsheet from target" });
      }
      const csvData = await response.text();
      res.setHeader("Content-Type", "text/csv; charset=utf-8");
      res.send(csvData);
    } catch (err) {
      console.error("Proxy error:", err);
      res.status(500).json({ error: "Internal server error fetching data" });
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
