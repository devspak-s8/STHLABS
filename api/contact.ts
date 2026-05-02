import { Resend } from "resend";
import * as dotenv from "dotenv";

dotenv.config();

export default async function handler(req: any, res: any) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { name, email, message, tier } = req.body;
  const apiKey = process.env.RESEND_API_KEY;

  if (!apiKey) {
    return res.status(500).json({
      success: false,
      error: "Server Configuration Error: RESEND_API_KEY is missing."
    });
  }

  const resend = new Resend(apiKey);

  try {
    const adminEmailResponse = await resend.emails.send({
      from: 'QUETTRIX LABS <onboarding@resend.dev>',
      to: [process.env.ADMIN_EMAIL || 'apatirasulayman@gmail.com'],
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

    if (adminEmailResponse.error) {
      return res.status(400).json({
        success: false,
        error: `Resend Error: ${adminEmailResponse.error.message}`
      });
    }

    // Send confirmation to user (optional on free tier)
    await resend.emails.send({
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
          <p>We have successfully received your project requirements for the <strong>${tier || "Custom Strategy"}</strong> tier.</p>
          <p style="font-size: 14px; color: #666;">A systems architect will be in contact via this secure channel within 24 hours.</p>
        </div>
      `,
    }).catch(() => {}); // Ignore user email errors on free tier

    return res.status(200).json({
      success: true,
      data: adminEmailResponse.data
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      error: error.message || "An unexpected server error occurred."
    });
  }
}
