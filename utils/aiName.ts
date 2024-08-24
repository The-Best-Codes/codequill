import OpenAI from "openai";

export async function generateAIName(text: string, signal?: AbortSignal) {
  const shortenedText = text.slice(0, 1000);
  const openai = new OpenAI({
    baseURL: process.env.NEXT_PUBLIC_AI_BASE_URL || "https://api.openai.com/v1",
    apiKey: process.env.NEXT_PUBLIC_AI_API_KEY,
    dangerouslyAllowBrowser: true,
  });

  const response = await openai.chat.completions.create(
    {
      model: process.env.NEXT_PUBLIC_AI_NAME_MODEL || "gpt-3.5-turbo",
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
}
