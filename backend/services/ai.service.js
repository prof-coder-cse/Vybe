import OpenAI from "openai";

const client = new OpenAI({
    apiKey: process.env.OPENROUTER_API_KEY,
    baseURL: "https://openrouter.ai/api/v1",
});

export const generateComments = async (caption) => {

    const prompt = `
Generate exactly 3 Instagram-style comments for this post.

Caption:
"${caption}"

Rules:
- Sound like a real human.
- Casual and engaging.
- Maximum 5 words per comment.
- Use at most one emoji per comment.
- No hashtags.
- Return ONLY a valid JSON array.

Example:
[
  "Absolutely love this 😍",
  "Such a vibe 🔥",
  "This is beautiful ❤️"
]
`;

    const completion = await client.chat.completions.create({
        model: "openrouter/free",
        messages: [
            {
                role: "user",
                content: prompt,
            },
        ],
        temperature: 0.8,
    });

    console.log(
        "AI Response:",
        JSON.stringify(completion, null, 2)
    );

    const text = completion?.choices?.[0]?.message?.content;

    if (!text) {
        console.error("Invalid AI response:", completion);

        throw new Error(
            "AI returned an empty response"
        );
    }

    const cleanedText = text
        .replace(/```json/g, "")
        .replace(/```/g, "")
        .trim();

    try {
        return JSON.parse(cleanedText);
    } catch (error) {
        console.error("Invalid JSON from AI:", cleanedText);

        throw new Error(
            "AI returned invalid JSON"
        );
    }
};
