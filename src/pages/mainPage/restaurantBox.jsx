import React, { useState, useEffect } from "react";
import mainPage from "./mainPage.css";

import { db } from "../../firebase.js";
import { ref, get, child } from "firebase/database";

const dbRef = ref(db);

async function loadRestaurants() {
  let restaurants = await get(child(dbRef, `restaurants`))
    .then((snapshot) => {
      let restaurant_buf = [];
      if (snapshot.exists()) {
        snapshot.forEach((childSnapshot) => {
          const childData = childSnapshot.val();
          restaurant_buf.push({
            name: childData.name,
            type: childData.type,
            loc: childData.location,
          });
        });
      }
      return restaurant_buf;
    })
    .catch((error) => {
      console.error(error.message);
    });
  return restaurants;
}

function RestaurantBox() {
  const [restaurants, setRestaurants] = useState([]);
  const [isLoading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      const data = await loadRestaurants();
      setRestaurants(data);
      setLoading(false);
    }
    fetchData();
  }, [restaurants]);
  console.log(restaurants);
  let restaurant_tiles;
  if (isLoading) {
    restaurant_tiles = <p>Restaurants are loading!</p>;
  } else {
    restaurant_tiles = restaurants.map((rest, id) => (
      <div className="Tile">
        Name: {rest.name}
        Type: {rest.type}
        Location: {rest.loc}
      </div>
    ));
  }

  return <div className="Box">{restaurant_tiles}</div>;
}

export default RestaurantBox;
