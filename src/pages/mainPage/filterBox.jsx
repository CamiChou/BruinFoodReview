import { child, get, ref } from "firebase/database";
import React, { useState } from "react";
import styled from "styled-components";
import { db } from "../../firebase.js";
import "./filterBox.css";

const dbRef = ref(db);

async function getFilteredResturants(name, setFilter) {
  let filters = await get(child(dbRef, `filters/${name}`))
    .then((snapshot) => {
      let filterBuf = [];
      if (snapshot.exists()) {
        snapshot.forEach((childSnapshot) => {
          const childKey = childSnapshot.key;
          filterBuf.push(childKey);
        });
      } else {
        console.error(`Error getting filter: ${name}`);
      }
      return filterBuf;
    })
    .catch((error) => {
      console.error(error.message);
    });
  setFilter(filters);
}

function FilterBox(props) {
  const filterButtons = [
    {
      key: "reset",
      buttons: [
        {
          key: "all",
          name: "Reset Filters",
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

  let buttonGrid = [];
  const [active, setActive] = useState(filterButtons[0].buttons[0]["key"]);
  filterButtons.forEach((elem, i) => {
    let buttons = elem.buttons.map((buttonElem, i) => {
      return (
        <ButtonToggle
          active={active === buttonElem.key}
          key={i}
          name={buttonElem.key}
          onClick={(e) => {
            setActive(buttonElem.key);
            getFilteredResturants(e.target.name, props.setFilter);
          }}
        >
          {buttonElem.name}
        </ButtonToggle>
      );
    });
    buttonGrid.push(
      <div key={i} className={elem.key}>
        <h3>{elem.name}</h3>
        <div>{buttons}</div>
      </div>
    );
  });

  return (
    <div className="mainBG">
      <div className="filterBox">
        <div className="filterTopBar">Filters</div>
        {buttonGrid}
      </div>
    </div>
  );
}

const Button = styled.button`
  background-color: #efeeee;
  padding: 5px 10px;
  font-weight: bold;
  border-radius: 5px;
  outline: 0;
  transition: ease background-color 250ms;
  margin: 5px 5px;
  &:hover {
    background-color: #90a4ae;
  }
`;

const ButtonToggle = styled(Button)`
  background-color: #efeeee;
  ${({ active }) =>
    active &&
    `
    color: #EFEEEE;
    background-color: #3284bf;
    &:hover {
      background-color: #3284bf;
  `}
`;

export default FilterBox;
