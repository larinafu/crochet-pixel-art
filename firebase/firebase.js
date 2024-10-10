import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyABTYdc9OmJDkbGmWhuSoKm8xzp5tCrpVw",
  authDomain: "crochet-pixel-art.firebaseapp.com",
  projectId: "crochet-pixel-art",
  storageBucket: "crochet-pixel-art.appspot.com",
  messagingSenderId: "956421338154",
  appId: "1:956421338154:web:fc8db0a04b8c7a63abff53",
  measurementId: "G-6XSXBXRQNT",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, app, db };
