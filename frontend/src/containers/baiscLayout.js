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
    display: flex;
    flex-direction: column;
    width: 100%; /* avoid scrollbars horizontally */
    min-height: 100vh; /* take up full viewport height */
    box-sizing: border-box;
`
    
export default BasicLayout;