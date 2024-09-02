import OpenAI from "openai";

export async function generateAIDesc(text: string, signal?: AbortSignal) {
  const shortenedText = text.slice(0, 2550);
  const openai = new OpenAI({
    baseURL: process.env.NEXT_PUBLIC_AI_BASE_URL || "https://api.openai.com/v1",
    apiKey: process.env.NEXT_PUBLIC_AI_API_KEY,
    dangerouslyAllowBrowser: true,
  });

  const response = await openai.chat.completions.create(
    {
      model: process.env.NEXT_PUBLIC_AI_DESC_MODEL || "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content:
            "You are a helpful assistant. Users will ask for a summary of their project. You will respond with the summary, in plain text, and no other characters.",
        },
        {
          role: "user",
          content: `Create a summary for this code project: ${shortenedText}... (text may be trimmed for brevity).`,
        },
      ],
    },
    { signal }
  );

  return response.choices[0].message?.content || "No summary";
}
