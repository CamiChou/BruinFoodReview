import "./App.css";
import React, { useState, useEffect } from "react";
import { db } from "./firebase";
import { ref, get } from "firebase/database";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import RestaurantDetail from "./RestaurantDetail.js"
import CreateReview from "./pages/createReviewPage/createReview.js"

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
    <BrowserRouter>
    <Routes>
      <Route path="/" element={
          <div>
          <h1>BruinYelp 😋</h1>
          <h2>Eggert 🥺</h2>
          <h3>Here is some JSON data (😎):</h3>
          <pre>{loading ? "Loading..." : data}</pre>
        </div>
      }>
      </Route>
      <Route path="abtres" element={<RestaurantDetail />} />
      <Route path="createrev" element={<CreateReview />} />
    </Routes>
  </BrowserRouter>
  );
}

export default App;
