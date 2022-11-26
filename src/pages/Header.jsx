import React from "react";
import styled from "styled-components";
import { NavLink } from "react-router-dom";
import { db } from "../firebase";

import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
} from "firebase/auth";
import { getValueArrayWithinLimits } from "@appbaseio/reactivesearch/lib/utils";

import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { getValueArrayWithinLimits } from "@appbaseio/reactivesearch/lib/utils";
class Header extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      username: null,
      password: 10,
      authenticated: false,
      auth_error: false,
      user: null,
    };

    this.auth = getAuth();
    onAuthStateChanged(this.auth, (user) => {
      this.setState((prevState) => ({
        ...prevState,
        authenticated: user != null,
        user: user,
      }));
    });
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
    this.setState((prevState) => ({
      ...prevState,
      auth_error: false,
    }));
    signInWithEmailAndPassword(
      this.auth,
      this.state.username,
      this.state.password
    ).catch((error) => {
      this.setState((prevState) => ({
        ...prevState,
        auth_error: true,
      }));
    });
  }

  handleLogout(event) {
    this.auth.signOut();
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
    let auth_input;
    if (this.state.authenticated) {
      auth_input = (
        <>
          <p> {this.state.user.email} logged in </p>
          <button type="button" onClick={this.handleLogout.bind(this)}>
            Log Out
          </button>
        </>
      );
    } else {
      auth_input = (
        <>
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
          <p> {this.state.auth_error ? "Issue Logging In!" : ""}</p>
        </>
      );
    }
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
              {auth_input}
            </div>
          </div>
        </nav>
      </div>
    );
  }
}

export default Header;
