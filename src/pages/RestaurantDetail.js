//hooks
import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";

import { db } from "../firebase";
import { ref, get, child, query, set, update } from "firebase/database";
import StarRating from "./createReviewPage/StarRating.js";
import { useParams } from "react-router-dom";
import userEvent from "@testing-library/user-event";
import { fetchSignInMethodsForEmail, getAuth } from "firebase/auth";
import { FieldValue } from "firebase/firestore";

const dbRef = ref(db);

function LoadResTitle() {
  const params = useParams();
  const [name, setName] = useState([]);

  const restPath = `restaurants/${params.name}/name`;
  get(child(dbRef, restPath))
    .then((snapshot) => {
      if (snapshot.exists()) {
        var info = snapshot.val();
        setName(info);
      } else {
        console.error("");
      }
    })
    .catch((error) => {
      console.error(error);
    });

  return <RestaurantTitle>{name}</RestaurantTitle>;
}

function LoadResDesc() {
  const params = useParams();
  const [desc, setDesc] = useState([]);

  const restPath = `restaurants/${params.name}/desc`;
  get(child(dbRef, restPath))
    .then((snapshot) => {
      if (snapshot.exists()) {
        var info = snapshot.val();
        setDesc(info);
      } else {
        console.log("No data available");
      }
    })
    .catch((error) => {
      console.error(error);
    });

  return <RestaurantDesc>{desc}</RestaurantDesc>;
}

function LoadResPic() {
  const params = useParams();

  return <RestaurantPhoto src={`/rest-photos/${params.name}.jpeg`} />;
}

async function GrabStars(restName) {
  let total_stars = await get(
    child(dbRef, `reviews/${restName}/metadata/stars`)
  ).then((snapshot) => {
    if (snapshot.exists()) {
      return snapshot.val();
    }
    return 0;
  });
  return total_stars;
}

async function GrabReviewsNew(restName) {
  const auth = getAuth();
  const user = auth.currentUser;
  // TODO check if logged in

  const topUserPostsRef = query(ref(db, "reviews"));
  let existing_upvotes = {};
  if (user != null) {
    existing_upvotes = await get(
      child(dbRef, `users/${user.uid}/reviews/${restName}`)
    ).then((snapshot) => {
      if (snapshot.exists()) {
        return snapshot.val();
      }
      return {};
    });
  }

  let reviews = await get(child(topUserPostsRef, `/${restName}`))
    .then((snapshot) => {
      if (snapshot.exists()) {
        // lists all reviews and its content
        const reviews = [];
        snapshot.forEach((child) => {
          const info = child.val();
          const key = child.key;
          if (Number.isInteger(Number(key))) {
            const review = {
              id: child.key,
              content: info.content,
              name: info.user,
              stars: info.stars,
              upvotes: info.upvotes,
              status: existing_upvotes[child.key],
            };
            reviews.push(review);
          }
        });
        return reviews;
      } else {
        return [];
      }
    })
    .catch((error) => {
      console.error(error);
    });

  return reviews;
}

function RenderStars(numStars) {
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
}

async function upvote(e, inc) {
  const auth = getAuth();
  const user = auth.currentUser;
  const elem = e.target;
  const review_id = elem.getAttribute("review-id");
  const rest_name = elem.getAttribute("rest-name");
  const rest_path = `reviews/${rest_name}/${review_id}`;
  // TODO check if signed in
  let existing_upvote = await get(
    child(dbRef, `users/${user.uid}/reviews/${rest_name}/${review_id}`)
  )
    .then((snapshot) => {
      if (snapshot.exists()) {
        return snapshot.val();
      }
      return 0;
    })
    .catch((error) => {
      console.error(error.message);
    });
  let cur_upvotes = await get(child(dbRef, `${rest_path}/upvotes`))
    .then((snapshot) => {
      if (snapshot.exists()) {
        return snapshot.val();
      }
      return -1;
    })
    .catch((error) => {
      console.error(error.message);
    });
  let user_upvote;
  let new_upvotes;
  console.log(review_id);
  if (existing_upvote == 0) {
    user_upvote = inc;
    new_upvotes = cur_upvotes + inc;
  } else if (existing_upvote != inc) {
    user_upvote = inc;
    new_upvotes = cur_upvotes + 2 * inc;
  } else {
    user_upvote = null;
    new_upvotes = cur_upvotes - inc;
  }
  update(child(dbRef, `users/${user.uid}/reviews/${rest_name}`), {
    [review_id]: user_upvote,
  });
  set(child(dbRef, `${rest_path}/upvotes`), new_upvotes);
}

