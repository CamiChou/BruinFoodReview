//hooks
import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { NavLink, Link } from "react-router-dom";

//firebase imports
import { db, auth, config } from "../firebase";
import { getDatabase, onValue, ref, get, child, orderByKey, orderByChild, equalTo, limitToFirst, onChildAdded, query, runTransaction } from "firebase/database";
import Firebase from "firebase/compat/app"

import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";

//imported components
import Header from './Header.jsx'
import StarRating from './createReviewPage/StarRating.js'
import { useParams } from "react-router-dom";

// note: probably make reviews into a class

const dbRef = ref(getDatabase());

// TODO: MAKE RESTAURANT INTO CLASS
function LoadResTitle() {
  const params = useParams();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState([]);
  const [name, setName] = useState([]);

  get(child(dbRef, `restaurants/${params.name}/name`))
    .then((snapshot) => {
      if (snapshot.exists()) {
        var info = snapshot.val();
        setName(info);
      } else {
        console.log("No data available");
      }
    })
    .catch((error) => {
      console.error(error);
    });

  return <RestaurantTitle>{name}</RestaurantTitle>;
}

function LoadResDesc() {
  const params = useParams();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState([]);
  const [desc, setDesc] = useState([]);

  get(child(dbRef, `restaurants/${params.name}/desc`))
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

async function GrabReviewsNew() {
  const topUserPostsRef = query(ref(db, 'reviews'));

  const reviews = get(child(topUserPostsRef, `/bplate`)).then((snapshot) => {
      if (snapshot.exists()) {
        // lists all reviews and its content
        const name = [];
        const temprev = [];
        snapshot.forEach((child) => {
          const tester = child.val();
          //console.log("content: " + tester.content);
          const temp = {
            content: tester.content,
            name: tester.user
          };
          temprev.push(temp);
          name.push("name: " + tester.user);
         });
         return temprev;
      } else {
        console.log("No data available");
        return ["hi"]
      }
    }).catch((error) => {
      console.error(error);
    });

    let result = await reviews;
    return result;
}

function LoadReviews() {
  const [revData, setRevData] = useState([]);
  const [isLoading, setLoading] = useState(true);


  useEffect(() => {
    async function fetchData() {
      const data = await GrabReviewsNew();
      
      //console.log("this is the data: ");
      data.forEach(rev => {
        //console.log("DATACONTENT: " + rev.content);
      })
      setRevData(data);
      setLoading(false);
    }
    fetchData();
  }, [revData]);

  if(isLoading) {
    return(
      <HoldReviews>
        Loading Reviews...
      </HoldReviews>
    )
  }
  else {
    return(
      <HoldReviews>
        {revData.map((rev, id) => (
        <ReviewBase key = {id}>
          <UserName>{rev.name}</UserName>
          <ReviewContent>{rev.content}</ReviewContent>
        </ReviewBase>
        ))}
      </HoldReviews>
    );
  }
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

function RestaurantDetail() {
  return(
    <DetailContainer>
        <HandleInfo />
          <ReviewContainer>
              <ReviewTitleContainer>
                <ReviewsTopTitle>Reviews</ReviewsTopTitle>
                <CreateReview to="/createrev">
                    <h2>Create Review</h2>
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
  width: 100%;
  max-width: 80vw;
  margin: auto;
  margin-top: 1%;
`;

const ReviewTitleContainer = styled.div`
  display: grid;
  width: 100%;
  max-width: 80vw;
  margin: auto;
  margin-top: 1%;
  grid-row: 1;
`;

const ReviewsTopTitle = styled.h1`
    padding-top: 2%;
    font-size: 2rem;
    grid-column: 1;
`;

const CreateReview = styled(Link)`
  background-color: #3284BF;
  color: #EFEEEE;
  border-radius: 25px;
  height: min-content;
  grid-column: 2;
  margin-top: auto;
  margin-bottom: auto;
  max-width: fit-content;
  justify-self: flex-end;
  padding-right: 2%;
  padding-left: 2%;
  text-decoration: none;
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
  grid-row: 2;
`;

const ReviewContent = styled.div`
  font-size: 1rem;
  grid-row: 3;
`;

export default RestaurantDetail;
