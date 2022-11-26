
import styles from "./styles.css";
import React, { useState } from "react";
import StarRating from "./StarRating";
import { getDatabase, ref, get, child, set } from "firebase/database";

const dbRef = ref(getDatabase());

const CreateReview = ({ pageName }) => {
  const [reviewContent, setReviewContent] = useState("");
  const [stars, setStars] = useState(0);
  const handleSubmit = (event) => {
    event.preventDefault();
    let next_id = -1;

    get(child(dbRef, `reviews/bplate`))
      .then((snapshot) => {
        if (snapshot.exists()) {
          
          const reviews = snapshot.val();
          console.log(reviews)
          next_id = reviews.metadata.next_id;
         // console.log(StarRating.rating);

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
          alert(stars)
          alert("review submitted!")
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
            <div className= "ReviewTextContainer">
              <form className = "myForm" onSubmit={(e) => {handleSubmit(e)}}>
                <StarRating rating={stars} setRating={setStars}/>
                <p>Please enter some text below:</p>
                  <textarea
                    className="reviewContent"
                    type="textInput"
                    onChange={(event) => setReviewContent(event.target.value)}
                    value={reviewContent}
                    size
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
