import "dotenv/config";
import express from "express";
import { fileURLToPath } from "url";
import { dirname } from "path";
import fetch from "node-fetch";

const app = express();
const PORT = process.env.PORT || 3000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

app.use(express.json());
app.use(express.static(__dirname));

app.post("/api/speculate", async (req, res) => {
  const { descriptions } = req.body;

  if (
    !descriptions ||
    !Array.isArray(descriptions) ||
    descriptions.length < 3
  ) {
    return res
      .status(400)
      .json({ error: "At least 3 descriptions are required." });
  }

  const prompt = `You are writing a short, sharp character study of a person based purely on what they wear. 
Here are the stories behind their chosen clothing items:
${descriptions.map((d) => `- ${d}`).join("\n")}

Write 3 to 4 sentences that speculate about who this person might be. Be specific and unexpected. 
Draw connections between the pieces. Avoid generic fashion language. 
Do not list the items. Write it as a single flowing paragraph. Do not be corny.`;

  try {
    const geminiRes = await fetch(
      `https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] }),
      },
    );

    const data = await geminiRes.json();
    console.log("Gemini response:", JSON.stringify(data, null, 2));
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!text)
      return res.status(500).json({ error: "No text returned from Gemini." });

    res.json({ result: text });
  } catch (error) {
    console.error("Gemini API error:", error);
    res.status(500).json({ error: "Failed to reach Gemini API." });
  }
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
