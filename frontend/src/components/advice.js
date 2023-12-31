import React, { useEffect, useState } from "react";
import styled from "styled-components";
import axios from "axios";

const Advice = ({ prompt }) => {
  
  
  // propmt is object, convert to string
  const propmtString = "This is my training data on my muscles:" + prompt.map((item) => {
    return `Date: ${item.date} Muscle: ${item.muscle} Exercise: ${item.exercise} 
      Sets: ${item.sets} Reps: ${item.repetitions} Weight: ${item.maximum} lbs.`
  }) + " Give me some advice and guidance for future training and I hope to have stronger muscles."

  
  // send prompt to open ai api
  const [advice, setAdvice] = useState(null);


  useEffect(() => {
    const getAdvice = async () => {
      if(prompt){
        const response = await axios.get(`http://localhost:5001/gpt?prompt=${propmtString}`);
        setAdvice(response.data);
    }
    };
    getAdvice();
  }, [propmtString]);

  // TODO: a bug here: the advice shows up with a latency on the page
  return (
    <AdviceContainer>
      <h2>Some advice</h2>
      <div className="content">
        {advice && advice.content}
      </div>
    </AdviceContainer>
  );
}


// TODO:hard code here max-height:200px
const AdviceContainer = styled.div`
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



export default Advice;
