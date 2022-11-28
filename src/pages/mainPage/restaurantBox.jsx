import React, { useState,useEffect } from 'react';
import mainPage from "./mainPage.css";

import {db} from "../../firebase.js";
import { getDatabase, ref, get, child, onValue } from "firebase/database";
import { render } from '@testing-library/react';

const dbRef=ref(getDatabase(), `restaurants/`)

function loadName() {
  let info=[]

  onValue(dbRef, (snapshot)=>{
    snapshot.forEach((childSnapshot)=>{
      const childData=childSnapshot.val();
      const childKey=childSnapshot.key;
      info.push({Name:childData.name, Type:childData.type, Loc:childData.location})
    });
  }, {
    onlyOnce:true
  })
   console.log("LOADING")
   return info;
   
}


/*
function LoadRestaurant(props){
  const [resName,setResName]=useState([]);
  
  const [resCuisine,setResCuisine]=useState([]);
  const [resType,setResType]=useState([]);
  const [resLoc,setResLoc]=useState([])
  

  return (

        <>
        <LoadName />
        </>
  );

}
*/

function RestaurantBox() {
    
    const info=loadName();
    console.log("INFO VVVV")
    console.log(info[0]);
    return(
      <div className="Box">
        <div className="Tile">
          
        {info.map((resturant, id) => {console.log("HEY")})}
        </div>
      </div>
    )


  }
   
  export default RestaurantBox;