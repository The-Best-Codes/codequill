import OpenAI from "openai";
import { NextApiRequest, NextApiResponse } from "next";

const generateAIName = async function (text: string, signal?: AbortSignal) {
  const shortenedText = text.slice(0, 500);
  const openai = new OpenAI({
    baseURL: process.env.NEXT_PUBLIC_AI_BASE_URL || "https://api.airforce/v1",
    apiKey: process.env.NEXT_PUBLIC_AI_API_KEY || "",
    timeout: 30000,
  });

  const response = await openai.chat.completions.create(
    {
      model: process.env.NEXT_PUBLIC_AI_NAME_MODEL || "llama-3-70b-chat",
      messages: [
        {
          role: "system",
          content:
            "You are a helpful assistant. Users will ask for a title for their code project. The code may contain a directive at the strart (@title_ <directive>). If so, generate the project title according to that directive (for example, short, long, etc.). Respond with the title, in plain text, and no other characters.",
        },
        {
          role: "user",
          content: `Create a project title for this code project: ${shortenedText}... (text may be trimmed for brevity).`,
        },
      ],
    },
    { signal }
  );

  return response.choices[0].message?.content || "No title";
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const { text } = req.body;
    const name = await generateAIName(text);
    res.status(200).json({ name });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to generate name" });
  }
}
