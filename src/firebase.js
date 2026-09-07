// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration (New Project: the-newlong-zone)
const firebaseConfig = {
  apiKey: "AIzaSyCw4JFYP9yQhPY7fK8gBOFtjjDJvaXSlaI",
  authDomain: "the-newlong-zone.firebaseapp.com",
  projectId: "the-newlong-zone",
  storageBucket: "the-newlong-zone.firebasestorage.app",
  messagingSenderId: "942584866869",
  appId: "1:942584866869:web:df298250a23a392e30a97c",
  measurementId: "G-P97VC1BJW8"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// Exporting Auth and Firestore for Admin Login & Whitelist
export const auth = getAuth(app);
export const db = getFirestore(app);