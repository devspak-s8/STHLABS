import { Resend } from "resend";
import * as dotenv from "dotenv";
import { format, parseISO } from "date-fns";

dotenv.config();

export default async function handler(req: any, res: any) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { name, email, message, tier, schedule, isUrgent, price } = req.body;
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
  const dateObj = schedule?.date ? parseISO(schedule.date) : null;
  const formattedDate = dateObj ? format(dateObj, "EEEE, MMMM do, yyyy") : "TBD";
  const scheduleText = schedule ? `${formattedDate} at ${schedule.time} (${schedule.timezone})` : "Not scheduled";
  const zoomLink = "https://zoom.us/j/quettrix-lab-session"; // Placeholder Zoom link

  const isConsultation = tier === "Software Solutions Consultation";
  const urgencyLabel = isUrgent ? "URGENT OVERRIDE (HIGH PRIORITY)" : "Standard Sync";
  const finalPrice = price ? `$${price}` : (isConsultation ? (isUrgent ? "$100" : "$10") : "Custom");

  try {
    // 1. Send ALERT to ADMIN
    const adminEmailResponse = await resend.emails.send({
      from: `QUETTRIX SYSTEM <${senderEmail}>`,
      to: [adminEmail],
      subject: isConsultation 
        ? `[CONSULTATION ALERT] ${isUrgent ? '🚨 URGENT' : '📅 Standard'} Consultation: ${name}`
        : `[SYSTEM ALERT] New Project Inquiry: ${tier || "Custom"}`,
      html: `
        <div style="font-family: 'Inter', sans-serif; max-width: 600px; margin: 0 auto; color: #111; line-height: 1.6; border: 1px solid #e5e7eb; border-radius: 8px; overflow: hidden;">
          <div style="background: #000; padding: 24px; text-align: center;">
            <h1 style="color: #fff; margin: 0; letter-spacing: 4px; font-weight: 800; text-transform: uppercase; font-size: 24px;">QUETTRIX LABS</h1>
          </div>
          <div style="padding: 40px;">
            <h2 style="text-transform: uppercase; letter-spacing: 2px; border-bottom: 2px solid #000; padding-bottom: 10px; font-size: 18px;">
              ${isConsultation ? "Inbound Consultation Booked" : "Inbound Lead Detected"}
            </h2>
            <p style="margin-top: 24px;"><strong>Identity:</strong> ${name}</p>
            <p><strong>Contact:</strong> ${email}</p>
            <p><strong>Protocol Tier / Service:</strong> ${tier || "Custom Configuration"}</p>
            ${isConsultation ? `<p><strong>Urgency Priority:</strong> <span style="color: ${isUrgent ? '#ef4444' : '#10b981'}; font-weight: bold;">${urgencyLabel}</span></p>` : ''}
            <p><strong>Estimated Booking Fee:</strong> ${finalPrice}</p>
            <p><strong>Scheduled Kickoff:</strong> ${scheduleText}</p>
            <p><strong>Virtual Hub:</strong> <a href="${zoomLink}" style="color: #000; font-weight: bold;">Join Zoom Meeting</a></p>
            <div style="background: #f9fafb; padding: 24px; margin-top: 32px; border-left: 4px solid #000;">
              <p style="margin: 0; font-weight: bold; text-transform: uppercase; font-size: 11px; color: #6b7280; letter-spacing: 1px; margin-bottom: 12px;">Consultation Brief / Requirements</p>
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
    try {
      if (email !== adminEmail) {
        console.log(`Attempting user confirmation to: ${email}`);
        const userConfirmation = await resend.emails.send({
          from: `QUETTRIX LABS <${senderEmail}>`,
          to: [email],
          subject: isConsultation 
            ? "Consultation Session Booked - QUETTRIX LABS"
            : "Project Inquiry Confirmed - QUETTRIX LABS",
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
                <p style="font-size: 16px; margin-bottom: 16px;">We've received your request for the <strong>${tier || "Custom"}</strong>.</p>
                <p style="font-size: 14px; color: #4b5563; margin-bottom: 8px;">Scheduled Session: <strong>${scheduleText}</strong></p>
                ${isConsultation ? `<p style="font-size: 14px; color: #4b5563; margin-bottom: 8px;">Priority Level: <strong>${urgencyLabel}</strong></p>` : ''}
                <p style="font-size: 14px; color: #4b5563; margin-bottom: 8px;">Booking Fee: <strong>${finalPrice}</strong></p>
                <p style="font-size: 14px; color: #4b5563; margin-bottom: 24px;">Protocol Link: <a href="${zoomLink}" style="color: #2563eb; font-weight: 600; text-decoration: none;">Launch Zoom Hub</a></p>
                
                <div style="background: #f0fdf4; border: 1px solid #dcfce7; padding: 20px; border-radius: 8px; margin: 32px 0;">
                  <p style="margin: 0; color: #166534; font-weight: 500;">
                    Status: ${isUrgent ? "CRITICAL IMMEDIATE OVERRIDE HIGH PRIORITY ACTIVE" : "High Priority Response Activated."}
                  </p>
                  <p style="margin: 8px 0 0 0; color: #166534; font-size: 14px;">
                    Our lead software architect will review your brief. One of our team members will reach out to you <strong>within ${isUrgent ? '5 to 10 minutes' : '20 minutes'}</strong> to discuss your requirements and confirm the meeting details.
                  </p>
                </div>
                
                ${isConsultation ? `
                <div style="background: #eff6ff; border: 1px solid #bfdbfe; padding: 20px; border-radius: 8px; margin: 32px 0; text-align: center;">
                  <p style="margin: 0; color: #1e40af; font-weight: 600; font-size: 15px;">Want instant confirmation?</p>
                  <p style="margin: 8px 0 16px 0; color: #1e40af; font-size: 13px;">Secure your timeline immediately by linking up with us on WhatsApp.</p>
                  <a href="https://wa.me/2349037063075?text=Hi%20Quettrix%20Labs!%20My%20name%20is%20${encodeURIComponent(name)}.%20I%20just%20booked%20a%20Software%20Solutions%20Consultation%20(${encodeURIComponent(urgencyLabel)})%20for%20${encodeURIComponent(scheduleText)}.%20Here%20is%20my%20email%3A%20${encodeURIComponent(email)}." style="background: #25d366; color: #fff; text-decoration: none; padding: 12px 24px; font-weight: bold; border-radius: 4px; display: inline-block;">Connect on WhatsApp</a>
                </div>
                ` : ''}

                <p style="margin-bottom: 32px; color: #4b5563;">Please keep an eye on your inbox and your phone for further instructions and meeting links.</p>
                
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
