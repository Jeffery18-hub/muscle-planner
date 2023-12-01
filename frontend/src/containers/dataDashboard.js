import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import LineChart from '../components/lineChart';
import Calendar from '../components/calendar';
import Advice from '../components/advice';
import axios from 'axios';
import { MuscleExercisesMap, MuscleGroupsMap } from '../muscleDictionary';
import Conclusion from '../components/conclusion';
import PieChart from '../components/pieChart';


const DataDashboard = () => {

  // get the muscles: chest, back, etc. this is for options in the StyledSelect
  const muscles = Object.keys(MuscleExercisesMap);

  const [selectedMuscle, setSelectedMuscle] = useState("");
  const [selectedExercise, setSelectedExercise] = useState("");
  const [filteredExercises, setFilteredExercises] = useState([]);
  const [exerciseData, setExerciseData] = useState([]);
  const [events, setEvents] = useState([]); // calendar
  const [advicePrompt, setAdvicePrompt] = useState([]); // prompt based data
  const [conclusionPrompt, setConclusionPrompt] = useState([]); // prompt based data
  const [chartMode, setChartMode] = useState("line");

  // empty dependency, only run once when first rendering: fetch all data from database
  useEffect(() => {
    const fetchData = async () => {
      const response = await axios.get('http://localhost:5001/dashboard/gpt?id=5');
      setAdvicePrompt(response.data);
    };

    fetchData();
  }, []);


  // TODO: refactor in the future, because the propmt has already store the whole data, maybe this function is not necessary
  const fetchDataOnExercise = async (exercise) => {
    // fetch data from the server, hard code uid = 5
    const response = await axios.get('http://localhost:5001/dashboard/visualizer?id=5&exercise=' + exercise);
    setExerciseData(response.data);
    return response.data;
  }

  // TODO: A bug here when i click event, the select should be rerendered to be the exercise that i clicked
  // this is the callback function that is passed to the calendar
  const handleEventClick = async (arg) => {
    const { event } = arg; // destructure the event object
    const exercise = event.title; // get the exercise name

    try {
      const response = await fetchDataOnExercise(exercise); // response is a promise
      setSelectedExercise(exercise);
      setSelectedMuscle(response[0].muscle);
    } catch (error) {
      console.error(error);
    }
  }

  const handleMuscleChange = (e) => {
    const muscle = e.target.value;
    setSelectedMuscle(muscle);
    setFilteredExercises(MuscleExercisesMap[muscle]);
  }

  const handleExerciseChange = (e) => {
    const exercise = e.target.value;
    setSelectedExercise(exercise);
    fetchDataOnExercise(exercise);
  }

  // this is callback for calendar
  // TODO: logic is a little messy
  const handleDataFetch = async (info) => {
    // handle the date of calendar to get the current month of it
    const startDate = new Date(info.startStr.substring(0,10))
    const endDate = new Date(info.endStr.substring(0, 10));
    const filteredData = advicePrompt.filter((item) => {
        return (new Date(item.date)).getMonth() > startDate.getMonth() && (new Date(item.date)).getMonth() < endDate.getMonth();
    });

    setConclusionPrompt(filteredData);
    
    // const cleanData = filteredData.map((item) => {
    //     return (
    //       { title: item.exercise,
    //         date:item.date
    //       }
    //     )
    // })

    // TODO: fetch data from the server, hard code uid = 5
    const response = await axios.get('http://localhost:5001/dashboard/calendar?id=5&startDate=' + info.startStr + '&endDate=' + info.endStr);
    setEvents(response.data);
    // setEvents(cleanData)
  }

  return (
    <DashboardContainer>
      <ToolBar>
        <DropdownContainer>
          <StyledSelect value={selectedMuscle} onChange={handleMuscleChange}>
            <option value="">Select Muscle</option>
            {/* loop through the muscles and create a select option for each */}
            {muscles.map((muscle) => {
              return <option key={muscle}>{muscle}</option>
            })}
          </StyledSelect>
          <StyledSelect value={selectedExercise} onChange={handleExerciseChange}>
            <option value="">Select Exercise</option>
            {filteredExercises.map((exercise) => {
              return <option key={exercise}>{exercise}</option>
            })}
          </StyledSelect>
        </DropdownContainer>
        <SwtichContainer>
          <div>
            <SwitchIcon src= "/icons/line_chart.png" alt="switch1" onClick={() => setChartMode("line")}/>
          </div>
          <div>
            <SwitchIcon src= "/icons/pie_chart.png" alt="switch2" onClick={() => setChartMode("pie")}/>
          </div>
        </SwtichContainer>
      </ToolBar>
      <ChartArea>
        {chartMode === "line"? <LineChart data={exerciseData} />: <PieChart data={countOfTrainings(advicePrompt)} />}
      </ChartArea>
      <CalendarArea>
        <Calendar onEventClick={handleEventClick} dataFetch={handleDataFetch} events={events} />
      </CalendarArea>
      <AdviceArea>
        <Advice prompt={advicePrompt} />
      </AdviceArea>
      <ConclusionArea>
        <Conclusion prompt={conclusionPrompt}/>
      </ConclusionArea>
    </DashboardContainer>
  );
}

export default DataDashboard;


const countOfTrainings = (data) => {
  const count = {};
  data.forEach((item) => {
    const group = MuscleGroupsMap[item.muscle];
    if (count[group]) {
      count[group] += 1;
    }else {
      count[group] = 1;
    }

  });

  return Object.entries(count).map(([key, value]) => ({ name: key, value }));
  
}


const DashboardContainer = styled.div`
  display: grid;
  grid-template-columns: 2fr 3fr;
  grid-template-rows: 0.5fr 4fr 2fr;
`;

const ChartArea = styled.div`
  grid-column: 1 / 2;
  grid-row: 2 / 3;
  border: 1px solid black;
  border-radius: 10px;
  margin: 20px 10px;
  // padding: 10px;
  display: flex;
  justify-content: center;

`

const CalendarArea = styled.div`
  grid-column: 2 / 3;
  grid-row: 1 / 3;
  border: 1px solid black;
  margin: 20px 10px;
  padding: 10px;
`

const ToolBar = styled.div`
  grid-column: 1 / 2;
  grid-row: 1 / 2;
  display: flex;
  padding: 10px 5px; // top = 10px, right= 5px, bottom = 10px, left = 5px
  justify-content: space-between;
  gap: 10px;
  border: 1px solid black;
  margin: 20px 10px;
`

const AdviceArea = styled.div`
  grid-column: 1 / 2;
  grid-row: 3 / 4;
  border: 1px solid black;
  margin: 20px 10px;
`

const ConclusionArea = styled.div`
  grid-column: 2 / 3;
  grid-row: 3 / 4;
  border: 1px solid black;
  margin: 20px 10px;
`

const DropdownContainer = styled.div`
  display: flex;
  gap: 20px;
  margin: 10px;
`;

const StyledSelect = styled.select`
  padding: 8px 12px;
  border: none;
  border-radius: 4px;
  font-size: 16px;
  outline: none;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;

  &:hover {
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.15);
  }

  &:focus {
    border: 1px solid #007BFF;
  }
`;

const SwtichContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 5px;
  // border: 1px solid black;
`

const SwitchIcon = styled.img`
  width: 40px;
  height: 40px;
  cursor: pointer;
`
