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
          const childKey=childSnapshot.key;
          const childData = childSnapshot.val();
          restaurant_buf.push({
            name: childData.name,
            type: childData.type,
            loc: childData.location,
            url: "/rest-photos/"+childKey+".jpeg"
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
  let restaurant_tiles;
  if (isLoading) {
    restaurant_tiles = <p>Restaurants are loading!</p>;
  } else {
    restaurant_tiles = restaurants.map((rest, id) => (
      
      <div className="Tile">
        <h1 className="Text">{rest.name}</h1>
        <br/>
        <img 
            src={rest.url}
            style={{
              width: "15vw",
              padding: "2%",
              alignContent: "central"
            }}
        />
        <br/>
        <h4>Type: {rest.type} </h4>
        <br/>
        <h4>Location: {rest.loc}</h4>
      </div>
    ));
  }

  return <div className="Box">{restaurant_tiles}</div>;
}

export default RestaurantBox;
