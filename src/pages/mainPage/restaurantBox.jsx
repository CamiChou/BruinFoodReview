import React, { useState, useEffect } from "react";
import mainPage from "./restaurantBox.css";

import { db } from "../../firebase.js";
import { ref, get, child } from "firebase/database";
import { getFilteredResturants } from "./filterBox.jsx";
import { Link } from "react-router-dom";

const dbRef = ref(db);

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
    restaurantTiles = restaurants.map((rest, id) => (
      <Link to={`/${rest.key}`}>
        <a>
        <div key={id} className="Tile">
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
            <div className="typeDisplay">
              <h4> Type: {rest.type} </h4>
            </div>
            <div className="restLocation">
              <h4>Location: {rest.loc}</h4>
            </div>
          </div>
        </div>
        </a>
      </Link>
    ));
  }

  return <div className="Box">{restaurantTiles}</div>;
};

export default RestaurantBox;
