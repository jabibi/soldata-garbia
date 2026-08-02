import { initializeApp } from "firebase/app";
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
};

const app = initializeApp(firebaseConfig);

export const functions = getFunctions(app, "europe-west1");
export const auth = getAuth(app);
export const db = getFirestore(app);

if (import.meta.env.DEV) {
  connectFunctionsEmulator(functions, "localhost", 5001);
  connectAuthEmulator(auth, "http://localhost:9099");
  connectFirestoreEmulator(db, "localhost", 8080);
}
