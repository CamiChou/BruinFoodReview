import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";
import { getAuth } from "firebase/auth";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAHtyLhPT31zK8wrIg1qp2I6LSjuplc0ps",
  authDomain: "cs35l-project-ce551.firebaseapp.com",
  databaseURL: "https://cs35l-project-ce551-default-rtdb.firebaseio.com",
  projectId: "cs35l-project-ce551",
  storageBucket: "cs35l-project-ce551.appspot.com",
  messagingSenderId: "370167888366",
  appId: "1:370167888366:web:01b141177e87658d8c36ff",
  measurementId: "G-0YFW82R1CK",
};

export const app = initializeApp(firebaseConfig);
export const db = getDatabase(app);
export const auth = getAuth(app);
