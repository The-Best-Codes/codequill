import OpenAI from "openai";
import { NextApiRequest, NextApiResponse } from "next";

const translateCode = async function (
  text: string,
  toLang: string,
  signal?: AbortSignal
) {
  const shortenedText = text.slice(0, 5000);
  const openai = new OpenAI({
    baseURL:
      process.env.NEXT_PUBLIC_AI_TRANSLATE_API_BASE_URL ||
      "https://api.openai.com/v1",
    apiKey: process.env.NEXT_PUBLIC_AI_TRANSLATE_API_KEY || "",
    timeout: 60000,
  });

  const response = await openai.chat.completions.create(
    {
      model: process.env.NEXT_PUBLIC_AI_TRANSLATE_MODEL || "gpt-4o",
      messages: [
        {
          role: "system",
          content:
            "You are a helpful assistant. Users will ask you to translate code. Respond with the translated code, in plain text, and with other characters, formatting, or markdown.",
        },
        {
          role: "user",
          content: `Translate this code to ${toLang}: ${shortenedText}`,
        },
      ],
    },
    { signal }
  );

  return response.choices[0].message?.content || "No code output given";
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const { text, toLang } = req.body;
    const code = await translateCode(text, toLang);
    res.status(200).json({ code });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to translate code" });
  }
}
