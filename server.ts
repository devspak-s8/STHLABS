import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { Resend } from "resend";
import * as dotenv from "dotenv";

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Status endpoint
  app.get("/api/status", (req, res) => {
    res.json({ 
      emailConfigured: !!process.env.RESEND_API_KEY,
      environment: process.env.NODE_ENV || "development"
    });
  });

  // Email sending endpoint
  app.post("/api/contact", async (req, res) => {
    const { name, email, message, tier } = req.body;
    
    // Check for RESEND_API_KEY in environment
    const apiKey = process.env.RESEND_API_KEY;
    
    if (!apiKey) {
      console.warn("RESEND_API_KEY not found. Emails will not be sent.");
      return res.status(500).json({ 
        success: false, 
        error: "Server Configuration Error: RESEND_API_KEY is missing. Please add it to your environment variables." 
      });
    }

    const resend = new Resend(apiKey);

    try {
      // Note: If using the free tier/sandbox, you can ONLY send to your own verified email.
      const adminEmail = await resend.emails.send({
        from: 'QUETTRIX LABS <onboarding@resend.dev>',
        to: ['admin@provenly.live'],
        subject: `[SYSTEM ALERT] New Project Inquiry: ${tier || "Custom"}`,
        html: `
          <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; color: #000; line-height: 1.6;">
            <h2 style="text-transform: uppercase; letter-spacing: 2px; border-bottom: 2px solid #000; padding-bottom: 10px;">Inbound Lead Detected</h2>
            <p><strong>Identity:</strong> ${name}</p>
            <p><strong>Contact:</strong> ${email}</p>
            <p><strong>Protocol Tier:</strong> ${tier || "Custom Configuration"}</p>
            <div style="background: #f4f4f4; padding: 20px; margin-top: 20px; border-left: 4px solid #000;">
              <p style="margin: 0; font-weight: bold; text-transform: uppercase; font-size: 12px; color: #666; margin-bottom: 10px;">Requirements Brief</p>
              <p style="margin: 0;">${message}</p>
            </div>
          </div>
        `,
      });

      // 2. Send User Confirmation
      const userEmail = await resend.emails.send({
        from: 'QUETTRIX LABS <onboarding@resend.dev>',
        to: [email],
        subject: `QUETTRIX LABS | Transmission Received: ${name}`,
        html: `
          <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; color: #000; line-height: 1.6; border: 1px solid #eee; padding: 40px;">
            <div style="background: #000; color: #fff; padding: 20px; text-align: center; margin-bottom: 40px;">
              <h1 style="margin: 0; letter-spacing: 5px; font-size: 24px;">QUETTRIX LABS</h1>
              <p style="margin: 5px 0 0 0; font-size: 10px; text-transform: uppercase; opacity: 0.7;">Engineered for Precision</p>
            </div>
            
            <p>Protocol Initialized, <strong>${name}</strong>.</p>
            
            <p>We have successfully received your project requirements for the <strong>${tier || "Custom Strategy"}</strong> tier. Our engineering core is currently reviewing the technical brief.</p>
            
            <div style="margin: 30px 0; border-top: 1px solid #eee; border-bottom: 1px solid #eee; padding: 20px 0;">
              <h3 style="font-size: 12px; text-transform: uppercase; color: #999; margin-bottom: 10px;">What's Next?</h3>
              <ul style="padding-left: 20px;">
                <li style="margin-bottom: 10px;">Technical Feasibility Assessment (Current Phase)</li>
                <li style="margin-bottom: 10px;">Consultation Scheduling</li>
                <li style="margin-bottom: 10px;">Infrastructure Blueprint Drafting</li>
              </ul>
            </div>
            
            <p style="font-size: 14px; color: #666;">A systems architect will be in contact via this secure channel within 24 hours.</p>
            
            <div style="margin-top: 40px; text-align: center; font-size: 10px; color: #ccc; text-transform: uppercase; letter-spacing: 1px;">
              © 2026 QUETTRIX LABS // NO FLUFF. JUST SYSTEMS.
            </div>
          </div>
        `,
      });

      res.status(200).json({ success: true, adminEmail, userEmail });
    } catch (error) {
      console.error("Email error:", error);
      res.status(500).json({ success: false, error: "Failed to send email" });
    }
  });

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
    console.log(`Server running at http://localhost:${PORT}`);
    console.log(`Email Service Status: ${process.env.RESEND_API_KEY ? "CONFIGURED" : "MISSING"}`);
    if (!process.env.RESEND_API_KEY) {
      console.warn("⚠️  RESEND_API_KEY is not set. Check your environment variables or .env file.");
    }
  });
}

startServer();
