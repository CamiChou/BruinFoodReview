import React from "react";
import styled from "styled-components";
import { NavLink } from "react-router-dom";

class Header extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
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
            </div>
          </div>
        </nav>
      </div>
    );
  }
}

export default Header;
