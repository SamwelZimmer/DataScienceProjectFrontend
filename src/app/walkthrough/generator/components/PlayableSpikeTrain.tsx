import { useRef, useEffect, useState } from 'react';
import * as d3 from 'd3';

interface SpikeTrainPlotProps {
    data: number[][]; // data is now a 2D array
    time: number[];
    titles: string[];
    labels?: false | number[] | null;
    numberOfTicks: number;
};

export default function PlayableSpikeTrain({ data, time, titles=[], labels=false, numberOfTicks }: SpikeTrainPlotProps) {
    const ref = useRef<SVGSVGElement>(null);

    useEffect(() => {
        if (!ref.current) return;

        const svg = d3.select(ref.current);
        svg.selectAll("*").remove();

        const parent = (svg.node() as Element).parentNode as Element;
        const width = parent.clientWidth;
        const height = parent.clientHeight;
        const margin = { top: 0, right: 0, bottom: 20, left: 0 };
        const innerWidth = width - margin.left - margin.right;
        const innerHeight = height - margin.top - margin.bottom;

        const xScale = d3.scaleLinear()
            .domain([0, time[time.length - 1]])
            .range([0, innerWidth]);

        const yScale = d3.scaleLinear()
            .domain([0, 1])
            .range([innerHeight / 2, innerHeight / 2]);

        const g = svg.append('g')
            .attr('transform', `translate(${margin.left}, ${margin.top})`);

        const yOffset = innerHeight / (data.length + 1); // the amount of vertical separation between each color group

        const colorScale = d3.scaleOrdinal(d3.schemeDark2);

        data.forEach((colorGroup, groupIndex) => {
            const yPosition = (groupIndex + 1) * yOffset; 
            colorGroup.forEach((xValue) => {
                g.append('circle')
                    .attr('cx', xScale(xValue))
                    .attr('cy', yPosition)  // Use yPosition here
                    .attr('r', 3)
                    .attr('fill', colorScale(groupIndex.toString()));
            });
        });

        const xAxis = d3.axisBottom(xScale).tickValues([0, time[time.length - 1]]);

        g.append('g')
            .attr('transform', `translate(0, ${innerHeight})`)
            .call(xAxis);


        let linePosition =  (numberOfTicks / 25000) * innerWidth 
        // Draw the vertical line
        svg.append('line')
            .attr('x1', linePosition)
            .attr('y1', 0)
            .attr('x2', linePosition)
            .attr('y2', height) // Assuming height is defined somewhere in your component
            .attr('id', 'movingLine') // Assign an id to easily select and update this line later
            .attr('class', 'single-signal-line')


        d3.select("#movingLine")
            .attr('x1', linePosition)
            .attr('x2', linePosition);

            if (titles) {
                // append x axis label
                g.append("text")             
                    .attr("transform",
                        "translate(" + (innerWidth/2) + " ," + 
                                        (innerHeight + margin.top + 10) + ")")
                    .style("text-anchor", "middle")
                    .style("font-size", "11px") 
                    .style("fill", "black") 
                    .style("font-weight", "light") 
                    .text(titles[0]);
    
                // append y axis label
                g.append("text")
                    .attr("transform", "rotate(-90)")
                    .attr("y", 0 - margin.left)
                    .attr("x",0 - (innerHeight / 2))
                    .attr("dy", "1em")
                    .style("text-anchor", "middle")
                    .style("font-size", "11px") 
                    .style("fill", "black") 
                    .style("font-weight", "light") 
                    .text(titles[1]);  
            }
    }, [data, numberOfTicks]);


    return (
        <svg ref={ref} className="w-full h-full flex mx-auto" />
    );
}
