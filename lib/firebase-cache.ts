import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore, enableIndexedDbPersistence, Firestore } from "firebase/firestore";

// Verificar si las variables de entorno están configuradas
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_CACHE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_CACHE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_CACHE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_CACHE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_CACHE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_CACHE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_CACHE_MEASUREMENT_ID,
};

// Log para diagnóstico - verificar si las variables de entorno están disponibles
console.log("Firebase Cache Config Status:", {
  apiKeyExists: !!process.env.NEXT_PUBLIC_FIREBASE_CACHE_API_KEY,
  projectIdExists: !!process.env.NEXT_PUBLIC_FIREBASE_CACHE_PROJECT_ID,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_CACHE_PROJECT_ID
});

// Initialize Firebase
let app;
try {
  console.log("Initializing Firebase Cache app...");
  app = !getApps().length ? initializeApp(firebaseConfig, "firebase-cache") : getApp("firebase-cache");
  console.log("Firebase Cache app initialized successfully!");
} catch (error) {
  console.error("Error initializing Firebase:", error);
  // Fallback para desarrollo en caso de error
  app = null;
}

// Definimos db como Firestore o null
let db: Firestore | null = null;

try {
  if (app) {
    db = getFirestore(app);
    console.log("Firestore instance created successfully!");
    
    // Habilitar persistencia (opcional - solo en cliente)
    if (typeof window !== 'undefined') {
      enableIndexedDbPersistence(db)
        .then(() => console.log("Firestore persistence enabled"))
        .catch((err) => {
          console.error("Error enabling persistence:", err);
        });
    }
  } else {
    console.error("No se pudo inicializar Firestore: app es null");
  }
} catch (error) {
  console.error("Error al crear instancia de Firestore:", error);
}

// Exportamos db y su tipo para que pueda ser usado en otros archivos
export { db };
export type { Firestore };
