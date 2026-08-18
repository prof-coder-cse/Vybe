import OpenAI from "openai";

const client = new OpenAI({
    apiKey: process.env.OPENROUTER_API_KEY,
    baseURL: "https://openrouter.ai/api/v1",
});

export const generateComments = async (caption) => {

    const prompt = `
Generate exactly 3 Instagram style comments.

Caption:
"${caption}"

You are an Instagram user.

Generate exactly 3 short Instagram comments for this post.

Caption:
"${caption}"

Rules:
- Sound like a real human.
- Casual and engaging.
- Maximum 5 words.
- Use at most one emoji.
- No hashtags.
- Return ONLY a JSON array.

Example:
[
"Absolutely love this 😍",
"Such a vibe 🔥",
"This is beautiful ❤️"
]`;

   const completion = await client.chat.completions.create({
    model: "inclusionai/ling-3.0-tiny:free",
    messages: [
        {
            role: "user",
            content: prompt,
        },
    ],
    temperature: 0.8,
});

    let text = completion.choices[0].message.content;

    text = text
        .replace(/```json/g, "")
        .replace(/```/g, "")
        .trim();

    return JSON.parse(text);
};