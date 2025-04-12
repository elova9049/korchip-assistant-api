const { Configuration, OpenAIApi } = require("openai");

module.exports = async (req, res) => {
  const { message } = req.body;

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
          content: `
          You are Korchip Assistant, a helpful technical bot for supercapacitors.
          Only answer questions about Korchip's products, calculators, or technologies.
          Politely decline other topics.`,
        },
        { role: "user", content: message },
      ],
    });

    res.status(200).json({ reply: completion.data.choices[0].message.content });
  } catch (error) {
    res.status(500).json({ error: "GPT Error", details: error.message });
  }
};
