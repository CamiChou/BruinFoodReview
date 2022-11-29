import React, { useState, useEffect } from "react";
import mainPage from "./restaurantBox.css";

import { db } from "../../firebase.js";
import { ref, get, child } from "firebase/database";
import { getFilteredResturants } from "./filterBox.jsx";
import { Link } from "react-router-dom";

const dbRef = ref(db);

async function loadRestaurants(filter) {
  let restaurants = await get(child(dbRef, `restaurants`))
    .then((snapshot) => {
      let restaurant_buf = [];
      if (snapshot.exists()) {
        snapshot.forEach((childSnapshot) => {
          const childKey = childSnapshot.key;
          const childData = childSnapshot.val();
          if (
            filter === undefined ||
            filter.length == 0 ||
            filter.includes(childKey)
          ) {
            // TOOD: check why undefined
            restaurant_buf.push({
              key: childKey,
              name: childData.name,
              type: childData.type,
              loc: childData.location,
              url: "/rest-photos/" + childKey + ".jpeg",
            });
          }
        });
      }
      return restaurant_buf;
    })
    .catch((error) => {
      console.error(error.message);
    });
  return restaurants;
}

function RestaurantBox(props) {
  const [restaurants, setRestaurants] = useState([]);
  const [isLoading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      let filter = props.filter;
      const data = await loadRestaurants(filter);
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
      
      <Link to={`/${rest.key}`}>
      <div key={id} className="Tile">
        
        <div className="parent">
          <img
            className="restImages"
            src={rest.url}
            style={{
              width: "15vw",
              padding: "2%",
              alignContent: "central",
            }}
          />
          <h1 className="Text">{rest.name}</h1>
          <div className="typeDisplay">
            <h4> Type: {rest.type} </h4>
          </div>
          <div className="restLocation">
            <h4>Location: {rest.loc}</h4>
          </div>
          
        </div>
      </div>
      </Link>
    ));
  }

  return <div className="Box">{restaurant_tiles}</div>;
}

export default RestaurantBox;
