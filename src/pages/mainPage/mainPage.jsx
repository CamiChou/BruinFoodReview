import React, { useEffect, useState } from 'react';
import { getDatabase, ref, get, child, set } from "firebase/database";
import { useParams } from "react-router-dom";

import FilterBox from "./filterBox.jsx";
import RestaurantBox  from "./restaurantBox.jsx";

function MainPage() {
  const [filter, setFilter] = useState([]);
  
  return (
    <div className="mainPage">
      <div className="container">
        <div className="row align-items-center my-5">
          <div className="col-lg-5">
            <h1 className="font-weight-light">Main Page</h1>
            <p>
              This is where we will have all resturants and filters
            </p>
          </div>
          <div>
            <FilterBox filter={filter} setFilter={setFilter}/>
            <RestaurantBox filter={filter} setFilter={setFilter}/>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MainPage;