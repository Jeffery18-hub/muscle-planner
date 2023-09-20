import React, { useContext, useState } from "react";
import { useNavigate } from 'react-router-dom';
import { AccountContext } from '../contexts/accountContext';
import styled from 'styled-components';

const Auth = ({info}) => {
  const navigate = useNavigate();
  const [authMode, setAuthMode] = useState(info);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const { setIsLoggedIn } = useContext(AccountContext);

  const changeAuthMode = () => {
    setAuthMode(authMode === "signin" ? "signup" : "signin");
    navigate("/auth/" + (authMode === "signin"? "signup" : "signin"));
  }

  const handleSubmit = (event) => {
    fetch('http://localhost:3001/auth', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password, name, authMode })
    })
    .then(response => response.json())
    .then(data => {
        console.log(data);
        if (data.success === true && data.message === "Sign up success") {
            alert('Sign up successfully!');
            setIsLoggedIn(true);
            navigate('/home');
        }else if (data.success === false && data.message === "User already exists") {
            alert('User already exists');
        }else if (data.success === true && data.message === "Sign in success") {
            alert('Sign in successfully!');
            setIsLoggedIn(true);
            navigate('/home');
        }else if (data.success === false && data.message === "Incorrect password") {
          alert('Incorrect password');
        }else if (data.success === false && data.message === "User does found") {
          alert('User does not exist');
        }
    })
    .catch(error => {
        console.error('Error:', error);
    });
  }

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  }

  const handleEmailChange = (event) => {
    setEmail(event.target.value);
  }
  
  const handleNameChange = (event) => {
    setName(event.target.value);
  }


  return (
    <AuthPageContainer>
    <AuthFormContainer>
      <AuthForm onSubmit={e => e.preventDefault()}>
        <Title>{authMode === "signin" ? "Sign In" : "Sign Up"}</Title>
        <ChangeAuthModeText>
          {authMode === "signin" ? "Not registered yet?" : "Already registered?"}
          <LinkButton onClick={changeAuthMode}>
            {authMode === "signin" ? "Sign Up" : "Sign In"}
          </LinkButton>
        </ChangeAuthModeText>
        {authMode !== "signin" && (
          <FormGroup>
            <label>Full Name</label>
            <Input 
              type="text" 
              placeholder="e.g Jane Doe"
              onChange={handleNameChange} />
          </FormGroup>
        )}
        <FormGroup>
          <label>Email address</label>
          <Input
            type="email"
            placeholder="Enter email"
            onChange={handleEmailChange}
          />
        </FormGroup>
        <FormGroup>
          <label>Password</label>
          <Input
            type="password"
            placeholder="Enter password"
            onChange={handlePasswordChange}
          />
        </FormGroup>
        <Button onClick={handleSubmit}>
          Submit
        </Button>
        <div style={{ textAlign: 'center', marginTop: '10px' }}>
          Forgot <ForgotPasswordLink href="#">password?</ForgotPasswordLink>
        </div>
      </AuthForm>
    </AuthFormContainer>
    </AuthPageContainer>
  );
};

export default Auth;

const AuthPageContainer = styled.div`
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


const AuthFormContainer = styled.div`
    width: 300px;
    margin: 0 auto;
`;

const AuthForm = styled.form`
    padding: 20px;
    border: 1px solid #ccc;
    border-radius: 5px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
`;

const Title = styled.h3`
    text-align: center;
    margin-bottom: 20px;
`;

const ChangeAuthModeText = styled.div`
    text-align: center;
    margin-bottom: 10px;
`;

const LinkButton = styled.span`
    color: lightblue;
    cursor: pointer;
    &:hover {
        text-decoration: underline;
    }
`;

const FormGroup = styled.div`
    margin-bottom: 15px;
`;

const Input = styled.input`
    width: 100%;
    padding: 10px;
    border: 1px solid #ccc;
    border-radius: 5px;
`;

const Button = styled.button`
    width: 100%;
    padding: 10px;
    background-color: #007bff;
    border: none;
    color: #fff;
    border-radius: 5px;
    cursor: pointer;
    transition: background-color 0.3s;

    &:hover {
        background-color: #0056b3;
    }
`;

const ForgotPasswordLink = styled.a`
    color: lightblue;
    cursor: pointer;
    &:hover {
        text-decoration: underline;
    }
`;