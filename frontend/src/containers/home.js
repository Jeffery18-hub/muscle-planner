import React from 'react';
import {useState } from 'react';
import styled from 'styled-components';
import Anatomy from '../components/anatomy';
import Plan from '../components/plan';


const HomeContainer = styled.div`
    display: flex;
    flex-direction: row;
    align-items: stretch;
    width: 100%;
`


const Home = () => {
    const [clickedMuscle, setClickedMuscle] = useState(null);
    const [clickCount, setClickCount] = useState(0);

    // add new muscle to clickedMuscles
    const handleMuscleClick = (muscleName) => {
        setClickedMuscle(muscleName);
        setClickCount(prevCount => prevCount + 1);
    }

    return(
        <HomeContainer>
            <div style={{ width: '50%'}}>
                <Anatomy onMuscleClicked={handleMuscleClick}/>
            </div>
            <div style={{ width: '50%'}}>
                <Plan muscle={clickedMuscle} clickCount={clickCount}/>
            </div>
        </HomeContainer>
    )
}

export default Home;
