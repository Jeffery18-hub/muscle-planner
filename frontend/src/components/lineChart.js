import React, { useRef, useEffect, useState } from 'react';
import * as d3 from 'd3';
import styled from 'styled-components';

// data: pass from the another component(calendar), and data is array of objects, each object represents a day of exercise
const LineChart = ({ data }) => {
    const svgRef = useRef(null);

    useEffect(() => {
        if (data && svgRef.current) {
            const svg = d3.select(svgRef.current);
            svg.selectAll('*').remove();

            const margin = { top: 40, right: 20, bottom: 60, left: 50 };
            const width = 600 - margin.left - margin.right;
            const height = 600 - margin.top - margin.bottom;

            const g = svg.append('g').attr('transform', `translate(${margin.left},${margin.top})`);

            const minY = d3.min(data, d => d.maximum);
            const maxY = d3.max(data, d => d.maximum);
            const yBuffer = (maxY - minY) * 0.1;

            const xScale = d3.scaleTime()
                .domain(d3.extent(data, d => new Date(d.date)))
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
                .y(d => yScale(d.maximum));

            const path = g.append("path")
                .datum(data)
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
    }, [data]);


    return (
        <SVGContainer>
            <StyledSVG ref={svgRef} width="600" height="600"></StyledSVG>
        </SVGContainer>
    );
}

export default LineChart;

const SVGContainer = styled.div`
    padding: 20px;
`;

const StyledSVG = styled.svg`
  border: 1px solid #ddd;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
  background-color: #fff;
`;