function LoadReviews() {
  const [revData, setRevData] = useState([]);
  const [isLoading, setLoading] = useState(true);
  const params = useParams();

  const auth = getAuth();
  const user = auth.currentUser;
  const authenticated = user != null;

  useEffect(() => {
    async function fetchData() {
      const reviews = await GrabReviewsNew(params.name);
      setRevData(reviews);
      setLoading(false);
    }
    fetchData();
  }, [revData]);

  if (isLoading) {
    return <HoldReviews>Loading Reviews...</HoldReviews>;
  } else {
    if (revData.length == 1) {
      return (
        <HoldReviews>
          No reviews yet! Be the first to create a review!
        </HoldReviews>
      );
    } else {
      return (
        <HoldReviews>
          {revData.map((rev, id) => (
            <ReviewBase key={id}>
              <ReviewTitleContainer>
                <UserName>{rev.name}</UserName>
                <ReviewStars>{RenderStars(rev.stars)}</ReviewStars>
              </ReviewTitleContainer>
              <ReviewContent>{rev.content}</ReviewContent>
              <p> {rev.upvotes}</p>
              <button
                disabled={!authenticated}
                review-id={rev.id}
                rest-name={params.name}
                onClick={(e) => upvote(e, 1)}
              >
                Up {rev.status == 1 ? "✓" : ""}
              </button>
              <button
                disabled={!authenticated}
                review-id={rev.id}
                rest-name={params.name}
                onClick={(e) => upvote(e, -1)}
              >
                Down {rev.status == -1 ? "✓" : ""}
              </button>
            </ReviewBase>
          ))}
        </HoldReviews>
      );
    }
  }
}

function HandleInfo() {
  const params = useParams();
  const [totalStars, setTotalStars] = useState(5);
  useEffect(() => {
    async function fetchData() {
      const totalStars = await GrabStars(params.name);
      setTotalStars(totalStars);
    }
    fetchData();
  }, [totalStars]);
  return (
    <InfoContainer>
      <ResContainer>
        <LoadResTitle />
        <RestaurantStars>{RenderStars(totalStars)}</RestaurantStars>
        <LoadResDesc />
      </ResContainer>
      <LoadResPic />
    </InfoContainer>
  );
}

function RestaurantDetail() {
  const params = useParams();
  const review_path = `/${params.name}/review`;
  return (
    <DetailContainer>
      <HandleInfo />
      <ReviewContainer>
        <ReviewTitleContainer>
          <ReviewsTopTitle>Reviews</ReviewsTopTitle>
          <CreateReview to={review_path}>
            <Plus src="/CreateReviewPlus.png" />
            <h2
              style={{ marginTop: "5%", marginBottom: "5%", gridColumn: "2" }}
            >
              Create Review
            </h2>
          </CreateReview>
        </ReviewTitleContainer>
        <LoadReviews />
      </ReviewContainer>
    </DetailContainer>
  );
}

const InfoContainer = styled.div`
  display: grid;
  grid-template-columns: 50% 50%;
  margin: auto;
  margin-top: 5%;
  padding: 2%;
  width: 100%;
  max-width: 80vw;
  max-height: 55vh;
  background-color: #d9d9d9;
  border-radius: 25px;
`;

const DetailContainer = styled.div`
  height: 100vh;
  width: 100vw;
  background-color: #efeeee;
  overflow-y: auto;
`;

const ResContainer = styled.div`
  max-height: inherit;
  max-width: 100vw;
  display: grid;
  grid-template-rows: auto-fit;
  flex-direction: column;
  grid-column: 1;
`;

const RestaurantTitle = styled.h1`
  align-self: center;
  font-size: 3rem;
  grid-row: 1;
  margin: 0%;
`;

const RestaurantStars = styled.div`
  margin-top: auto;
  margin-bottom: auto;
  grid-row: 2;
`;

const Star = styled.img`
  width: 45px;
  height: 45px;
  padding-right: 2%;
`;

const RestaurantDesc = styled.div`
  font-size: 1rem;
  grid-row: 3;
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
  width: 100%;
  max-width: 80vw;
  margin: auto;
`;

const ReviewTitleContainer = styled.div`
  display: grid;
  width: 100%;
  max-width: 80vw;
  margin: auto;
  grid-row: 1;
  grid-template-columns: 75%;
`;

const ReviewsTopTitle = styled.h1`
  padding-top: 2%;
  font-size: 2.5rem;
  grid-column: 1;
  margin-bottom: 1%;
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
  grid-column: 2;
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
