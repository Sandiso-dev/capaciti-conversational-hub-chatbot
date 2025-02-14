import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, query, where, limit } from 'firebase/firestore';
import fetch from 'node-fetch';

// Load environment variables from .env file
dotenv.config({ path: './.env' });

const app = express();
const port = process.env.PORT || 8081;

app.use(express.json());
app.use(cors({
  origin: ["http://localhost:5173", "http://localhost:8080", "http://172.24.6.210:8080"] // Allow both frontend URLs and the new IP address
}));

// Log the OpenAI API key to verify it's being loaded
console.log('OpenAI API Key:', process.env.OPENAI_API_KEY);

// Firebase configuration
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
app.post('/api/chat', async (req, res) => {
  try {
    const { message, userId } = req.body;

    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    console.log('Received message:', message);
    console.log('Received userId:', userId);

    // Fetch relevant content from Firestore
    try {
      // Try to find an exact match for the question
      const q = query(
        collection(db, 'scraped_content'),
        where('question', '==', message.toLowerCase().trim())
      );
      
      const querySnapshot = await getDocs(q);
      
      if (querySnapshot.empty) {
        return res.json({ 
          response: "I'm sorry, I couldn't find an answer to that specific question. Could you please rephrase it?" 
        });
      }

      // Get the matching document's content
      const content = querySnapshot.docs[0].data().content;
      
      return res.json({ response: content });

    } catch (error) {
      console.error('Error fetching scraped content:', error);
      return res.status(500).json({ 
        error: 'Error accessing the knowledge base' 
      });
    }

  } catch (error) {
    console.error('Error:', error);
    return res.status(500).json({ error: error.message });
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
