import React from "react";
import styled from "styled-components";

import './index.css';
import Header from './Header.js'
import StarRating from './pages/createReviewPage/StarRating.js'

// note: probably make reviews into a class

function RenderReview(props) {
    return(
        <HoldReviews>
            <ReviewBase>
            teststsetests
            </ReviewBase>
        </HoldReviews>
    );
}

function HandleInfo(props) {
    return(
        <InfoContainer>
            <ResContainer>
                <RestaurantTitle>hiii</RestaurantTitle>
                <RestaurantStars>
                    <StarRating />
                </RestaurantStars>
                <RestaurantDesc>DETAILDETAIL</RestaurantDesc>
            </ResContainer>
            <RestaurantPhoto src = "/BruinYelp.png"/>
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
                <Header />
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
