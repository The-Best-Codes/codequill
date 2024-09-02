import axios from "axios";

export const translateCodeAI = async function (text: string, toLang: string) {
  const shortenedText = text.slice(0, 5000);
  const response = await axios.post("/api/ai/codeTranslate", {
    text: shortenedText,
    toLang,
  });
  return response.data.code;
};

export default translateCodeAI;
