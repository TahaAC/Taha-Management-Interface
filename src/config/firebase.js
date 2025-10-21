// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBjUmbya90h1p_C2jEE6j4kD8osUekzNeE",
  authDomain: "interface-e05b3.firebaseapp.com",
  projectId: "interface-e05b3",
  storageBucket: "interface-e05b3.firebasestorage.app",
  messagingSenderId: "100866290099",
  appId: "1:100866290099:web:c2193265f579c3b8d21bc6"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Cloud Firestore and get a reference to the service
const db = getFirestore(app);

export { db };
export default app;