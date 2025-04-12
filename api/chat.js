import { Configuration, OpenAIApi } from "openai";

export default async function handler(req, res) {
  // ✅ CORS 설정
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Only POST requests are allowed." });
  }

  // ✅ 환경변수 로그 찍기
  console.log("🔑 OPENAI_API_KEY:", process.env.OPENAI_API_KEY);

  const { message } = req.body;

  const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
  });

  const openai = new OpenAIApi(configuration);

  try {
    const response = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: "You are Korchip Assistant, helpful bot for supercapacitors." },
        { role: "user", content: message },
      ],
    });

    res.status(200).json({ reply: response.data.choices[0].message.content });
  } catch (error) {
    console.error("❌ OpenAI Error:", error.message);
    res.status(500).json({ error: "Failed to get response", detail: error.message });
  }
}
