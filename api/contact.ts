import { Resend } from "resend";
import * as dotenv from "dotenv";

dotenv.config();

export default async function handler(req: any, res: any) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { name, email, message, tier } = req.body;
  const apiKey = process.env.RESEND_API_KEY;
  const adminEmail = process.env.ADMIN_EMAIL || 'apatirasulayman@gmail.com';

  if (!apiKey) {
    console.error("CRITICAL: RESEND_API_KEY is missing from environment.");
    return res.status(503).json({
      success: false,
      error: "Service Unavailable: API configuration missing on host. Please check environment variables."
    });
  }

  const resend = new Resend(apiKey);

  try {
    // 1. Send ALERT to ADMIN (This is the most important part)
    // On Resend Free Tier, this will ONLY work if `adminEmail` is your account email
    const adminEmailResponse = await resend.emails.send({
      from: 'QUETTRIX LABS <onboarding@resend.dev>',
      to: [adminEmail],
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
          <p style="font-size: 10px; color: #999; margin-top: 20px;">Source: Engineering Portal Transmission</p>
        </div>
      `,
    });

    if (adminEmailResponse.error) {
      console.error("Resend Admin Alert Error:", adminEmailResponse.error);
      return res.status(503).json({
        success: false,
        error: `Resend Protocol Error: ${adminEmailResponse.error.message}. Ensure your ADMIN_EMAIL is verified in Resend.`
      });
    }

    // 2. Attempt to send confirmation to user (Will likely fail on Free Tier)
    // We wrap this in a separate try/catch so to not fail the whole request
    try {
      if (email !== adminEmail) {
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
        });
      }
    } catch (userEmailErr) {
      console.warn("User confirmation suppressed (likely due to Resend Free Tier restrictions):", userEmailErr);
      // We don't return an error here because the admin already got the lead!
    }

    return res.status(200).json({
      success: true,
      data: adminEmailResponse.data
    });
  } catch (error: any) {
    console.error("Unexpected Hub Error:", error);
    return res.status(503).json({
      success: false,
      error: "Service Unavailable: Transmission protocol failure. Check Resend dashboard for logs."
    });
  }
}
