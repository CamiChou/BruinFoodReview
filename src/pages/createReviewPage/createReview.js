import styles from "./styles.css";
import React, { useState } from "react";
import StarRating from './StarRating'



const CreateReview = ({pageName}) => {
    return (
      <div id = {pageName}>

        <div className="ReviewContainer">

          <div className="ReviewTitleContainer">
          <h1>
            NAME OF RESTAURANT
          </h1>

          </div>


          <div className= "StarsTextContainer">
            <div className= "StarsContainer">
              <StarRating/>
            </div>
            
            <div className= "ReviewTextContainer">

              <form action="/url" method="GET">
                <p>Please enter some text below:</p>

                <input id="myReview" class="myReview" type = 'text' placeholder="Write Review Here" >
                

                </input>
                



              </form>





        
              
            </div>

          </div>

          <div className= "PostButtonContainer">
            <button>
              Submit
            </button>

            
            

          </div>

        </div>






      </div>



      // <div>
      //   <h1>
      //     IT IS WORKING
      //   </h1>
      // </div>
    );
  };
    
export default CreateReview;