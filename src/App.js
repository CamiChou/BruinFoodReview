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
