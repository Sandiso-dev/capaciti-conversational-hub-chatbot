import { config } from "dotenv";  // Load env variables in Node.js
config();  // This loads the .env file

import express from "express";  
import cors from "cors";
import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs, query, limit } from "firebase/firestore";
import fetch from "node-fetch";  // Ensure this package is installed (npm install node-fetch)

// CORS headers for API
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
};

// Initialize Express.js server
const app = express();
app.use(express.json());
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['authorization', 'x-client-info', 'apikey', 'content-type']
}));

// Firebase configuration (loads from .env)
const firebaseConfig = {
  apiKey: process.env.API_KEY,
  authDomain: process.env.AUTH_DOMAIN,
  projectId: process.env.PROJECT_ID,
  storageBucket: process.env.STORAGE_BUCKET,
  messagingSenderId: process.env.MESSAGING_SENDER_ID,
  appId: process.env.APP_ID,
};

// Initialize Firebase
const firebaseApp = initializeApp(firebaseConfig);
const db = getFirestore(firebaseApp);

// API Route to handle chatbot queries
app.post("/chat", async (req, res) => {
  try {
    const { message, userId } = req.body;

    if (!message) {
      return res.status(400).json({ error: "Message is required" });
    }

    // Fetch relevant content from Firestore
    const q = query(collection(db, "scraped_content"), limit(5));
    const querySnapshot = await getDocs(q);
    const relevantContent = querySnapshot.docs.map(doc => doc.data().content);

    // Prepare context from relevant content
    const context = relevantContent.join('\n');

    console.log('Making request to OpenAI API...');
    
    const openAIResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
        'Content-Type': "application/json",
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: `You are a helpful assistant for CAPACITI, a digital skills development programme. 
            Use this context to help answer questions: ${context}
            If you don't know something, just say so honestly.`
          },
          {
            role: 'user',
            content: message,
          },
        ],
      }),
    });

    const openAIData = await openAIResponse.json() as { choices: { message: { content: string } }[] };

    res.set(corsHeaders);
    return res.json({ response: openAIData.choices[0].message.content });
  } catch (error) {
    console.error('Error:', error);
    res.set(corsHeaders);
    return res.status(500).json({ error: error.message });
  }
});

// Start the server
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
