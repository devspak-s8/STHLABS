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

    // 2. Attempt to send confirmation to user
    // IMPORTANT: On Resend Free/Onboarding tier, you can ONLY send to your own registered email.
    // To send to any user, you MUST verify a domain in Resend: https://resend.com/domains
    try {
      if (email !== adminEmail) {
        console.log(`Attempting user confirmation to: ${email}`);
        const userConfirmation = await resend.emails.send({
          from: 'QUETTRIX <onboarding@resend.dev>',
          to: [email],
          subject: "We've received your request - QUETTRIX",
          html: `
            <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee;">
              <h2 style="color: #333;">Hello ${name},</h2>
              <p>Thanks for reaching out to us about your project.</p>
              <p>We've received your details for the <strong>${tier || "Custom"}</strong> package. Our team will review everything and get back to you within 24 hours.</p>
              <br />
              <p>Best regards,<br /><strong>The QUETTRIX Team</strong></p>
            </div>
          `,
        });

        if (userConfirmation.error) {
          // This will log the specific "Sandbox" error if you're on a free tier
          console.error("Resend blocked user email:", userConfirmation.error);
        } else {
          console.log("User confirmation sent successfully.");
        }
      }
    } catch (userEmailErr) {
      console.error("Unexpected error sending user email:", userEmailErr);
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
