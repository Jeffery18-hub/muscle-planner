import React, { useEffect, useState } from "react";
import styled from "styled-components";
import axios from "axios";

const Conclusion = ({ prompt }) => {

  // propmt is object, convert to string
  const propmtString = "This is my training data of this month:" + prompt.map((item) => {
    return `Date: ${item.date} Muscle: ${item.muscle} Exercise: ${item.exercise} 
      Sets: ${item.sets} Reps: ${item.repetitions} Weight: ${item.maximum} lbs.`
  }) + " Give me a brief summary of my training."
  
  // send prompt to open ai api
  const [conclusion, setConclusion] = useState(null);


  useEffect(() => {
    const getConclusion = async () => {
        if(prompt) {
            const response = await axios.get(`http://localhost:5001/gpt?prompt=${propmtString}`);
            setConclusion(response.data);
        }
    };
    getConclusion();
  }, [propmtString]);

  // TODO: a bug here: the advice shows up with a latency on the page
  return (
    <ConclusionContainer>
      <h2>Monthly Conclusion</h2>
      <div className="content">
        {conclusion && conclusion.content}
      </div>
    </ConclusionContainer>
  );
}


// TODO:hard code here max-height:200px
const ConclusionContainer = styled.div`
  cursor: pointer;
  .content {
    max-height: 200px; 
    overflow-y: auto;
  }

  h2 {
    margin-bottom: 10px;
    font-size: 2rem;
    text-align: center;
  }

`;



export default Conclusion;
