import React, { useState, useEffect } from "react";
import mainPage from "./restaurantBox.css";
import styled from "styled-components";

import { db } from "../../firebase.js";
import { ref, get, child } from "firebase/database";
import { getFilteredResturants } from "./filterBox.jsx";
import { Link } from "react-router-dom";

const dbRef = ref(db);

const renderStars = (numStars) => {
  if (numStars === undefined) {
    numStars = 0; // TODO check why undefined
  }
  let off = Array(5 - numStars)
    .fill(null)
    .map((elem, id) => {
      return <Star key={id} src={"/Star1.png"}></Star>;
    });
  let on = Array(numStars)
    .fill(null)
    .map((elem, id) => {
      return <Star key={5 + id} src={"/Star2.png"}></Star>;
    });
  return (
    <div>
      {on}
      {off}
    </div>
  );
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
              console.log(Math.round(childData.stars))
              restaurantBuf.push({
                key: childKey,
                name: childData.name,
                type: childData.type,
                loc: childData.location,
                stars:childData.stars,
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
      <Link key={id} to={`/${rest.key}`}>
        <a>
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
            <div className="stars">
            {renderStars(Math.round(rest.stars))}
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


const Star = styled.img`
  width: 48px;
  padding-right: 1%;
`;