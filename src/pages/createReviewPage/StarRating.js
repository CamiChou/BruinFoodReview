import styles from "./styles.css";
import React, { useState } from "react";

const UNFILLED = "/Star1.png";
const FIlLED = "/Star2.png";


const StarRating = ({rating, setRating}) => {
  // const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  
  return (
    <div className="star-rating">
      {[...Array(5)].map((star, index) => {
        index += 1;
        
        return (
          <button
            type="button"
            key={index}
            className={index <= (hover || rating) ? "on" : "off"}
            onClick={() => setRating(index)}
            onMouseEnter={() => setHover(index)}
            onMouseLeave={() => setHover(rating)}
            value="rating"
          > 
            <img 
            src = {index <= (hover || rating) ? FIlLED : UNFILLED}
            style={{ width: 45, height: 45 }} 
             >
            </img>
          </button>
        );
      })}
    </div>
  );
  console.log(rating);
};
export default StarRating;


