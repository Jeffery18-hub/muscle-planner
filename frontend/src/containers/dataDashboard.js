import React, { useRef, useEffect, useState } from 'react';
import styled from 'styled-components';
import DataVisualizer from '../components/dataVisualizer';
import Calendar from '../components/calendar';

const DataDashboard = ({ data }) => {
    return (
        <DashboardContainer>
          <DataVisualizer data={data} />
          <Calendar/>
        </DashboardContainer>
      );
}

export default DataDashboard;

const DashboardContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: stretch;
  width: 100vw;
  padding: 20px;
  box-sizing: border-box;
  background-color: #f4f4f4;
`;
