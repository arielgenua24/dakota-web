import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_CACHE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_CACHE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_CACHE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_CACHE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_CACHE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_CACHE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_CACHE_MEASUREMENT_ID,
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig, "firebase-cache") : getApp("firebase-cache");
const db = getFirestore(app);

export { db };
