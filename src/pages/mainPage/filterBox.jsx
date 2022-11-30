import React, { useEffect, useState } from "react";
import styles from "./filterBox.css";
import styled from "styled-components";
import { db } from "../../firebase.js";
import { ref, get, child } from "firebase/database";


const Button = styled.button`
  background-color: #EFEEEE;
  padding: 5px 10px;
  border-radius: 3px;
  outline: 0;
  transition: ease background-color 250ms;
  margin: 5px 5px;
  &:hover {
    background-color: #90a4ae;
  }
`;

const ButtonToggle = styled(Button)`
  background-color: #EFEEEE;
  ${({ active }) =>
    active &&
    `
    background-color: #3284bf;
    &:hover {
      background-color: #3284bf;
  `}
`;

const dbRef = ref(db);

async function getFilteredResturants(name, setFilter) {
  let filters = await get(child(dbRef, `filters/${name}`))
    .then((snapshot) => {
      let filter_buf = [];
      if (snapshot.exists()) {
        snapshot.forEach((childSnapshot) => {
          const childKey = childSnapshot.key;
          filter_buf.push(childKey);
        });
      } else {
        console.error(`Error getting filter: ${name}`);
      }
      return filter_buf;
    })
    .catch((error) => {
      console.error(error.message);
    });
  setFilter(filters);
}

function FilterBox(props) {
  const filter_buttons = [
    {
      key: "reset",
      buttons: [
        {
          key: "all",
          name: "Reset",
        },
      ],
    },

    {
      key: "location",
      name: "Type",
      buttons: [
        {
          key: "asucla",
          name: "ASUCLA",
        },
        {
          key: "hillfood",
          name: "Hill Food",
        },
        {
          key: "foodtruck",
          name: "Food Truck",
        },
      ],
    },

    {
      key: "serviceType",
      name: "Service Type",
      buttons: [
        {
          key: "takeout",
          name: "Takeout",
        },
        {
          key: "dinein",
          name: "Dine-In",
        },
      ],
    },

    {
      key: "foodOffered",
      name: "Food Offered",
      buttons: [
        {
          key: "american",
          name: "American",
        },
        {
          key: "italian",
          name: "Italian",
        },
        {
          key: "asian",
          name: "Asian",
        },
        {
          key: "meditteranean",
          name: "Meditteranean",
        },
        {
          key: "dessert",
          name: "Dessert",
        },
        {
          key: "market",
          name: "Market",
        },
        {
          key: "cafe",
          name: "Cafe",
        },
        {
          key: "latin",
          name: "Latin",
        },
        {
          key: "sandwiches",
          name: "Sandwiches",
        },
      ],
    },

    {
      key: "mealPeriod",
      name: "Meal Period",
      buttons: [
        {
          key: "breakfast",
          name: "Breakfast",
        },
        {
          key: "lunch",
          name: "Lunch",
        },
        {
          key: "dinner",
          name: "Dinner",
        },
      ],
    },
  ];

  let button_grid = [];
  // console.log(filter_buttons[0].buttons[0]['key']);
  const [active, setActive] = useState(filter_buttons[0].buttons[0]['key']);
  filter_buttons.forEach((elem, i) => {
    let buttons = elem.buttons.map((button_elem, i) => {
      return (
        <ButtonToggle
          active = {active===button_elem.key}
          key={i}
          name={button_elem.key}
          onClick={(e) => {
            setActive(button_elem.key);
            getFilteredResturants(e.target.name, props.setFilter);
          }}
        >
          {button_elem.name}
        </ButtonToggle>
      );
    });
    button_grid.push(
      <div key={i} className={elem.key}>
        <h3>{elem.name}</h3>
        <div>{buttons}</div>
      </div>
    );
  });

  return (
    <div className="mainBG">
      <div className="filterBox">
        <div className="filterTopBar"> 
           Filters
        </div>
        {button_grid}
      </div>
    </div>
  );
}

export default FilterBox;
