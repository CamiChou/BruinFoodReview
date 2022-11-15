//hooks
import React, { useState, useEffect } from "react";
import styled from "styled-components";

//firebase imports
import { db, auth, config } from "../firebase";
import { getDatabase, onValue, ref, get, child } from "firebase/database";
import Firebase from "firebase/compat/app"
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";

//imported components
import Header from './Header.jsx'
import StarRating from './createReviewPage/StarRating.js'

// note: probably make reviews into a class

const dbRef = ref(getDatabase());

// TODO: MAKE RESTAURANT INTO CLASS
function LoadResTitle()
{
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState([]);
    const [name, setName] = useState([]);

    get(child(dbRef, `restaurants/bplate/name`)).then((snapshot) => {
        if (snapshot.exists()) {
          console.log(snapshot.val());
          var info = snapshot.val();
          setName(info);
        } else {
          console.log("No data available");
        }
      }).catch((error) => {
        console.error(error);
      });

    return(
        <RestaurantTitle>{name}</RestaurantTitle>
    )
}

function LoadResDesc()
{
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState([]);
    const [desc, setDesc] = useState([]);

    get(child(dbRef, `restaurants/bplate/desc`)).then((snapshot) => {
        if (snapshot.exists()) {
          console.log(snapshot.val());
          var info = snapshot.val();
          setDesc(info);
        } else {
          console.log("No data available");
        }
      }).catch((error) => {
        console.error(error);
      });

    return(
        <RestaurantDesc>{desc}</RestaurantDesc>
    )
}

function RenderReview(props) {
    return(
        <HoldReviews>
            <ReviewBase>
            teststsetests
            </ReviewBase>q
        </HoldReviews>
    );
}

function HandleInfo(props) {
    const [resName, setResName] = useState([]);
    const [resDesc, setResDesc] = useState([]);

    return(
        <InfoContainer>
            <ResContainer>
                <LoadResTitle />
                <RestaurantStars>
                    <StarRating />
                </RestaurantStars>
                <LoadResDesc />
            </ResContainer>
            <RestaurantPhoto src="/BruinYelp.png" />
        </InfoContainer>
    );
}

function HandleReview(props) {
    return(
        <ReviewContainer>
            <ReviewsTopTitle>Reviews</ReviewsTopTitle>
            <RenderReview />
        </ReviewContainer>
    )
}

class RestaurantDetail extends React.Component {
    constructor(props) {
        super(props);
        this.state = {

        }
    }

    render() {
        return(
            <DetailContainer>
                <HandleInfo />
                <HandleReview />
            </DetailContainer>
            // then render reviews by calling a function
            );
    }

}

const InfoContainer = styled.div`
  display: grid;
  grid-template-columns: 50% 50%;
  margin: auto;
  margin-top: 5%;
  padding: 2%;
  overflow-y: auto;
  width: 100%;
  max-width: 80vw;
  background-color: #D9D9D9;
  border-radius: 25px;
`;

const DetailContainer = styled.div`
    height: 100vh;
    width: 100vw;
    background-color: #EFEEEE;
    overflow-y: auto;
`

const ResContainer = styled.div`
    max-height: 100vh;
    max-width: 100vw;
    display: grid;
    grid-template-rows: auto-fit;
    flex-direction: column;
    grid-column: 1;
`

const RestaurantTitle = styled.h1`
    align-self: center;
    font-size: 2rem;
    grid-row: 1;
`;

const RestaurantStars = styled.div`
    grid-row: 2;
`;

const RestaurantDesc = styled.div`
    font-size: 1rem;
    grid-row: 3;
`;

const RestaurantPhoto = styled.img`
    width: 20vw;
    grid-column: 2;
    justify-self: right;
    padding: 5%;
`;

const ReviewContainer = styled.div`
  display: grid;
  overflow-y: auto;
  width: 100%;
  max-width: 80vw;
  margin: auto;
`;

const ReviewsTopTitle = styled.h1`
    padding-top: 2%;
    font-size: 2rem;
    grid-row: 1;
`;

const HoldReviews = styled.div`
    max-height: 100vh;
    max-width: 100vw;
    padding-bottom: 2%;
    display: flex;
    grid-row: 2;
`

const ReviewBase = styled.div`
    width: 100%;
    max-width: 80vw;
    display: flex;
    background-color: #D9D9D9;
    border-radius: 25px;
    overflow-y: auto;
`

export default RestaurantDetail;
