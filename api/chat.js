const { Configuration, OpenAIApi } = require("openai");

module.exports = async (req, res) => {
  if (req.method !== "POST") {
    return res.status(405).send("Only POST requests allowed");
  }

  const { message } = req.body;

  if (!message) {
    return res.status(400).json({ error: "Missing 'message' in request body." });
  }

  const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
  });

  const openai = new OpenAIApi(configuration);

  try {
    const completion = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "You are Korchip Assistant, a helpful bot for supercapacitor users.",
        },
        { role: "user", content: message },
      ],
    });

    res.status(200).json({ reply: completion.data.choices[0].message.content });
  } catch (error) {
    console.error("OpenAI API error:", error.message);
    res.status(500).json({ error: "Failed to get response from GPT", detail: error.message });
  }
};
