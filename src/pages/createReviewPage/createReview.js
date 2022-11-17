import styles from "./styles.css";
import React, { useState } from "react";
import StarRating from "./StarRating";
import { getDatabase, ref, get, child, set } from "firebase/database";

const dbRef = ref(getDatabase());

const CreateReview = ({ pageName }) => {
  const [reviewContent, setReviewContent] = useState("");
  const handleSubmit = (event) => {
    event.preventDefault();
    let next_id = -1;

    // TODO: clean up code
    get(child(dbRef, `reviews/bplate`))
      .then((snapshot) => {
        if (snapshot.exists()) {
          console.log("Submit!");
          const reviews = snapshot.val();
          next_id = reviews.metadata.next_id;
          set(child(dbRef, `reviews/bplate/${next_id}`), {
            // TODO: add correct stars, upvotes, and user
            content: reviewContent,
            stars: 5,
            timestamp: Date.now(),
            upvotes: 3,
            user: "grant",
          });
          set(child(dbRef, `reviews/bplate/metadata/next_id`), next_id + 1);
          setReviewContent("");
        } else {
          console.error(`Data does not exist reviews/bplate/${next_id}`);
        }
      })
      .catch((error) => {
        console.error(error);
      });
  };
  return (
    <div id={pageName}>
      <div className="BiggestBox">
        <div className="ReviewContainer">
          <div className="ReviewTitleContainer">NAME OF RESTAURANT</div>

          <div className="ReviewTextContainer">
            <form
              className="myForm"
              onSubmit={(e) => {
                handleSubmit(e);
              }}
            >
              <StarRating />
              <p>Please enter some text below:</p>

              <input
                className="reviewContent"
                type="text"
                onChange={(event) => setReviewContent(event.target.value)}
                value={reviewContent}
              />
              <div className="submitBtn">
                <input type="submit" value="Submit" className="btn" />
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateReview;
