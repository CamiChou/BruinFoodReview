import React from "react";
import styled from "styled-components";

class Header extends React.Component {
    constructor(props) {
        super(props);
        this.state = {

        }
    }

    render() {
        return(
            <HeaderContainer>
                <img src = "/BruinYelp.png"
                style = {{
                    width: "15vw",
                    padding: "2%" 
                }} />
            </HeaderContainer>
            );
    }
}

const HeaderContainer = styled.div`
  display: flex;
  flex-direction: column;
  overflow-y: auto;
  width: 100%;
  background-color: white;
`;

export default Header;