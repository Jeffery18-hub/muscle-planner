// 

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { AccountContext } from '../contexts/accountContext';
import { useContext } from 'react';
import styled from 'styled-components';

const LandingContainer = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    height: 100vh;
    position: relative;
    color: #fff;  
    background-color: rgba(0, 0, 0, 0.3);  /* Black overlay with 50% opacity */

    /* Background Image */
    &::before {
    content: '';
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    background: url('${process.env.PUBLIC_URL}/icons/landing_background.jpg') no-repeat center center;
    background-size: cover;
    z-index: -1;
    }
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

const LandingPage = () => {
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
        <LandingContainer>
            <IntroSection>
                <h1>Welcome to Muscle Planner</h1>
                <p>Your perfect companion for planning your workouts and tracking your fitness journey.</p>
            </IntroSection>
            <div>
                <LoginButton onClick={handleLoginClick}>Login</LoginButton>
                <RegisterButton onClick={handleRegisterClick}>Create Account</RegisterButton>
            </div>
        </LandingContainer>
    )
}

export default LandingPage;
