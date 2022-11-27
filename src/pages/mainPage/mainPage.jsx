import React from "react";
import { getDatabase, ref, get, child, set } from "firebase/database";
import { useParams } from "react-router-dom";

import FilterBox from "./filterBox.jsx";
import RestaurantBox  from "./restaurantBox.jsx";

function MainPage() {
  return (
    <div className="mainPage">
      <div class="container">
        <div class="row align-items-center my-5">
          <div class="col-lg-7">
            <img
              class="img-fluid rounded mb-4 mb-lg-0"
              src="http://placehold.it/900x400"
              alt=""
            />
          </div>
          <div class="col-lg-5">
            <h1 class="font-weight-light">Main Page</h1>
            <p>
              This is where we will have all resturants and filters
            </p>
          </div>
          <div>
            <FilterBox />
            <RestaurantBox />
          </div>
        </div>
      </div>
    </div>
  );
}

export default MainPage;