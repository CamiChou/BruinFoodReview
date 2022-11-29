import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";
import { getAuth } from "firebase/auth";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAKgXB06E25El6oKCV7qkkatKipjJkSXBI",
  authDomain: "cs35l-project-c24eb.firebaseapp.com",
  databaseURL: "https://cs35l-project-c24eb-default-rtdb.firebaseio.com",
  projectId: "cs35l-project-c24eb",
  storageBucket: "cs35l-project-c24eb.appspot.com",
  messagingSenderId: "608807604396",
  appId: "1:608807604396:web:5115453a9f7baa1c9f8f09",
  measurementId: "G-E50TY6MSSV",
};

export const app = initializeApp(firebaseConfig);
export const db = getDatabase(app);
export const auth = getAuth(app);
