import React from "react";
import styled from "styled-components";

import './index.css';
import Header from './Header.js'

function Review(props) {
    return(
    <div>testtttt</div>
    );
}

function HandleInfo(props) {
    return(
        <InfoContainer>
            <RestaurantTitle>hiii</RestaurantTitle>
            <RestaurantDesc>DETAILDETAIL</RestaurantDesc>
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
                <Header />
                <HandleInfo />
            </DetailContainer>
            // then render reviews by calling a function
            );
    }

}

const InfoContainer = styled.div`
  display: flex;
  flex-direction: column;
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
`
const RestaurantTitle = styled.h1`
    padding: 2%;
    font-size: 2rem;
`;

const RestaurantDesc = styled.div`
    padding: 2%;
    font-size: 1rem;
`;

export default RestaurantDetail;
