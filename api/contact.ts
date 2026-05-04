import { Resend } from "resend";
import * as dotenv from "dotenv";

dotenv.config();

export default async function handler(req: any, res: any) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { name, email, message, tier } = req.body;
  const apiKey = process.env.RESEND_API_KEY;
  const adminEmail = process.env.ADMIN_EMAIL || 'provenly.main@gmail.com';
  const senderEmail = process.env.SENDER_EMAIL || 'hello@quettrix.com'; // Change this to your verified domain email

  if (!apiKey) {
    console.error("CRITICAL: RESEND_API_KEY is missing from environment.");
    return res.status(503).json({
      success: false,
      error: "Service Unavailable: The engineering hub is currently under maintenance. Please try again later."
    });
  }

  const resend = new Resend(apiKey);

  try {
    // 1. Send ALERT to ADMIN
    const adminEmailResponse = await resend.emails.send({
      from: `QUETTRIX SYSTEM <${senderEmail}>`,
      to: [adminEmail],
      subject: `[SYSTEM ALERT] New Project Inquiry: ${tier || "Custom"}`,
      html: `
        <div style="font-family: 'Inter', sans-serif; max-width: 600px; margin: 0 auto; color: #111; line-height: 1.6; border: 1px solid #e5e7eb; border-radius: 8px; overflow: hidden;">
          <div style="background: #000; padding: 24px; text-align: center;">
            <h1 style="color: #fff; margin: 0; letter-spacing: 4px; font-weight: 800; text-transform: uppercase; font-size: 24px;">QUETTRIX LABS</h1>
          </div>
          <div style="padding: 40px;">
            <h2 style="text-transform: uppercase; letter-spacing: 2px; border-bottom: 2px solid #000; padding-bottom: 10px; font-size: 18px;">Inbound Lead Detected</h2>
            <p style="margin-top: 24px;"><strong>Identity:</strong> ${name}</p>
            <p><strong>Contact:</strong> ${email}</p>
            <p><strong>Protocol Tier:</strong> ${tier || "Custom Configuration"}</p>
            <div style="background: #f9fafb; padding: 24px; margin-top: 32px; border-left: 4px solid #000;">
              <p style="margin: 0; font-weight: bold; text-transform: uppercase; font-size: 11px; color: #6b7280; letter-spacing: 1px; margin-bottom: 12px;">Requirements Brief</p>
              <p style="margin: 0; color: #374151;">${message}</p>
            </div>
            <p style="font-size: 11px; color: #9ca3af; margin-top: 40px; text-align: center; font-style: italic;">Source: Automated Engineering Portal Transmission</p>
          </div>
        </div>
      `,
    });

    if (adminEmailResponse.error) {
      console.error("Resend Admin Alert Error:", adminEmailResponse.error);
      return res.status(503).json({
        success: false,
        error: "Service Unavailable: Transmission failure. Our team has been notified."
      });
    }

    // 2. Attempt to send confirmation to user
    // IMPORTANT: On Resend Free/Onboarding tier, you can ONLY send to your own registered email.
    // To send to any user, you MUST verify a domain in Resend: https://resend.com/domains
    try {
      if (email !== adminEmail) {
        console.log(`Attempting user confirmation to: ${email}`);
        const userConfirmation = await resend.emails.send({
          from: `QUETTRIX LABS <${senderEmail}>`,
          to: [email],
          subject: "Project Inquiry Confirmed - QUETTRIX LABS",
          html: `
            <div style="font-family: 'Inter', sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e5e7eb; border-radius: 12px; overflow: hidden; color: #111;">
              <div style="position: relative; height: 180px; background: #000;">
                <img src="https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2072&auto=format&fit=crop" alt="Engineering Banner" style="width: 100%; height: 180px; object-fit: cover; opacity: 0.7;" referrerPolicy="no-referrer" />
                <div style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); text-align: center; width: 100%;">
                  <h1 style="color: #fff; margin: 0; letter-spacing: 6px; font-weight: 900; text-transform: uppercase; font-size: 28px;">QUETTRIX</h1>
                </div>
              </div>
              <div style="padding: 48px 40px;">
                <h2 style="color: #000; text-transform: uppercase; letter-spacing: 2px; font-size: 20px; margin-bottom: 24px;">Hello ${name},</h2>
                <p style="font-size: 16px; margin-bottom: 16px;">We've received your inquiry for the <strong>${tier || "Custom"}</strong> package.</p>
                <div style="background: #f0fdf4; border: 1px solid #dcfce7; padding: 20px; border-radius: 8px; margin: 32px 0;">
                  <p style="margin: 0; color: #166534; font-weight: 500;">
                    Status: High Priority Response Activated.
                  </p>
                  <p style="margin: 8px 0 0 0; color: #166534; font-size: 14px;">
                    One of our team members will reach out to you <strong>within the next 20 minutes</strong> to discuss your requirements and schedule a call.
                  </p>
                </div>
                <p style="margin-bottom: 32px; color: #4b5563;">Please keep an eye on your inbox for further instructions and meeting links.</p>
                
                <div style="border-top: 1px solid #f3f4f6; padding-top: 32px; margin-top: 40px; display: flex; align-items: center; justify-content: space-between;">
                  <div>
                    <p style="margin: 0; font-weight: 700; font-size: 14px; text-transform: uppercase; letter-spacing: 1px;">The QUETTRIX Team</p>
                    <p style="margin: 4px 0 0 0; color: #6b7280; font-size: 12px;">Engineering & Systems Lab</p>
                  </div>
                </div>
              </div>
              <div style="background: #f9fafb; padding: 24px; text-align: center; font-size: 11px; color: #9ca3af; border-top: 1px solid #f3f4f6;">
                © 2024 QUETTRIX LABS. All rights reserved. <br/>
                Confidentiality Notice: This message is intended only for the specified recipient.
              </div>
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
      error: "Transmission Error: We were unable to process your request at this time. Please try again."
    });
  }
}
