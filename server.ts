import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { Resend } from "resend";

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Email sending endpoint
  app.post("/api/contact", async (req, res) => {
    const { name, email, message, tier } = req.body;
    
    // Check for RESEND_API_KEY in environment
    const apiKey = process.env.RESEND_API_KEY;
    
    if (!apiKey) {
      console.warn("RESEND_API_KEY not found. Simulating email send for:", email);
      return res.status(200).json({ 
        success: true, 
        message: "Demo Mode: API key missing, but request received.",
        data: req.body 
      });
    }

    const resend = new Resend(apiKey);

    try {
      const data = await resend.emails.send({
        from: 'STH LABS <onboarding@resend.dev>',
        to: ['apatirasulayman@gmail.com'],
        subject: `New Project: ${tier || "Inquiry"} from ${name}`,
        html: `
          <h1>New Project Inquiry</h1>
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Selected Tier:</strong> ${tier || "None selected"}</p>
          <p><strong>Message:</strong></p>
          <p>${message}</p>
        `,
      });

      res.status(200).json({ success: true, data });
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
  });
}

startServer();
