import React, { Component } from 'react';
import styles from "./styles.css"
import styled from "styled-components";

import { ref, get, child, query } from "firebase/database";

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

function buttonClick()
{
  console.log("Clicked");
}

function FilterBox() {
  return (
    <div className="filterBox">
      <div className = "filterBoxTitle">Filters</div>
        <div className = "Type">
          <h3>Type</h3>
            <div>
              <Button onClick={ buttonClick }>ASUCLA</Button>
              <Button onClick={ buttonClick }>Hill Food</Button>
              <Button onClick={ buttonClick }>Food Truck</Button>
            </div>
        </div>
        <div className="serviceType">
          <h3>Servive Type</h3>
          <div>
            <Button onClick={ buttonClick }>Takeout</Button>
            <Button onClick={ buttonClick }>Dine-In</Button>
          </div>
        </div>
        <div className="foodOffered">
          <h3>Food Offered</h3>
          <div>
            <Button onClick={ buttonClick }>American</Button>
            <Button onClick={ buttonClick }>Italian</Button>
            <Button onClick={ buttonClick }>Asian</Button>
          </div>
          <div>
          <Button onClick={ buttonClick }>Meditteranean</Button>
          <Button onClick={ buttonClick }>Dessert</Button>
          <Button onClick={ buttonClick }>Market</Button>
          </div>
          <div>
          <Button onClick={ buttonClick }>Cafe</Button>
          <Button onClick={ buttonClick }>Latin</Button>
          <Button onClick={ buttonClick }>Sandwhiches</Button>
          </div>
        </div>
        <div className="mealPeriod">
          <h3>Meal Period</h3>
          <div>
            <Button onClick={ buttonClick }>Breakfast</Button>
            <Button onClick={ buttonClick }>Lunch</Button>
            <Button onClick={ buttonClick }>Dinner</Button>
          </div>
        </div>

    </div>      
  );
}
   
export default FilterBox;