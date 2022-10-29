import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBFv_NIBqtpOz0TyjRYc4g2ou1ZNu6brKU",
  authDomain: "cs35l-project-d0556.firebaseapp.com",
  databaseURL: "https://cs35l-project-d0556-default-rtdb.firebaseio.com",
  projectId: "cs35l-project-d0556",
  storageBucket: "cs35l-project-d0556.appspot.com",
  messagingSenderId: "691427087362",
  appId: "1:691427087362:web:dbd69243c262b05396c31b",
  measurementId: "G-DZRRBGRQW6",
};

export const app = initializeApp(firebaseConfig);
export const db = getDatabase(app);