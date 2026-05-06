import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { createServer as createViteServer } from "vite";
import cors from "cors";
import morgan from "morgan";
import { Resend } from "resend";
import * as dotenv from "dotenv";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Global logger for every request
  app.use((req, res, next) => {
    console.log(`[INCOMING] ${new Date().toISOString()} | ${req.method} ${req.url}`);
    next();
  });

  app.use(cors());
  app.use(morgan('dev'));
  app.use(express.json());

  // Technical Connectivity Check
  app.get("/api/ping", (req, res) => {
    res.json({ status: "online", protocol: "QUETTRIX-ALPHA", time: new Date().toISOString() });
  });

  // The Master Booking Protocol
  const handleBooking = async (req: express.Request, res: express.Response) => {
    console.log(`[PROTOCOL_ENGAGED] Start: ${req.body.email || "anonymous"}`);
    
    try {
      const { name, email, message, tier, bookingDetails } = req.body;
      const apiKey = process.env.RESEND_API_KEY;
      const adminEmail = process.env.ADMIN_EMAIL || 'provenly.main@gmail.com';
      const senderEmail = process.env.SENDER_EMAIL || 'hello@quettrix.com';

      if (!apiKey) {
        console.error("[SHUTDOWN] RESEND_API_KEY IS UNDEFINED");
        return res.status(503).json({ 
          success: false,
          error: "API Key Missing. Configure terminal secrets." 
        });
      }

      const resend = new Resend(apiKey);
      const dateStr = bookingDetails?.date ? new Date(bookingDetails.date).toLocaleDateString() : "TBD";
      const timeStr = bookingDetails?.time || "TBD";
      const tzStr = bookingDetails?.timezone || "UTC";

      // Dispatch Admin Alert
      await resend.emails.send({
        from: `SYSTEM <${senderEmail}>`,
        to: [adminEmail],
        subject: `[UPLINK] ${name} - ${tier || "CORE"}`,
        html: `<h3>Project Initialized</h3><p>Client: ${name} (${email})</p><p>Brief: ${message}</p>`
      });

      // Dispatch Client Confirmation
      await resend.emails.send({
        from: `QUETTRIX <${senderEmail}>`,
        to: [email],
        subject: "Project Verification: Protocol Active",
        html: `<h1>QUETTRIX LABS</h1><p>Reservation Confirmed for ${dateStr} at ${timeStr}.</p>`
      });

      console.log(`[SUCCESS] Booking synchronized for ${email}`);
      res.json({ success: true });
    } catch (err: any) {
      console.error("[FAILURE] Protocol Error:", err);
      res.status(500).json({ error: "Subsystem transmission error.", details: err.message });
    }
  };

  app.post("/api/protocol/book", handleBooking);
  app.post("/api/book", handleBooking); // Alias
  app.post("/api/contact", handleBooking); // Legacy Alias

  // Fail-safe for unhandled API
  app.all("/api/*", (req, res) => {
    console.warn(`[MISS] Unhandled API request: ${req.url}`);
    res.status(404).json({ error: "Endpoint not mapped in protocol." });
  });

  // Global error handler for JSON parsing etc.
  app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
    console.error('[SERVER ERROR]', err);
    res.status(500).json({ error: "Internal Server Protocol Exception" });
  });

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
    console.log(`[SYSTEM] Protocol initialized at http://localhost:${PORT}`);
  });
}

startServer();

