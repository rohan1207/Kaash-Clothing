const OpenAI = require('openai');

const openai = new OpenAI({
  apiKey: process.env.GROQ_API_KEY,
  baseURL: 'https://api.groq.com/openai/v1',
});

const hospitalInfo = `
  Sai Sneh Hospital Information:
  - Location: Pune-Satara Road, opp. PMT Bus Depot, Katraj Pune, Maharashtra, India 411046
  - Rating: 4.9 stars
  - Owner: Dr. Sunil Jagtap
  - Services: Cardiology, Neurology, General Medicine, Gastrology, Urology, Gynaecology, Orthopedics, Homeopathy, and more.
  - Timings:
    - Monday to Saturday: 09:00 AM - 09:30 PM
    - Sunday: Closed
`;

const handleChatMessage = async (req, res) => {
  const { message } = req.body;

  if (!message) {
    return res.status(400).json({ error: 'Message is required' });
  }

  try {
    const completion = await openai.chat.completions.create({
      model: 'llama3-8b-8192',
      messages: [
        {
          role: 'system',
          content: `You are a helpful assistant for Sai Sneh Hospital. Your role is to answer user questions about health and about the hospital. Be friendly and professional. Prioritize using the specific hospital information provided below for any relevant questions. For general health queries, provide safe, general advice and always include a disclaimer that the user should consult a real doctor for serious issues. Do not make up information about the hospital. Here is the hospital's information: ${hospitalInfo}`,
        },
        {
          role: 'user',
          content: message,
        },
      ],
    });

    const botResponse = completion.choices[0].message.content;
    res.json({ response: botResponse });
  } catch (error) {
    console.error('Error communicating with OpenAI:', error);
    res.status(500).json({ error: 'Failed to get response from AI' });
  }
};

module.exports = { handleChatMessage };
