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

  app.use(cors());
  app.use(morgan('combined'));
  app.use(express.json());

  // Unified Booking Handler
  const handleBooking = async (req: express.Request, res: express.Response) => {
    console.log(`[BOOKING_PROTOCOL] Process started for ${req.body.email || "unknown contact"}`);
    
    const { name, email, message, tier, bookingDetails } = req.body;
    const apiKey = process.env.RESEND_API_KEY;
    const adminEmail = process.env.ADMIN_EMAIL || 'provenly.main@gmail.com';
    const senderEmail = process.env.SENDER_EMAIL || 'hello@quettrix.com';

    if (!apiKey) {
      console.error("[CRITICAL] RESEND_API_KEY missing from environment");
      return res.status(503).json({ 
        success: false,
        error: "RESEND_API_KEY missing. Contact administrator to configure the security portal." 
      });
    }

    const resend = new Resend(apiKey);

    try {
      const dateStr = bookingDetails?.date ? new Date(bookingDetails.date).toLocaleDateString() : "N/A";
      const timeStr = bookingDetails?.time || "N/A";
      const tzStr = bookingDetails?.timezone || "N/A";

      // 1. Send ALERT to ADMIN
      await resend.emails.send({
        from: `QUETTRIX SYSTEM <${senderEmail}>`,
        to: [adminEmail],
        subject: `[NEW BOOKING] ${name} - ${tier || "Custom"}`,
        html: `
          <div style="font-family: sans-serif; padding: 20px; background: #fafafa; border: 1px solid #eee;">
            <h2 style="color: #000; border-bottom: 2px solid #000; padding-bottom: 10px;">New Project Intake</h2>
            <p><strong>Client Identity:</strong> ${name} (${email})</p>
            <p><strong>Tier Protocol:</strong> ${tier || "Custom"}</p>
            <p><strong>Scheduled Window:</strong> ${dateStr} at ${timeStr} (${tzStr})</p>
            <hr style="border: 0; border-top: 1px solid #ddd; margin: 20px 0;"/>
            <p><strong>Technical Brief:</strong></p>
            <div style="background: #fff; padding: 15px; border-left: 4px solid #000;">
              ${message}
            </div>
          </div>
        `
      });

      // 2. Send CONFIRMATION to USER
      await resend.emails.send({
        from: `QUETTRIX LABS <${senderEmail}>`,
        to: [email],
        subject: "Protocol Initialized: Project Kickoff Confirmed",
        html: `
          <div style="font-family: sans-serif; padding: 40px; color: #333; line-height: 1.6;">
            <div style="text-align: center; margin-bottom: 40px;">
              <h1 style="font-size: 24px; letter-spacing: 4px; color: #000; margin: 0;">QUETTRIX LABS</h1>
              <p style="font-size: 10px; text-transform: uppercase; letter-spacing: 2px; color: #888;">Engineering & Tactical Design</p>
            </div>
            
            <p>Hello ${name},</p>
            <p>Your technical brief has been received and verified. Our engineers are currently reviewing the schematic.</p>
            
            <div style="background: #f9f9f9; padding: 30px; margin: 30px 0; border: 1px solid #eee;">
              <p style="margin: 0; font-size: 11px; text-transform: uppercase; letter-spacing: 1px; color: #999;">Confirmed Schedule</p>
              <p style="margin: 10px 0; font-size: 18px; font-weight: bold;">${dateStr}</p>
              <p style="margin: 0; font-size: 14px;">Window: ${timeStr} (${tzStr})</p>
            </div>

            <p>A calendar reservation with the secure meeting uplink will be dispatched shortly.</p>
            <p>Welcome to the protocol.</p>
            
            <div style="margin-top: 60px; padding-top: 20px; border-top: 1px solid #eee; font-size: 12px; color: #999;">
              <p>© 2026 QUETTRIX LABS. Protocol Alpha-6.</p>
            </div>
          </div>
        `
      });

      console.log(`[SUCCESS] Booking for ${email} transmitted successfully`);
      res.json({ success: true, timestamp: new Date().toISOString() });
    } catch (error: any) {
      console.error("[ERROR] Email Dispatch Failure:", error);
      res.status(500).json({ 
        success: false, 
        error: "Email transmission subsystem failure.",
        details: error.message 
      });
    }
  };

  // API Routes (Matched BEFORE Vite)
  app.get("/api/health", (req, res) => res.json({ status: "alive", env: process.env.NODE_ENV }));
  
  // All possible booking paths point to the same robust handler
  app.post("/execute/booking", handleBooking);
  app.post("/api/book", handleBooking);
  app.post("/api/contact", handleBooking);

  // Catch-all for other /api requests to prevent 404s
  app.all("/api/*", (req, res) => {
    console.warn(`[WARN] Unhandled API request: ${req.method} ${req.url}`);
    res.status(404).json({ error: "Tactical endpoint not found." });
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

