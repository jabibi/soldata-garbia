import { initializeApp } from "firebase/app";
import { type Analytics, getAnalytics, isSupported } from "firebase/analytics";
import { connectFunctionsEmulator, getFunctions } from "firebase/functions";
import { connectAuthEmulator, getAuth } from "firebase/auth";
import { connectFirestoreEmulator, getFirestore } from "firebase/firestore";

const firebaseConfig = {
  projectId: "soldata-garbia",
  appId: "1:236346644595:web:dd1285ff4e520590137206",
  storageBucket: "soldata-garbia.firebasestorage.app",
  apiKey: "AIzaSyA4AW_x6qbLq-jJALGQouQ2771mafKcqDc",
  authDomain: "soldata-garbia.firebaseapp.com",
  messagingSenderId: "236346644595",
  measurementId: "G-E3SCLDVCZC",
};

const app = initializeApp(firebaseConfig);

export const functions = getFunctions(app, "europe-west1");
export const auth = getAuth(app);
export const db = getFirestore(app);

// Evita registrar eventos reales durante `npm run dev` y se degrada a `null` si el
// navegador bloquea Analytics (adblockers, navegación privada, etc.).
export const analyticsPromise: Promise<Analytics | null> = import.meta.env.DEV
  ? Promise.resolve(null)
  : isSupported().then((supported) => (supported ? getAnalytics(app) : null));

if (import.meta.env.DEV) {
  connectFunctionsEmulator(functions, "localhost", 5001);
  connectAuthEmulator(auth, "http://localhost:9099");
  connectFirestoreEmulator(db, "localhost", 8080);
}
