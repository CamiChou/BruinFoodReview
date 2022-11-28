import React, { useEffect, useState } from 'react';
import styles from "./styles.css"
import styled from "styled-components";

import { db } from "../../firebase.js";
import { ref, get, child } from "firebase/database";
  
const theme = {
  grayDefault: {
    default: '#757575',
    hover: '#90a4ae'
  },
  blueClick: {
    default: '#3284bf',
    hover: '#90a4ae'
  }
}

const Button = styled.button`
  background-color: ${props => theme[props.theme].default};
  padding: 5px 10px;
  border-radius: 5px;
  outline: 0;
  transition: ease background-color 250ms;
  margin: 5px 5px;
  &:hover {
    background-color: ${props => theme[props.theme].hover};
  }
`

Button.defaultProps = {
  theme: 'grayDefault'
}

const dbRef = ref(db);

async function getFilteredResturants(filter) {
  // let restaurants = await get(child(dbRef, `restaurants`));
  let path;
  // if(filter == "") {
  path = "filters/".concat(filter);
  // }
  // else {
  //   path = "restaurants";
  // }
  let filters = await get(child(dbRef, `${path}`))
    .then((snapshot) => {
      let filter_buf = [];
      if (snapshot.exists()) {
        snapshot.forEach((childSnapshot) => {
          const childKey=childSnapshot.key;
          filter_buf.push(childKey);
        });
      }
      console.log(filter_buf);
      return filter_buf;
    })
    .catch((error) => {
      console.error(error.message);
    });
}

function buttonClick(e)
{
  getFilteredResturants(e.target.name);
}


// const types = ["ASUCLA", "Hilld Food", "Food Truck"];
// const service = ["Takeout", "Dine-In"];
// const food = ["American", "Italian", "Asian", 
//               "Meditteranean", "Dessert", "Market",
//               "Cafe", "Latin", "Dinner"];
// const period = ["Breakfast", "Lunch", "Dinner"];


function FilterBox() {
  return (
    <div className="mainBG">
      <div className="filterBox">
        <div className = "filterBoxTitle">Filters</div>
          <div className = "location">
            <h3>Type</h3>
              <div>
                <Button name="ascula" onClick={ buttonClick }>ASUCLA</Button>
                <Button name="hillfood" onClick={ buttonClick }>Hill Food</Button>
                <Button name="foodtruck" onClick={ buttonClick }>Food Truck</Button>
              </div>
          </div>
          <div className="serviceType">
            <h3>Servive Type</h3>
            <div >
              <Button name="takeout" onClick={ buttonClick }>Takeout</Button>
              <Button name="dinein" onClick={ buttonClick }>Dine-In</Button>
            </div>
          </div>
          <div className="foodOffered">
            <h3>Food Offered</h3>
            <div>
              <Button name="american" onClick={ buttonClick }>American</Button>
              <Button name="italian" onClick={ buttonClick }>Italian</Button>
              <Button name="asian" onClick={ buttonClick }>Asian</Button>
            </div>
            <div>
              <Button name="meditteranean" onClick={ buttonClick }>Meditteranean</Button>
              <Button name="dessert" onClick={ buttonClick }>Dessert</Button>
              <Button name="market" onClick={ buttonClick }>Market</Button>
            </div>
            <div>
              <Button name="cafe" onClick={ buttonClick }>Cafe</Button>
              <Button name="latin" onClick={ buttonClick }>Latin</Button>
              <Button name="sandwiches" onClick={ buttonClick }>Sandwiches</Button>
            </div>
          </div>
          <div className="mealPeriod">
            <h3>Meal Period</h3>
            <div>
              <Button name="breakfast" onClick={ buttonClick }>Breakfast</Button>
              <Button name="lunch" onClick={ buttonClick }>Lunch</Button>
              <Button name="dinner" onClick={ buttonClick }>Dinner</Button>
            </div>
          </div>

      </div>  
    </div>    
  );
}
   
export default FilterBox;