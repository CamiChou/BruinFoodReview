import styles from "./styles.css";
import React, { useState } from "react";

const UNFILLED = "/Star1.png";
const FILLED = "/Star2.png";

const StarRating = ({ rating, setRating }) => {
  const [hover, setHover] = useState(0);
  return (
    <div className="star-rating">
      {[...Array(5)].map((star, index) => {
        index += 1;
        let on = (index <= hover || index <= rating) && rating != -1;
        return (
          <button
            type="button"
            key={index}
            className={on ? "on" : "off"}
            onClick={() => {
              setRating(index);
              setHover(0);
            }}
            onMouseEnter={() => {
              setHover(index);
              if (rating == -1) {
                setRating(0);
              }
            }}
            onMouseLeave={() => {
              setHover(rating);
            }}
            value="rating"
          >
            <img
              src={on ? FILLED : UNFILLED}
              style={{ width: 45, height: 45 }}
            ></img>
          </button>
        );
      })}
    </div>
  );
};
export default StarRating;
