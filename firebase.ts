// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore"; // Correct import for Firestore
import { collection } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDAQVliBL_6zfck4lEIwh8llKm73dKlseI",
  authDomain: "ags-website-dc96a.firebaseapp.com",
  projectId: "ags-website-dc96a",
  storageBucket: "ags-website-dc96a.appspot.com", // Fixed typo: .app -> .appspot.com
  messagingSenderId: "366485809791",
  appId: "1:366485809791:web:4aec115ceb934aa06d2d4a",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app); // Initialize Firestore

// Export Firebase instances for use in other files
export const initFirebase = () => {
  return app;
};

export { db, collection }; // Export `auth` and `db` for use in other files
