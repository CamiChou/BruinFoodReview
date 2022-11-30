import React from "react";
import styled from "styled-components";
import { NavLink } from "react-router-dom";
import { db } from "../firebase";
import { ref, set, child } from "firebase/database";

import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";
import { getValueArrayWithinLimits } from "@appbaseio/reactivesearch/lib/utils";

const dbRef = ref(db);

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

    this.provider = new GoogleAuthProvider();
    this.provider.setCustomParameters({
      prompt: "select_account",
    });
  }

  componentDidMount() {
    onAuthStateChanged(this.auth, (user) => {
      this.setState((prevState) => ({
        ...prevState,
        authenticated: user != null,
        user: user,
      }));
    });
  }

  handleLogin(event) {
    this.setState((prevState) => ({
      ...prevState,
      auth_error: false,
    }));
    signInWithPopup(this.auth, this.provider)
      .then((result) => {
        const user = result.user;
      })
      .catch((error) => {
        console.error(error.message);
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
        path: "/deneve",
        label: "De Neve",
      },
      {
        path: "/epic",
        label: "Epicuria",
      },
      {
        path: "/bplate",
        label: "Bruin Plate",
      },
    ];
    let auth_input;
    if (this.state.authenticated) {
      auth_input = (
        <>
          <LoggedIn>
            <h2
              style={{
                gridColumn: "1",
                justifySelf: "flex-end",
                paddingRight: "2%",
              }}
            >
              Welcome {this.state.user.displayName}
            </h2>
            <SignOut onClick={this.handleLogout.bind(this)}>
              <h1>Log Out</h1>
            </SignOut>
          </LoggedIn>
        </>
      );
    } else {
      auth_input = (
        <>
          <SignIn onClick={this.handleLogin.bind(this)}>
            <h1>Log in/Sign Up</h1>
          </SignIn>
          {this.state.auth_error ? <p>"Issue Logging In!"</p> : ""}
        </>
      );
    }
    return (
      <div className="navigation">
        <nav className="navbar navbar-expand navbar-dark bg-dark">
          <div className="container">
            <div>
              <HoldHeader>
                <NavLink
                  style={{ gridColumn: "1" }}
                  className="home-button"
                  to="/"
                >
                  <img
                    src="/BruinYelp.png"
                    style={{
                      width: "15vw",
                      padding: "2%",
                    }}
                  />
                </NavLink>
                <HoldButton>{auth_input}</HoldButton>
              </HoldHeader>
              {/*
              <ul className="navbar-nav ml-auto">
                {resturants.map((resturant, id) => (
                  <li key={id} className="nav-item">
                    <NavLink className="nav-link" to={resturant.path}>
                      {resturant.label}
                    </NavLink>
                  </li>
                ))}

                <li className="nav-item">
                  <NavLink className="nav-link" to="/main-page">
                    Resturants
                  </NavLink>
                </li>
              </ul> */}
            </div>
          </div>
        </nav>
      </div>
    );
  }
}

const SignIn = styled.button`
  background-color: #3284bf;
  color: #efeeee;
  border-radius: 25px;
  height: min-content;
  position: relative;
  align-self: flex-end;
  margin-top: auto;
  margin-bottom: auto;
  margin-right: 5%;
  padding-right: 2%;
  padding-left: 2%;
`;

const SignOut = styled.button`
  background-color: #3284bf;
  color: #efeeee;
  border-radius: 25px;
  height: min-content;
  grid-column: 2;
`;

const HoldHeader = styled.div`
  display: grid;
  grid-template-columns: 50% 50%;
`;

const HoldButton = styled.div`
  grid-column: 2;
  display: flex;
  flex-direction: column;
`;

const LoggedIn = styled.div`
  display: grid;
  grid-template-columns: 80% 20%;
  flex-direction: row;
  position: relative;
  margin-top: auto;
  margin-bottom: auto;
  margin-right: 5%;
  padding-right: 2%;
  padding-left: 2%;
`;

export default Header;
