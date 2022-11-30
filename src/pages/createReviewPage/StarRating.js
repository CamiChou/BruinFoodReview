import React, { useState } from "react";
import styled from "styled-components";

const Unfilled = "/Star1.png";
const Filled = "/Star2.png";

const Star = styled.img`
  width: 48px;
  padding-right: 1%;
`;

const renderStars = (numStars) => {
  if (!Number.isInteger(numStars)) {
    numStars = 0;
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
              src={on ? Filled : Unfilled}
              style={{ width: 45, height: 45 }}
            ></img>
          </button>
        );
      })}
    </div>
  );
};
export default StarRating;
export { renderStars };
