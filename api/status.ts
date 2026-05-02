import * as dotenv from "dotenv";

dotenv.config();

export default async function handler(req: any, res: any) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  return res.status(200).json({
    emailConfigured: !!process.env.RESEND_API_KEY,
    environment: process.env.NODE_ENV || "development",
    timestamp: new Date().toISOString()
  });
}
