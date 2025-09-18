// Import the functions you need from the SDKs you need
import { initializeApp, getApps } from "firebase/app";
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { getStorage } from 'firebase/storage';

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCZAwBWCCnbR304tEGYXLtIeaq-TWl_edY",
  authDomain: "nature-light-96c98.firebaseapp.com",
  projectId: "nature-light-96c98",
  storageBucket: "nature-light-96c98.firebasestorage.app",
  messagingSenderId: "399381266008",
  appId: "1:399381266008:web:2215817afa1d09929a142d",
  measurementId: "G-FDZ55P3R5E"
};

// Initialize Firebase
let app;
if (!getApps().length) {
  app = initializeApp(firebaseConfig);
}

const db = getFirestore(app);
const auth = getAuth(app);
const storage = getStorage(app);

export { db, auth, storage };
