import "./App.css";
import React, { useState, useEffect } from "react";
import { db, auth } from "./firebase";
import { ref, get } from "firebase/database";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import ReactDOM from "react-dom/client";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import RestaurantDetail from "./pages/RestaurantDetail.js";
import CreateReview from "./pages/createReviewPage/createReview.js";
import MainPage from "./pages/mainPage/mainPage.jsx";
import Header from "./pages/Header.jsx";

const dbRef = ref(db);

function App() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      get(dbRef)
        .then((snapshot) => {
          if (snapshot.exists()) {
            let data_val = snapshot.val();
            setData(JSON.stringify(data_val, null, 4));
          } else {
            console.log("No data available");
          }
          setLoading(false);
        })
        .catch((error) => {
          setLoading(false);
          console.error(error);
        });
    };

    fetchData();
  }, []);
  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/:name/review" element={<CreateReview />} />
        <Route path="/:name" element={<RestaurantDetail />} />
      </Routes>
    </Router>
  );
}

export default App;
