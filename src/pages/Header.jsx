import React from "react";
import styled from "styled-components";
import { NavLink } from "react-router-dom";
import { db, auth } from "../firebase";

import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { getValueArrayWithinLimits } from "@appbaseio/reactivesearch/lib/utils";
class Header extends React.Component {
  constructor(props) {
    super(props);
    this.state = { username: null, password: 10 };
  }

  handleUsernameChange(event) {
    this.setState((prevState) => ({
      ...prevState,
      username: event.target.value,
    }));
  }

  handlePasswordChange(event) {
    this.setState((prevState) => ({
      ...prevState,
      password: event.target.value,
    }));
  }
  handleLogin(event) {
    signInWithEmailAndPassword(
      auth,
      this.state.username,
      this.state.password
    ).catch((error) => {
      if(error.code == "auth/invalid-email"){
        console.log("Invalid authentication! D:");
      }
    });
    const user = auth.currentUser;
    console.log(user);
  }
  handleLogout(event) {
    auth.signOut();
  }

  render() {
    const resturants = [
      {
        path: "/abtres/deneve",
        label: "De Neve",
      },
      {
        path: "/abtres/epic",
        label: "Epicuria",
      },
      {
        path: "/abtres/bplate",
        label: "Bruin Plate",
      },
    ];
    return (
      <div className="navigation">
        <nav className="navbar navbar-expand navbar-dark bg-dark">
          <div className="container">
            <div>
              <NavLink className="home-button" to="/">
                <img
                  src="/BruinYelp.png"
                  style={{
                    width: "15vw",
                    padding: "2%",
                  }}
                />
                <span className="sr-only"></span>
              </NavLink>
              <ul className="navbar-nav ml-auto">
                {resturants.map((resturant, id) => (
                  <li key={id} className="nav-item">
                    <NavLink className="nav-link" to={resturant.path}>
                      {resturant.label}
                    </NavLink>
                  </li>
                ))}
                <li className="nav-item">
                  <NavLink className="nav-link" to="/foodfilter">
                    Food Search
                  </NavLink>
                </li>
                <li className="nav-item">
                  <NavLink className="nav-link" to="/createrev">
                    Write Review
                  </NavLink>
                </li>
              </ul>
              <input
                className="usernameInput"
                type="text"
                onChange={this.handleUsernameChange.bind(this)}
              />
              <input
                className="passwordInput"
                type="text"
                onChange={this.handlePasswordChange.bind(this)}
              />
              <button type="button" onClick={this.handleLogin.bind(this)}>
                Log in
              </button>
              <button type="button" onClick={this.handleLogout.bind(this)}>
                Log Out
              </button>
            </div>
          </div>
        </nav>
      </div>
    );
  }
}

export default Header;
