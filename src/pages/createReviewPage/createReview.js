import styles from "./styles.css";
import React, { useState } from "react";
import StarRating from './StarRating'


const [textVal] = useState('');

const handleSubmit=(e)=>
{
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

              <form class = "myForm" onSubmit={(e) => {handleSubmit(e)}}>
                <StarRating/>
                <p>Please enter some text below:</p>

                <input id="myReview" class="myReview" value = {textVal} type = 'text' placeholder="Write Review Here" >
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