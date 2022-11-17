import React from "react";
import styled from "styled-components";
import { NavLink } from "react-router-dom";

class Header extends React.Component {
    constructor(props) {
        super(props);
        this.state = {

        }
    }

    render() {
        return(
            <div className="navigation">
            <nav className="navbar navbar-expand navbar-dark bg-dark">
              <div className="container">
                <div>
                  <ul className="navbar-nav ml-auto">
                    <li className="nav-item">
                      <NavLink className="home-button" to="/">
                            <img src = "/BruinYelp.png"
                            style = {{
                            width: "15vw",
                            padding: "2%" 
                            }} />
                        <span className="sr-only"></span>
                      </NavLink>
                    </li>
                    <li className="nav-item">
                      <NavLink className="nav-link" to="/abtres">
                        Resturant Details
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