// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore"; // Correct import for Firestore
import { collection } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDdDLXV2wtIHthxq63cGqcwFP5mZ_VXQ1g",
  authDomain: "website-d40d6.firebaseapp.com",
  projectId: "website-d40d6",
  storageBucket: "website-d40d6.firebasestorage.app", // Fixed typo: .app -> .appspot.com
  messagingSenderId: "108939969443",
  appId: "1:108939969443:web:b3c2eb8e8caf09cf731016",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app); // Initialize Firestore

// Export Firebase instances for use in other files
export const initFirebase = () => {
  return app;
};

export { db, collection }; // Export `auth` and `db` for use in other files
