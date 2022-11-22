//hooks
import React, { useState, useEffect } from "react";
import styled from "styled-components";

//firebase imports
import { db, auth, config } from "../firebase";
import { getDatabase, onValue, ref, get, child, orderByKey, orderByChild, equalTo, limitToFirst, onChildAdded, query } from "firebase/database";
import Firebase from "firebase/compat/app"
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";

//imported components
import Header from "./Header.jsx";
import StarRating from "./createReviewPage/StarRating.js";
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

function RenderNew() {
  const help = GrabReviewsNew();
  console.log("WHATTTT2222  " + JSON.stringify(help), help.length)
  return(
    <ReviewBase>HELLOOO{  console.log("WHATTTT2222  " + JSON.stringify(help), help.length)
  }</ReviewBase>
  );
}

function GrabReviewsNew() {
  const topUserPostsRef = query(ref(db, 'reviews'));
  console.log(topUserPostsRef);

  const temprev = [];
  const name = [];

  get(child(topUserPostsRef, `/bplate`)).then((snapshot) => {
      if (snapshot.exists()) {
        console.log('HIIII' + snapshot.val());
        var info = snapshot.val();

        // lists all reviews and its content
        snapshot.forEach((child) => {
          const tester = child.val();
          console.log(tester.content);
          const temp = {
            content: tester.content,
            name: tester.user
          };
          temprev.push(temp);
          name.push(tester.user);
         });
         console.log("WHAT" + JSON.stringify(temprev), temprev.length)
        return(

          <ReviewBase>hiii
          <div>HIII!!!!!!!{temprev[0].content}</div>
          </ReviewBase>
        );
      } else {
        console.log("No data available");
      }
    }).catch((error) => {
      console.error(error);
    });

    console.log("TEMPREVVV " + temprev[0]);
    return name;
}

class Reviews extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            reviews: Array().fill(null)
        }
    }

    /*
    SetReviews() {
      const hi = this.GrabReviews();
      this.state = {
        reviews: hi
      }
      console.log("BARKKKKKKbaejsgdkjdgj" + this.state.reviews[0]);
    }

    RenderReviews(name) {
      const rev = this.state.reviews[0];
      console.log("MOEWEWOWJEW" + rev);
      const meow = name;
        return(
            <ReviewBase>
              {rev}
            </ReviewBase>
        );
    }
    */

    render() {
        return(
            <ReviewContainer>
                <ReviewsTopTitle>Reviews</ReviewsTopTitle>
                <HoldReviews>
                </HoldReviews>
            </ReviewContainer>
        );
    }  
}

function HandleInfo(props) {
  const [resName, setResName] = useState([]);
  const [resDesc, setResDesc] = useState([]);

  return (
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
                <ReviewContainer>
                <GrabReviewsNew />
                <ReviewBase>HIII</ReviewBase>
                </ReviewContainer>
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
  max-height: 100vh;
  max-width: 100vw;
  display: grid;
  grid-template-rows: auto-fit;
  flex-direction: column;
  grid-column: 1;
`;

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
`;

const ReviewBase = styled.div`
  width: 100%;
  max-width: 80vw;
  display: flex;
  background-color: #d9d9d9;
  border-radius: 25px;
  overflow-y: auto;
`;

export default RestaurantDetail;
