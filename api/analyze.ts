import { VercelRequest, VercelResponse } from "@vercel/node";
import * as cheerio from "cheerio";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { url } = req.body;

  if (!url) {
    return res.status(400).json({ error: "URL is required" });
  }

  try {
    const formattedUrl = url.startsWith("http") ? url : `https://${url}`;
    const response = await fetch(formattedUrl, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8",
        "Accept-Language": "en-US,en;q=0.9",
        "Cache-Control": "no-cache",
        "Pragma": "no-cache",
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch site: ${response.statusText}`);
    }

    const html = await response.text();
    const $ = cheerio.load(html);

    const internalLinks: string[] = [];
    const externalLinks: string[] = [];
    
    $("a").each((_, el) => {
      const href = $(el).attr("href");
      if (href) {
        if (href.startsWith("http") && !href.includes(new URL(formattedUrl).hostname)) {
          externalLinks.push(href);
        } else if (!href.startsWith("#") && !href.startsWith("javascript:")) {
          internalLinks.push(href);
        }
      }
    });

    const metadata = {
      title: $("title").text() || "No title found",
      description: $('meta[name="description"]').attr("content") || "No description found",
      ogTitle: $('meta[property="og:title"]').attr("content") || null,
      ogDescription: $('meta[property="og:description"]').attr("content") || null,
      ogImage: $('meta[property="og:image"]').attr("content") || null,
      favicon: $('link[rel="icon"]').attr("href") || "/favicon.ico",
      viewport: $('meta[name="viewport"]').attr("content") || null,
      charset: $('meta[charset]').attr("charset") || null,
      h1Count: $("h1").length,
      imageCount: $("img").length,
      links: $("a").length,
      internalLinks: internalLinks.length,
      externalLinks: externalLinks.length,
      linkSamples: internalLinks.slice(0, 5),
      scripts: $("script").length,
      styles: $("link[rel='stylesheet']").length,
      keywords: $('meta[name="keywords"]').attr("content") || null,
    };

    // Simulate some "Observability" metrics based on the response headers
    const metrics = {
      status: response.status,
      contentType: response.headers.get("content-type"),
      server: response.headers.get("server") || "Hidden",
      responseTime: 0, // Frontend will measure this better or we can timestamp here
    };

    return res.status(200).json({ metadata, metrics, rawHtml: html.substring(0, 5000) });
  } catch (error) {
    console.error("Analysis Error:", error);
    return res.status(500).json({ error: error instanceof Error ? error.message : "Failed to analyze site" });
  }
}
