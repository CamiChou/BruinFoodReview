import styles from "./styles.css";
import React, { useState } from "react";
import StarRating from "./StarRating";
import { getDatabase, ref, get, child, set, update } from "firebase/database";
import { useParams } from "react-router-dom";
import { getAuth } from "firebase/auth";

const dbRef = ref(getDatabase());

const CreateReview = ({ pageName }) => {
  const [reviewContent, setReviewContent] = useState("");
  const [stars, setStars] = useState(0);
  const params = useParams();
  const auth = getAuth();

  const handleSubmit = async (event) => {
    event.preventDefault();
    let next_id = await get(
      child(dbRef, `reviews/${params.name}/metadata/next_id`)
    )
      .then((snapshot) => {
        if (snapshot.exists()) {
          
          const reviews = snapshot.val();
          console.log(reviews)
          next_id = reviews.metadata.next_id;

          set(child(dbRef, `reviews/bplate/${next_id}`), {
            // TODO: upvotes, and user
            content: reviewContent,
            stars: stars,
            timestamp: Date.now(),
            // upvotes: 3,
            user: "cami",
          });
          set(child(dbRef, `reviews/bplate/metadata/next_id`), next_id + 1);
          setStars(0);
          setReviewContent("");
          // alert(stars)
          alert("review submitted!")
        } else {
          console.error(`Data does not exist reviews/bplate/${next_id}`);
        }
        return -1;
      })
      .catch((error) => {
        console.error(error.message);
      });

    if (next_id >= 0) {
      const review_update = {
        [next_id]: {
          content: reviewContent,
          stars: stars,
          timestamp: Date.now(),
          user: auth.currentUser.displayName,
          upvotes: 0,
        },
        metadata: {
          next_id: next_id + 1,
        },
      };

      update(child(dbRef, `reviews/${params.name}`), review_update);
    } else {
      console.error("Error submitting review");
    }
    setStars(-1);
    setReviewContent("");
  };

  let submit_button;

  if (auth.currentUser != null) {

    let review_complete = reviewContent.length === 0 || stars < 1;
    submit_button = (
      <div className="submitBtn">
        <input disabled={review_complete} type="submit" value="Submit" className="btn" />
      </div>
    );
  } else {
    submit_button = (
      <div className="submitAuthError">Log In to Submit Review!</div>
    ); // TODO: auth should auto update button(?)
  }

  return (
    <div id={pageName}>
      <div className="BiggestBox">
        <div className="ReviewContainer">
          <div className="ReviewTitleContainer">{params.name}</div>
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
              {submit_button}
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateReview;
