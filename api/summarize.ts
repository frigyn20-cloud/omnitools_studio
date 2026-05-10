// api/summarize.ts  — Vercel serverless function (runs server-side, no CORS issues)
import type { VercelRequest, VercelResponse } from "@vercel/node";

const HF_MODEL = "facebook/bart-large-cnn";
// New Hugging Face router endpoint (api-inference.huggingface.co deprecated 2026)
const HF_URL = `https://router.huggingface.co/hf-inference/models/${HF_MODEL}`;

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader("Access-Control-Allow-Origin", "https://omnitoolstudio.com");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method not allowed" });
  }

  const token = process.env.HUGGINGFACE_API_TOKEN;
  if (!token) return res.status(500).json({ error: "Missing HUGGINGFACE_API_TOKEN on server" });

  const { text, maxTokens } = (req.body as { text?: string; maxTokens?: number }) || {};
  if (typeof text !== "string" || !text.trim()) return res.status(400).json({ error: "Missing text" });

  const trimmed = text.trim().slice(0, 3000);
  const max_new_tokens = typeof maxTokens === "number" ? maxTokens : 160;

  try {
    const hfRes = await fetch(HF_URL, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        inputs: trimmed,
        parameters: { max_new_tokens, min_length: Math.floor(max_new_tokens * 0.4), do_sample: false },
      }),
    });

    if (!hfRes.ok) {
      let errJson: Record<string, unknown> | null = null;
      try { errJson = await hfRes.json() as Record<string, unknown>; } catch { /* ignore */ }
      if (hfRes.status === 503) return res.status(503).json({ error: "Model is loading. Try again in 20 seconds." });
      return res.status(hfRes.status).json({ error: (errJson?.error as string) || `HF API error ${hfRes.status}` });
    }

    const hfJson = await hfRes.json() as Array<{ summary_text?: string }> | { summary_text?: string };
    const summary = Array.isArray(hfJson) ? hfJson[0]?.summary_text : hfJson?.summary_text;
    if (!summary) return res.status(500).json({ error: "No summary returned. Try different text." });
    return res.status(200).json({ summary });

  } catch (err) {
    console.error("HF summarize error:", err);
    return res.status(500).json({ error: "Server error contacting Hugging Face." });
  }
}
