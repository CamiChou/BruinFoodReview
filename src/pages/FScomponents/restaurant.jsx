import React from "react";
import { Button, Card } from "react-bootstrap";
import { db } from "../../firebase.js";
import { ref, get, child, set } from "firebase/database";

const dbRef = ref(db);

export default class Restaurant extends React.Component {
  constructor() {
    super();

    this.saveRestaurant = this.saveRestaurant.bind(this);
  }

  saveRestaurant(e) {
    const { restaurant } = this.props;
    set(child(dbRef, `/abtres/${restaurant.id}`), {
      ...restaurant,
    });
  }

  render() {
    const { restaurant } = this.props;

    return (
      <Card>
        <Card.Img
          variant="top"
          src={restaurant.image_url}
          alt={restaurant.name}
        />
        <Card.Body>
          <Card.Title>{restaurant.name}</Card.Title>
          {!this.props.saved && (
            <Button variant="primary" onClick={this.saveRestaurant}>
              Save Restaurant
            </Button>
          )}
        </Card.Body>
      </Card>
    );
  }
}
