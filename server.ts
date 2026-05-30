import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";
import analyzeHandler from "./api/analyze";
import contactHandler from "./api/contact";
import statusHandler from "./api/status";
import smeApplyHandler from "./api/sme-apply";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Routes
  app.post("/api/analyze", (req: any, res: any) => analyzeHandler(req, res));
  app.post("/api/contact", (req: any, res: any) => contactHandler(req, res));
  app.post("/api/sme-apply", (req: any, res: any) => smeApplyHandler(req, res));
  app.get("/api/status", (req: any, res: any) => statusHandler(req, res));

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
