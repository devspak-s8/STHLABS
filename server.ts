import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { createServer as createViteServer } from "vite";
import { Resend } from "resend";
import * as dotenv from "dotenv";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Routes
  app.post("/api/book", async (req, res) => {
    const { name, email, message, tier, bookingDetails } = req.body;
    const apiKey = process.env.RESEND_API_KEY;
    const adminEmail = process.env.ADMIN_EMAIL || 'provenly.main@gmail.com';
    const senderEmail = process.env.SENDER_EMAIL || 'hello@quettrix.com';

    if (!apiKey) {
      console.error("RESEND_API_KEY missing");
      return res.status(503).json({ error: "Email service not configured." });
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
          <div style="font-family: sans-serif; padding: 20px;">
            <h2>New Project & Meeting Request</h2>
            <p><strong>Client:</strong> ${name} (${email})</p>
            <p><strong>Tier:</strong> ${tier || "Custom"}</p>
            <p><strong>Schedule:</strong> ${dateStr} at ${timeStr} (${tzStr})</p>
            <p><strong>Brief:</strong> ${message}</p>
          </div>
        `
      });

      // 2. Send CONFIRMATION to USER
      await resend.emails.send({
        from: `QUETTRIX LABS <${senderEmail}>`,
        to: [email],
        subject: "Project Inquiry & Kickoff Confirmed - QUETTRIX",
        html: `
          <div style="font-family: sans-serif; padding: 20px; border: 1px solid #eee; border-radius: 8px;">
            <h1 style="color: #000;">QUETTRIX LABS</h1>
            <p>Hello ${name},</p>
            <p>We have successfully received your project brief and locked in your kickoff call.</p>
            
            <div style="background: #f4f4f4; padding: 15px; margin: 20px 0;">
              <p style="margin: 0;"><strong>Scheduled Kickoff:</strong> ${dateStr}</p>
              <p style="margin: 5px 0 0 0;"><strong>Window:</strong> ${timeStr} (${tzStr})</p>
            </div>

            <p>Our lead engineers are reviewing your requirements. A calendar invite with a meeting link will be dispatched shortly.</p>
            <p>Welcome to the protocol.</p>
            <br/>
            <p><strong>The QUETTRIX Team</strong></p>
          </div>
        `
      });

      res.json({ success: true });
    } catch (error) {
      console.error("Booking Error:", error);
      res.status(500).json({ error: "Failed to process booking." });
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
