import React from 'react'
import { db, auth, config } from "firebase";
import {Tabs,Tab} from 'react-bootstrap'
import Search from './search'
import Restaurant from './restaurant'

export default class Finder extends React.Component {
 constructor() {
    super()
    this.state={
        restaurants:[]
    }

    this.getRestaurants=this.getRestaurants.bind(this)
 
 }

 componentDidMount(){
    this.getRestaurants()
 }

 getRestaurants(){
    db.ref('/abtres').on('value',(snapshot)=>{
        const restaurants=[]
        const data=snapshot.val()
        for(let restaurant in data){
            restaurants.push(data[restaurant])
        }
        this.setState({
            restaurants:restaurants
        })
    })
 }

 render() {
  
    const { restaurants } = this.state
    return (
      <>
        <h1>Let's find some restaurants!</h1>
 
        <Tabs defaultActiveKey="search" id="restaurantsearch">
          <Tab eventKey="search" title="Search!">
            <Search handleSearchResults={this.handleSearchResults} 
         />
          </Tab>
          <Tab eventKey="saved" title="Saved!">
            <div className="card-columns">
              {
                restaurants.length > 0 ? (
                  restaurants.map((restaurant, i) => (
                    <Restaurant restaurant={restaurant} saved={true} 
                     key={i} />
                  ))
                ) : <p>No saved restaurants</p>
              }
            </div>
          </Tab>
        </Tabs>
      </>
    )
  }
}