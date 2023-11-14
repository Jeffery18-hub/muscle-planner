import React, { useRef, useEffect, useState } from 'react';
import styled from 'styled-components';
import DataVisualizer from '../components/dataVisualizer';
import Calendar from '../components/calendar';
import Advice from '../components/advice';

const DataDashboard = ({ data }) => {
  return (
    <DashboardContainer>
      <StyledData>
        <DataVisualizer data={data} />
      </StyledData>
      <StyledAdvice>
        <Advice />
      </StyledAdvice>
      <StyledCalendar>
        <Calendar />
      </StyledCalendar>
      <StyledConclusion>
        <p>Conclusion here</p>
        </StyledConclusion>
    </DashboardContainer>
  );
}

export default DataDashboard;

const DashboardContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr 3fr;
  grid-template-rows: 3fr 1fr;
  gap: 20px; /* gap between grid items */
  border: 1px solid black; /* add border for visualization */
`;

const GridItem = styled.div`
  border: 1px solid black;
  padding: 10px;
  marign: 20px;
`

const StyledData = styled(GridItem)`
  grid-column: 1 / 2;
  grid-row: 1 / 2;
`
const StyledAdvice = styled(GridItem)`
  grid-column: 1 / 2;
  grid-row: 2 / 3;
`

const StyledCalendar = styled(GridItem)`
  grid-column: 2 / 3;
  grid-row: 1 / 2;
`
const StyledConclusion = styled(GridItem)`
  grid-column: 2 / 3;
  grid-row: 2 / 3;
`