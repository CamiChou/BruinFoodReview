import React from 'react'
import { Button, Card } from 'react-bootstrap'
import db from './database.js'

import '<div className=""></div>/App.css'

export default class Restaurant extends React.Component {
 constructor() {
   super();

   this.saveRestaurant = this.saveRestaurant.bind(this)
 }

 saveRestaurant(e) {
   const { restaurant } = this.props

   db.ref(`/abtres/${restaurant.id}`).set({
     ...restaurant

    
   })
 }

 render() {
   const { restaurant } = this.props

   return (
     <Card>
       <Card.Img variant="top" src={restaurant.image_url} 
        alt={restaurant.name} />
       <Card.Body>
         <Card.Title>{restaurant.name}</Card.Title>
         {!this.props.saved && <Button variant="primary" 
         onClick={this.saveRestaurant}>Save Restaurant</Button>}
      </Card.Body>
     </Card>
   )
 }
}
