import React, { useRef, useEffect } from 'react';
import * as d3 from 'd3';
import styled from 'styled-components';

const PieChart = ({ data }) => {

    const svgRef = useRef(null);

    console.log(data)


    // TODO: refactor in the future
    useEffect(() => {
        if (data && svgRef.current) {

            const svg = d3.select(svgRef.current);

            const width = 450;  // SVG width
            const height = 400; // SVG height
            const radius = Math.min(width, height) / 2;

            // set up chart
            const pie = d3.pie().value(d => d.value); // return a function
            const arcGenerator = d3.arc().innerRadius(0).outerRadius(radius);
            const formattedData = pie(data);
            const color = d3.scaleOrdinal(d3.schemeSet2);

            console.log(formattedData)


            //set up svg data
            svg.attr('width', width)
                .attr('height', height)
                .append('g')
                .attr('transform', `translate(${width / 2}, ${height / 2})`)
                .selectAll('path')
                .data(formattedData)
                .enter()
                .append('path')
                .attr('d', arcGenerator)
                .attr('fill', d => color(d.data.name))
                .style('opacity', 0.5)



            // set up annotation
            svg.select('g')
                .selectAll('text')
                .data(formattedData)
                .enter()
                .append('text')
                .attr('transform', d => `translate(${arcGenerator.centroid(d)})`)
                .attr('text-anchor', 'middle')
                .text(d => `${d.data.name}: ${(d.value / d3.sum(data, d => d.value) * 100).toFixed(1)}%`);
        }
    }, [data]);


    return (
        <SVGContainer>
            <StyledSVG ref={svgRef}></StyledSVG>
        </SVGContainer>
    );
}

export default PieChart;

const SVGContainer = styled.div`
   padding: 50px;
`

const StyledSVG = styled.svg`
  border: 1px solid #ddd;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
  background-color: #fff;
`;