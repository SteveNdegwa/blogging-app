import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth"
import { getFirestore } from "firebase/firestore"


// Web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBidn84EY9C_8SEY7--6tEGk0s2ZTKdtIY",
  authDomain: "social-media-app-001.firebaseapp.com",
  projectId: "social-media-app-001",
  storageBucket: "social-media-app-001.appspot.com",
  messagingSenderId: "895057529492",
  appId: "1:895057529492:web:5b3fd87a2f015c6f0d0281"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();
export const db = getFirestore(app);