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

  const prompt = `You are a quiet observer reading someone through the objects they've chosen to carry on their body.

Each item below comes with a memory its owner shared:
${descriptions.map((d) => `— ${d}`).join("\n")}

From these fragments, write a single paragraph — three sentences, maybe four — speculating on who this person is. Let the memories bleed into each other. If one piece was thrifted and another was a gift, ask yourself what kind of person accumulates meaning that way. If something was found on the street and something else was bought in Tokyo, let that tension sit.

Write short sentences. Let them breathe. Anchor your metaphors in the details they gave you — the fabric weight, the $14 price tag, the brother's generosity, the airport hoodie. Do not invent details that aren't there. Do not list garments. Do not use the word "juxtaposition." Do not narrate like a fashion magazine. Write like you're leaving a note about a stranger you'll never see again.`;

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
