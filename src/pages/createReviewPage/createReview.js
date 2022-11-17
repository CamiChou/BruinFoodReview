import styles from "./styles.css";
import React, { useState } from "react";
import StarRating from './StarRating'


// //firebase imports
import firebase from 'firebase/app';
import { getDatabase, onValue, ref, get, child, set, initializeApp } from "firebase/database";
import Firebase from "firebase/compat/app"

const dbRef = ref(getDatabase());

import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";



function writeUserData(starAmt, restName, revContent, perName, currTime) {
  const db = getDatabase();
  const dbRef = ref(getDatabase());

  db.setValue("hello");

  set(ref(db, 'reviews/Bplate'), {
    stars: '5',
    user: "Mia",
  });
}





const handleSubmit=(e)=>
{
  writeUserData(5, "Bplate", "pie is good", "Cami", Date.now());
  alert('A review was submitted');
}

const CreateReview = ({pageName}) => {
    return (
      <div id = {pageName}>
        <div className = "BiggestBox">
          <div className="ReviewContainer">
            <div className="ReviewTitleContainer">
              NAME OF RESTAURANT
            </div>

            <div className= "ReviewTextContainer">

              <form className = "myForm" onSubmit={(e) => {handleSubmit(e)}}>
                <StarRating/>
                <p>Please enter some text below:</p>

                <input id="myReview" class="myReview" type = 'text' placeholder="Write Review Here" >
                </input>
                <div className="submitBtn">
                  <input type="submit" value="Submit" className = "btn" />
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    );

  };
    
export default CreateReview;