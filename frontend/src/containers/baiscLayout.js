import React from 'react';
import Header from '../components/header';
import Footer from '../components/footer';
import { Outlet } from 'react-router';
import { useContext } from 'react';
import { AccountContext } from '../contexts/accountContext';
import styled from 'styled-components';

const BasicLayout = () => {
    const { isLoggedIn } = useContext(AccountContext);
    return (
        <LayoutContainer>
            <Header />
            <Outlet />
            <Footer />
        </LayoutContainer>
    );
}

const LayoutContainer = styled.div`
    display: grid;
    grid-template-rows: 70px 1fr 50px;
    height: 100vh;
    width: 100vw;
`
    
export default BasicLayout;