import React from 'react';
import {useState } from 'react';
import styled from 'styled-components';
import Anatomy from '../components/anatomy';
import Video from '../components/video';


const YoutubeContainer = styled.div`
    display: flex;
    flex-direction: row;
    align-items: stretch;
    width: 100vw;
`


const Youtube = () => {
    const [clickedMuscle, setClickedMuscle] = useState(null);

    // add new muscle to clickedMuscles
    const handleMuscleClick = (muscleName) => {
        setClickedMuscle(muscleName);
    }

    return(
        <YoutubeContainer>
            <div style={{ border: '1px solid black', width: '50%'}}>
                <Anatomy onMuscleClicked={handleMuscleClick}/>
            </div>
            <div style={{ border: '1px solid black', width: '50%'}}>
                <Video muscle={clickedMuscle}/>
            </div>
        </YoutubeContainer>
    )
}

export default Youtube;
