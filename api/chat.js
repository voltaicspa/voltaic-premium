import Anthropic from "@anthropic-ai/sdk";

export default async function handler(req, res) {
  // CORS headers
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { prompt, captchaToken } = req.body;

  if (!prompt) {
    return res.status(400).json({ error: "Prompt is required" });
  }

  try {
    const client = new Anthropic({
      apiKey: process.env.GROQ_API_KEY,
    });

    const message = await client.messages.create({
      model: "claude-3-5-sonnet-20241022",
      max_tokens: 1024,
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
    });

    const reply =
      message.content[0].type === "text" ? message.content[0].text : "";

    return res.status(200).json({ reply });
  } catch (error) {
    console.error("Error:", error);
    return res
      .status(500)
      .json({ error: "Failed to process request", details: error.message });
  }
}
