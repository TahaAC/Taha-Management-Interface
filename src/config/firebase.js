// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDWc0YCVUXnflKgt_tqG0mSPGq04D7Q-O8",
  authDomain: "taha-school-management-e2076.firebaseapp.com",
  projectId: "taha-school-management-e2076",
  storageBucket: "taha-school-management-e2076.firebasestorage.app",
  messagingSenderId: "1020268079372",
  appId: "1:1020268079372:web:e6cd398dc3e8fcbf524129"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Cloud Firestore and get a reference to the service
const db = getFirestore(app);

export { db };
export default app;