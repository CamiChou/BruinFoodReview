import React, { useState, useEffect } from "react";
import mainPage from "./restaurantBox.css";
import styled from "styled-components";

import { db } from "../../firebase.js";
import { ref, get, child, set } from "firebase/database";
import { getFilteredResturants } from "./filterBox.jsx";
import { Link } from "react-router-dom";
import { renderStars} from "../createReviewPage/StarRating.js";

const dbRef = ref(db);

const updateRestaurantStars = async (restaurant) => {
  let stars = await get(
    child(dbRef, `reviews/${restaurant.key}/metadata/stars`)
  ).then((snapshot) => {
    if (snapshot.exists()) {
      return snapshot.val();
    }
    return 0;
  });
  restaurant.stars = stars;
  set(child(dbRef, `restaurants/${restaurant.key}/stars`), stars);
};

const RestaurantBox = (props) => {
  const [restaurants, setRestaurants] = useState([]);
  const [isLoading, setLoading] = useState(true);

  const loadRestaurants = async (filter) => {
    let restaurantData = await get(child(dbRef, `restaurants`))
      .then((snapshot) => {
        let restaurantBuf = [];
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
              restaurantBuf.push({
                key: childKey,
                name: childData.name,
                type: childData.type,
                loc: childData.location,
                stars: childData.stars,
                url: "/rest-photos/" + childKey + ".jpeg",
              });
            }
          });
        }
        return restaurantBuf;
      })
      .catch((error) => {
        console.error(error.message);
      });
    return restaurantData;
  };

  useEffect(() => {
    async function fetchData() {
      let filter = props.filter;
      const data = await loadRestaurants(filter);
      setRestaurants(data);
      setLoading(false);
    }
    fetchData();
  }, [props.filter]);
  let restaurantTiles;
  if (isLoading) {
    restaurantTiles = <p>Restaurants are loading!</p>;
  } else {
    restaurants.forEach((restaurant) => {
      updateRestaurantStars(restaurant);
    });
    restaurantTiles = restaurants.map((rest, id) => (
      <Link key={id} to={`/${rest.key}`}>
        <div className="Tile">
          <div className="parent">
            <img
              className="restImages"
              src={rest.url}
              style={{
                width: "80%",
                height: "95%",
                borderRadius: "10px",
              }}
            />
            <h1 className="Text">{rest.name}</h1>
            <h3 className="typeDisplay"> Type: {rest.type} </h3>
            <h3 className="restLocation">Location: {rest.loc}</h3>
            <div className="stars">{renderStars(Math.round(rest.stars))}</div>
          </div>
        </div>
      </Link>
    ));
  }

  return <div className="Box">{restaurantTiles}</div>;
};

export default RestaurantBox;
