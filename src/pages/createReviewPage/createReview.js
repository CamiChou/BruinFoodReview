import styles from "./styles.css";
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import StarRating from "./StarRating";
import { getDatabase, ref, get, child, set, update } from "firebase/database";
import { useParams } from "react-router-dom";
import { getAuth, onAuthStateChanged } from "firebase/auth";

const dbRef = ref(getDatabase());
onAuthStateChanged;

const CreateReview = ({ pageName }) => {
  const [reviewContent, setReviewContent] = useState("");
  const [stars, setStars] = useState(0);
  const [authenticated, setAuthenticated] = useState(false);
  const [restaurantName, setRestaurantName] = useState("");
  const [isLoadingName, setIsLoadingName] = useState(true);
  const params = useParams();
  const restName = params.name;
  const auth = getAuth();
  const navigate = useNavigate();

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      setAuthenticated(user != null);
    });
  }, []);

  useEffect(() => {
    async function fetchData() {
      let name = await getRestaurantName();
      setRestaurantName(name);
    }
    fetchData();
    setIsLoadingName(false);
  }, []);

  const getRestaurantName = async () => {
    let name = await get(child(dbRef, `restaurants/${restName}/name`)).then(
      (snapshot) => {
        if (snapshot.exists()) {
          return snapshot.val();
        } else {
          console.error(`restaurants/${restName} does not exist`);
        }
        return null;
      }
    );
    return name;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    let metadata = await get(child(dbRef, `reviews/${restName}/metadata`))
      .then((snapshot) => {
        if (snapshot.exists()) {
          return snapshot.val();
        }
        return { nextId: -1, stars: stars };
      })
      .catch((error) => {
        console.error(error.message);
      });

    if (metadata.nextId == -1) {
      metadata.nextId = 0;
      set(child(dbRef, `reviews/${restName}/metadata`), metadata);
    }
    metadata.stars =
      (metadata.stars * metadata.nextId + stars) / (metadata.nextId + 1);
    metadata.nextId += 1;
    const reviewUpdate = {
      [metadata.nextId - 1]: {
        content: reviewContent,
        stars: stars,
        timestamp: Date.now(),
        user: auth.currentUser.displayName,
        upvotes: 0,
      },
      metadata: metadata,
    };

    update(child(dbRef, `reviews/${restName}`), reviewUpdate);
    setStars(-1);
    setReviewContent("");
    navigate(`/${restName}`);
  };

  let submitButton;

  if (authenticated) {
    let reviewComplete = reviewContent.length === 0 || stars < 1;
    submitButton = (
      <div className="submitBtn">
        <input
          disabled={reviewComplete}
          type="submit"
          value="Submit"
          className="btn"
        />
      </div>
    );
  } else {
    submitButton = (
      <div className="submitAuthError">Log In to Submit Review!</div>
    ); 
  }

  return (
    <div id={pageName}>
      <div className="BiggestBox">
        <div className="Back">
          <button className="BackButton" onClick={() => navigate(`/${restName}`)}>??? Go Back</button>
        </div>
        <div className="ReviewContainer">
          <div className="ReviewTitleContainer">
            {isLoadingName ? "Loading Name..." : restaurantName}
          </div>
          <div className="ReviewTextContainer">
            <form
              className="myForm"
              onSubmit={(e) => {
                handleSubmit(e);
              }}
            >
              <StarRating rating={stars} setRating={setStars} />
              <p>Please enter some text below:</p>
              <textarea
                className="reviewContent"
                type="textInput"
                onChange={(event) => setReviewContent(event.target.value)}
                value={reviewContent}
              />
              {submitButton}
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateReview;
