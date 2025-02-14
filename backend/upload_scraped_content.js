import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc } from 'firebase/firestore';
import dotenv from 'dotenv';
import fs from 'fs';

// Load environment variables from .env file
dotenv.config({ path: './.env' });

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

// Read JSON file
const data = JSON.parse(fs.readFileSync('./scraped_content.json', 'utf8'));

// Upload JSON data to Firestore
const uploadData = async () => {
  try {
    const collectionRef = collection(db, 'scraped_content');
    for (const item of data) {
      await addDoc(collectionRef, item);
    }
    console.log('Data uploaded successfully');
  } catch (error) {
    console.error('Error uploading data:', error);
  }
};

uploadData();