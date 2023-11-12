import React, { useRef, useEffect, useState } from 'react';
import * as d3 from 'd3';
import styled from 'styled-components';

const DataDashboard = ({ data }) => {
    const ref = useRef(null);

    const [selectedMuscle, setSelectedMuscle] = useState(null);
    const [selectedExercise, setSelectedExercise] = useState(null);
    const [filteredExercises, setFilteredExercises] = useState([]);

    const handleMuscleChange = (e) => {
        const muscle = e.target.value;
        setSelectedMuscle(muscle);
        const exercisesForMuscle = [...new Set(data.filter(d => d.muscle === muscle).map(d => d.exercise))];
        setFilteredExercises(exercisesForMuscle);
        setSelectedExercise('');  // Reset exercise selection
    };

    useEffect(() => {
        if (data && ref.current) {
            const svg = d3.select(ref.current);
            svg.selectAll('*').remove();  

            const margin = { top: 40, right: 20, bottom: 60, left: 50 };
            const width = 600 - margin.left - margin.right;
            const height = 600 - margin.top - margin.bottom;

            const g = svg.append('g').attr('transform', `translate(${margin.left},${margin.top})`);

            const filteredData = data.filter(d => {
                if (!selectedMuscle || !selectedExercise) return false;
                if (d.muscle !== selectedMuscle) return false;
                if (d.exercise !== selectedExercise) return false;
                return true;
            });

            const minY = d3.min(filteredData, d => d.maxWeight);
            const maxY = d3.max(filteredData, d => d.maxWeight);
            const yBuffer = (maxY - minY) * 0.1;

            const xScale = d3.scaleTime()
                .domain(d3.extent(filteredData, d => new Date(d.date)))
                .range([0, width]);

            const yScale = d3.scaleLinear()
                .domain([minY - yBuffer, maxY])
                .range([height, 0]);

            const xAxis = d3.axisBottom(xScale).ticks(5).tickFormat(d3.timeFormat('%Y-%m-%d'));
            const yAxis = d3.axisLeft(yScale);

            g.append('g')
                .attr('transform', `translate(0,${height})`)
                .call(xAxis)
                .selectAll('text')
                .attr('transform', 'rotate(-40)')
                .style('text-anchor', 'end');

            g.append('g').call(yAxis);

            const line = d3.line()
                .x(d => xScale(new Date(d.date)))
                .y(d => yScale(d.maxWeight));

            const path = g.append("path")
                .datum(filteredData)
                .attr("fill", "none")
                .attr("stroke", "steelblue")
                .attr("stroke-width", 1.5)
                .attr("d", line);

            const totalLength = path.node().getTotalLength();
            path
                .attr("stroke-dasharray", totalLength + " " + totalLength)
                .attr("stroke-dashoffset", totalLength)
                .transition()
                .duration(2000)
                .ease(d3.easeLinear)
                .attr("stroke-dashoffset", 0);

        }
    }, [data, selectedMuscle, selectedExercise]);

    const muscles = [...new Set(data.map(d => d.muscle))];

    return (
        <DataContainer>
          <DropdownContainer>
            <StyledSelect onChange={handleMuscleChange}>
              <option value="">Select muscle</option>
              {muscles.map(muscle => (
                <option key={muscle} value={muscle}>{muscle}</option>
              ))}
            </StyledSelect>
            <StyledSelect onChange={e => setSelectedExercise(e.target.value)}>
              <option value="">Select exercise</option>
              {filteredExercises.map(exercise => (
                <option key={exercise} value={exercise}>{exercise}</option>
              ))}
            </StyledSelect>
          </DropdownContainer>

          <StyledSVG ref={ref} width="600" height="600"></StyledSVG>
        </DataContainer>
      );
}

export default DataDashboard;

const DataContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: stretch;
  width: 100vw;
  padding: 20px;
  box-sizing: border-box;
  background-color: #f4f4f4;
`;


const DropdownContainer = styled.div`
  display: flex;
  gap: 20px;
  margin-bottom: 20px;
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

const StyledSVG = styled.svg`
  border: 1px solid #ddd;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
  background-color: #fff;
`;