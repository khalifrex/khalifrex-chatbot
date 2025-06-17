import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { OpenAI } from 'openai';
import { connectDB } from './config/db.js';

dotenv.config();
connectDB();

const app = express();
const port = process.env.PORT || 3093;


app.use(cors());
app.use(express.json());

app.post('/chat', async (req, res) => {
  const { message } = req.body;

  if (!message) return res.status(400).json({ error: 'No message provided' });

  try {
    const response = await fetch(process.env.OPENROUTER_URI, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'meta-llama/llama-3-8b-instruct:nitro', // you can try others like llama3
        messages: [
          { role: 'user', content: message }
        ]
      })
    });

    const data = await response.json();
    console.log('🧠 AI response data:', data); // <- Add this

    const reply = data.choices?.[0]?.message?.content || "No response";
    res.json({ reply });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Something went wrong.' });
  }
});


app.listen(port, () => {
  console.log(`Chatbot backend is running on http://localhost:${port}`);
});

/*
import Chat from '../models/Chat.js';

await Chat.create({
  userId,
  userMessage,
  aiResponse,
});

const chats = await Chat.find({ userId }).sort({ timestamp: 1 });

*/