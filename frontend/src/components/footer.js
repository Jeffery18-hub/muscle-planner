import React from "react";
import styled from "styled-components";

const Footer = () => {
    return (
        <StyledFooter>
            <p>copy right@2023</p>
        </StyledFooter>
    );
}

const StyledFooter = styled.footer`
    flex: 0.5;
    background-color: white;
    color: black;
    padding: 20px 0;
    text-align: center;
    font-size: 0.8rem;
`

export default Footer;