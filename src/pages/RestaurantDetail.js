//hooks
import React, { useState, useEffect, useCallback } from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";

import { db } from "../firebase";
import { ref, get, child, query, set, update } from "firebase/database";
import StarRating from "./createReviewPage/StarRating.js";
import { useParams } from "react-router-dom";
import userEvent from "@testing-library/user-event";
import { onAuthStateChanged, getAuth } from "firebase/auth";
import { FieldValue } from "firebase/firestore";
import { ResultList } from "@appbaseio/reactivesearch";

const RestaurantDetail = () => {
  const dbRef = ref(db);
  const params = useParams();
  const restName = params.name;
  const auth = getAuth();
  const [forceFetchRestaurant, setForceFetchRestaurant] = useState(true);
  const [forceFetchReviews, setForceFetchReviews] = useState(true);
  const [averageStars, setAverageStars] = useState(5);
  const [authenticated, setAuthenticated] = useState(false);

  onAuthStateChanged(auth, (user) => {
    setAuthenticated(user != null);
  });

  const renderStars = (numStars) => {
    if (numStars === undefined) {
      numStars = 0; // TODO check why undefined
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

  const handleUpvote = async (event, increment) => {
    const user = auth.currentUser;
    const target = event.target;
    const reviewId = target.getAttribute("review-id");

    let existingUpvote = await get(
      child(dbRef, `users/${user.uid}/reviews/${restName}/${reviewId}`)
    ).then((snapshot) => {
      if (snapshot.exists()) {
        return snapshot.val();
      }
      return 0;
    });
    let curUpvoteCount = await get(
      child(dbRef, `reviews/${restName}/${reviewId}/upvotes`)
    ).then((snapshot) => {
      if (snapshot.exists()) {
        return snapshot.val();
      }
      return -1;
    });
    let newUpvoteCount;
    let userUpvote;
    if (existingUpvote == 0) {
      userUpvote = increment;
      newUpvoteCount = curUpvoteCount + increment;
    } else if (existingUpvote != increment) {
      userUpvote = increment;
      newUpvoteCount = curUpvoteCount + 2 * increment;
    } else {
      userUpvote = null;
      newUpvoteCount = curUpvoteCount - increment;
    }
    update(child(dbRef, `users/${user.uid}/reviews/${restName}`), {
      [reviewId]: userUpvote,
    });
    set(
      child(dbRef, `reviews/${restName}/${reviewId}/upvotes`),
      newUpvoteCount
    );
    setForceFetchReviews(true);
  };

  const getStarData = async () => {
    const starPath = `reviews/${restName}/metadata/stars`;
    let starAverage = await get(child(dbRef, starPath)).then((snapshot) => {
      if (snapshot.exists()) {
        return snapshot.val();
      }
      return 0;
    });
    return starAverage;
  };

  const getReviewData = async () => {
    const user = auth.currentUser;

    var userUpvotes = {};
    if (authenticated) {
      let upvotePath = `users/${user.uid}/reviews/${restName}`;
      userUpvotes = await get(child(dbRef, upvotePath)).then((snapshot) => {
        if (snapshot.exists()) {
          return snapshot.val();
        }
        return {};
      });
    }

    let reviews = await get(child(dbRef, `reviews/${restName}`)).then(
      (snapshot) => {
        const reviews = [];
        if (snapshot.exists()) {
          // lists all reviews and its content
          snapshot.forEach((child) => {
            const info = child.val();
            const key = child.key;
            if (Number.isInteger(Number(key))) {
              const review = {
                id: child.key,
                content: info.content,
                name: info.user,
                stars: info.stars,
                upvoteCount: info.upvotes,
                upvoteStatus: userUpvotes[key],
              };
              reviews.push(review);
            } else if (key == "metadata") {
              setAverageStars(info.stars);
            }
          });
        }
        return reviews;
      }
    );
    return reviews;
  };
  const getRestaurantData = async () => {
    const resPath = `restaurants/${restName}/`;
    let restaurant = await get(child(dbRef, resPath)).then((snapshot) => {
      let resInfo = {};
      if (snapshot.exists()) {
        const resObject = snapshot.val();
        resInfo = {
          name: resObject.name,
          desc: resObject.desc,
          loc: resObject.location,
        };
      } else {
        console.error(`${resPath} does not exist`);
      }
      return resInfo;
    });

    return restaurant;
  };

  const HandleRestaurant = () => {
    const [restaurantData, setRestaurantData] = useState({});
    const [isLoading, setLoading] = useState(true);

    useEffect(() => {
      async function fetchData() {
        if (forceFetchRestaurant) {
          const newAverageStars = await getStarData(params.name);
          const newRestaurantData = await getRestaurantData(params.name);
          setAverageStars(newAverageStars);
          setRestaurantData(newRestaurantData);
          setForceFetchRestaurant(false);
        }
        setLoading(false);
      }
      fetchData();
    }, [averageStars, forceFetchRestaurant]);

    let name = "Loading Name...";
    let location = "Loading Location...";
    let description = "Loading Description...";
    if (!isLoading) {
      name = restaurantData.name;
      location = restaurantData.loc;
      description = restaurantData.desc;
    }
    let restaurantContent = (
      <RestaurantContainer>
        <RestaurantTitle>{name}</RestaurantTitle>
        <RestaurantStars>
          {renderStars(Math.round(averageStars))}
        </RestaurantStars>
        <RestaurantDescription>{description}</RestaurantDescription>
      </RestaurantContainer>
    );
    return (
      <InfoContainer>
        {restaurantContent}
        <RestaurantPhoto src={`/rest-photos/${restName}.jpeg`} />
      </InfoContainer>
    );
  };

  const HandleRestBlurb = () => {
    const [restaurantData, setRestaurantData] = useState({});
    const [isLoading, setLoading] = useState(true);

    useEffect(() => {
      async function fetchData() {
        if (forceFetchRestaurant) {
          const newAverageStars = await getStarData(params.name);
          const newRestaurantData = await getRestaurantData(params.name);
          setAverageStars(newAverageStars);
          setRestaurantData(newRestaurantData);
          setForceFetchRestaurant(false);
        }
        setLoading(false);
      }
      fetchData();
    }, [averageStars, forceFetchRestaurant]);

    let name = "Loading Name...";
    let location = "Loading Location...";
    let description = "Loading Description...";
    if (!isLoading) {
      name = restaurantData.name;
      location = restaurantData.loc;
      description = restaurantData.desc;
    }
    let restaurantContent = (
      <RestaurantContainer>
        <RestaurantTitle>{name}</RestaurantTitle>
        <RestaurantStars>
          {renderStars(Math.round(averageStars))}
        </RestaurantStars>
        <RestaurantDescription>{description}</RestaurantDescription>
      </RestaurantContainer>
    );
    return (
      <InfoContainer>
        {restaurantContent}
        <RestaurantPhoto src={`/rest-photos/${restName}.jpeg`} />
      </InfoContainer>
    );
  };

  const HandleReviews = () => {
    const [revData, setRevData] = useState([]);
    const [isLoading, setLoading] = useState(true);
    const user = auth.currentUser;

    useEffect(() => {
      async function fetchData() {
        if (forceFetchReviews) {
          const reviews = await getReviewData(restName);
          setRevData(reviews);
          setForceFetchReviews(false);
        }
        setLoading(false);
      }
      fetchData();
    }, [revData, forceFetchReviews]);

    let reviewContent;
    if (isLoading) {
      reviewContent = <HoldReviews>Loading Reviews...</HoldReviews>;
    } else if (revData.length == 0) {
      reviewContent = (
        <HoldReviews>
          No reviews yet! Be the first to create a review!
        </HoldReviews>
      );
    } else {
      reviewContent = (
        <HoldReviews>
          {revData.map((rev, id) => (
            <ReviewBase key={id}>
              <ReviewNameContainer>
                <UserName>{rev.name}</UserName>
                <ReviewStars>{renderStars(rev.stars)}</ReviewStars>
              </ReviewNameContainer>
              <ReviewContent>{rev.content}</ReviewContent>
              <p> {rev.upvoteCount}</p>
              <button
                disabled={!authenticated}
                review-id={rev.id}
                rest-name={restName}
                onClick={(e) => {
                  handleUpvote(e, 1);
                }}
              >
                Up {rev.upvoteStatus == 1 ? "✓" : ""}
              </button>
              <button
                disabled={!authenticated}
                review-id={rev.id}
                rest-name={restName}
                onClick={(e) => {
                  handleUpvote(e, -1);
                }}
              >
                Down {rev.upvoteStatus == -1 ? "✓" : ""}
              </button>
            </ReviewBase>
          ))}
        </HoldReviews>
      );
    }
    return (
      <ReviewContainer style={{gridColumn: 1}}>
        <ReviewTitleContainer>
          <ReviewsTopTitle>Reviews</ReviewsTopTitle>
          <Select>
            <option value="upvotes-descending">Upvotes (High to Low)</option>
            <option value="upvotes-ascending">Upvotes (Low to High)</option>
            <option value="stars-descending">Stars (High to Low)</option>
            <option value="stars-ascending">Stars (Low to High)</option>
            <option value="time-descending">Time (Newest to Oldest)</option>
            <option value="time-ascending">Time (Oldest to Newest)</option>
          </Select>
          <CreateReview to={`/${restName}/review`}>
            <Plus src="/CreateReviewPlus.png" />
            <h2
              style={{ marginTop: "5%", marginBottom: "5%", gridColumn: "2" }}
            >
              Create Review
            </h2>
          </CreateReview>
        </ReviewTitleContainer>
        {reviewContent}
      </ReviewContainer>
    );
  };

  return (
    <DetailContainer>
      {HandleRestaurant(restName)}
      <div style={{display: "grid", gridTemplateColumns: "65%"}}>
        {HandleReviews(restName)}
      </div>
    </DetailContainer>
  );
};

const InfoContainer = styled.div`
  display: grid;
  grid-template-columns: 50% 50%;
  margin-top: 5%;
  padding: 2%;
  max-height: 40vh;
  background-color: #D0DFEC;
  box-shadow: 10px 0px 2px;
`;

const DetailContainer = styled.div`
  height: fit-content;
  width: 100vw;
  background-color: #efeeee;
  position: absolute;
`;

const RestaurantContainer = styled.div`
  max-height: inherit;
  max-width: 100vw;
  display: grid;
  grid-template-rows: 20% 15%;
  flex-direction: column;
  grid-column: 1;
`;

const RestaurantTitle = styled.h1`
  align-self: center;
  font-size: 3rem;
  grid-row: 1;
  margin: 0%;
`;

const RestaurantLocation = styled.div`
  color: #efeeee;
  border-radius: 18px;
  background-color: #3284bf;
  max-width: fit-content;
  grid-row: 3;
  padding-top: 1%;
  padding-bottom: 1%;
  padding-right: 2%;
  padding-left: 2%;
  margin-top: auto;
  margin-bottom: auto;
`;

const RestaurantStars = styled.div`
  margin-top: auto;
  margin-bottom: auto;
  grid-row: 2;
`;

const Star = styled.img`
  width: 40px;
  height: 40px;
  padding-right: 1%;
`;

const RestaurantDescription = styled.div`
  font-size: 1rem;
  grid-row: 3;
  padding-top: 3%;
`;

const RestaurantPhoto = styled.img`
  width: 90%;
  grid-column: 2;
  justify-self: right;
  max-height: inherit;
  object-fit: contain;
  margin-top: auto;
  margin-bottom: auto;
`;

const ReviewContainer = styled.div`
  display: grid;
  grid-column: 2;
  width: 100%;
  max-width: 50vw;
  margin-left: auto;
`;

const ReviewTitleContainer = styled.div`
  display: grid;
  width: 100%;
  max-width: 80vw;
  margin: auto;
  grid-row: 1;
  padding-top: 2%;
  padding-bottom: 5%;
  grid-template-columns: 30% 20%;
`;

const ReviewsTopTitle = styled.h1`
  padding-top: 2%;
  font-size: 2.5rem;
  grid-column: 1;
  margin-bottom: 1%;
`;

const Select = styled.select`
  width: 100%;
  height: 35px;
  background: white;
  color: gray;
  padding-left: 5px;
  font-size: 14px;
  border: none;
  margin-top: auto;
  margin-bottom: 1%;
  grid-column: 2;

  option {
    color: black;
    background: white;
    display: flex;
    white-space: pre;
    min-height: 20px;
    padding: 0px 2px 1px;
  }
`;

const Plus = styled.img`
  width: 70%;
  grid-column: 1;
  margin: auto;
`;

const CreateReview = styled(Link)`
  background-color: #3284bf;
  color: #efeeee;
  border-radius: 18px;
  height: min-content;
  grid-column: 3;
  margin-top: auto;
  margin-bottom: 1%;
  max-width: fit-content;
  justify-self: flex-end;
  padding-right: 4%;
  padding-left: 2%;
  text-decoration: none;
  display: grid;
`;

const HoldReviews = styled.div`
  max-height: 100vh;
  max-width: 100vw;
  padding-bottom: 2%;
  display: flex;
  flex-direction: column;
  grid-row: 2;
  overflow-y: auto;
`;

const ReviewBase = styled.div`
  max-width: 80vw;
  display: flex;
  background-color: #d9d9d9;
  border-radius: 25px;
  padding: 2%;
  margin: 1%;
  display: grid;
  grid-template-rows: auto-fit;
  flex-direction: column;
`;

const ReviewNameContainer = styled.div`
  display: grid;
  width: 100%;
  max-height: 20vh;
  grid-row: 1;
  padding-top: 2%;
  padding-bottom: 5%;
  grid-template-columns: 60%;
`;

const UserName = styled.h3`
  font-size: 1.5rem;
  grid-row: 1;
  margin-top: 0%;
  margin-bottom: 1%;
`;

const ReviewStars = styled.div`
  margin-top: auto;
  margin-bottom: auto;
  grid-row: 1;
  grid-column: 2;
`;

const ReviewContent = styled.div`
  font-size: 1rem;
  grid-row: 3;
`;

export default RestaurantDetail;
