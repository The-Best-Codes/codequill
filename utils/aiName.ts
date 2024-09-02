import axios from "axios";

export const generateAIName = async function (text: string) {
  const shortenedText = text.slice(0, 1000);
  const response = await axios.post("/api/ai/nameCreate", {
    text: shortenedText,
  });
  return response.data.name;
};

export default generateAIName;
