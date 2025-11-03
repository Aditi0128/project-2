// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDVlkIX4OR4Jt0YbSPK8v5NOqvrt8gEhlU",
  authDomain: "hotel-rajsik.firebaseapp.com",
  projectId: "hotel-rajsik",
  storageBucket: "hotel-rajsik.firebasestorage.app",
  messagingSenderId: "526107501523",
  appId: "1:526107501523:web:e40586297e75a6bec18526",
  measurementId: "G-PGH2TCM8PQ",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

