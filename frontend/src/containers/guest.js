import Anatomy from "../components/anatomy"
import styled from "styled-components"
import { useNavigate } from "react-router-dom";
import { AccountContext } from "../contexts/accountContext";
import { useContext } from "react";

const GuestContainer = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    height: 100vh;
    position: relative;
`;
const IntroSection = styled.div`
    text-align: center;
    margin-bottom: 2em;
`;
const AuthButton = styled.button`
    margin: 0.5em;
    padding: 1em 2em;
    font-size: 1.2em;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    transition: transform 0.2s;
    &:hover {
        transform: scale(1.05);
    }
`;

const LoginButton = styled(AuthButton)`
    background-color: #007BFF;
`;

const RegisterButton = styled(AuthButton)`
    background-color: transparent;
    border: 2px solid #007BFF;
    color: #007BFF;
`;

export const Guest = () => {
    const navigate = useNavigate();
    const { isLoggedIn, setIsLoggedIn } = useContext(AccountContext);

    const handleLoginClick = () => {
        navigate('/auth/signin'); 
    }

    const handleRegisterClick = () => {
        navigate('/auth/signup');
    }

    if (isLoggedIn) {
        navigate('/home');
    }
    return (
        <GuestContainer>
            <IntroSection>Welcome to the Guest Page</IntroSection>
            <Anatomy/>
            <div>
                <LoginButton onClick={handleLoginClick}>Login</LoginButton>
                <RegisterButton onClick={handleRegisterClick}>Register</RegisterButton>
            </div>
        </GuestContainer>
    )
}

