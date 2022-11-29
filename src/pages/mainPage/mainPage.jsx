import React, { useEffect, useState } from 'react';
import { getDatabase, ref, get, child, set } from "firebase/database";
import { useParams } from "react-router-dom";
import FilterBox from "./filterBox.jsx";
import RestaurantBox  from "./restaurantBox.jsx";
import "./mainPage.css"

function MainPage() {
  const [filter, setFilter] = useState([]);
  
  return (
    <div className="mainPage">
            <h1 className="font-weight-light">Main Page</h1>
            <p>
              This is where we will have all resturants and filters
            </p>
          <div className="split">

            <div className='filterbox'><FilterBox filter={filter} setFilter={setFilter}/></div>
            <div className='restbox'><RestaurantBox filter={filter} setFilter={setFilter}/></div>

          </div>
    </div>
  );
}

export default MainPage;