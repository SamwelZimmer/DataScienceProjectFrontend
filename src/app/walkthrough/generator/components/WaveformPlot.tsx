"use client";

import { useState, useRef, useEffect } from "react";
import * as d3 from "d3";

import { Waveform } from "../sections/ExtractionSection";

interface WaveformPlotProps {
    labels?: false | number[] | null;
    titles?: false | string[];
    waveforms: Waveform[];
};

type WaveformPoint = {
    x: number;
    y: number;
};

export default function WaveformPlot({ waveforms, labels=false, titles=false }: WaveformPlotProps) {
    const ref = useRef<SVGSVGElement>(null);

    const sample_rate = 25000;
    const millisecond = 1000;

    const timeArray = waveforms[0].map((_, index) => (index * (1 / sample_rate)));
    const shiftedTimeArray = timeArray.map((value, index) => (value - timeArray[timeArray.length - 1] / 2) * millisecond);

    let waveformsTransformed = waveforms.map(waveform => 
        waveform.map((value, index) => ({x: shiftedTimeArray[index], y: value}))
    );    

    useEffect(() => {
        if (!ref.current) return;

        const svg = d3.select(ref.current);
        svg.selectAll("*").remove();
    
        const parent = (svg.node() as Element).parentNode as Element;
        const width = parent.clientWidth;
        const height = parent.clientHeight;
        const margin = { top: 10, right: 10, bottom: 30, left: 30 };
        const innerWidth = width - margin.left - margin.right;
        const innerHeight = height - margin.top - margin.bottom;

        // Flatten the waveforms to calculate the global min and max
        let allPoints = waveformsTransformed.flat();

        const xDomainMin = d3.min(shiftedTimeArray) ?? 0;
        const xDomainMax = d3.max(shiftedTimeArray) ?? 1;
        const yDomainMin = d3.min(allPoints, d => d.y) ?? 0;
        const yDomainMax = d3.max(allPoints, d => d.y) ?? 1;

        const xScale = d3.scaleLinear()
            .domain([xDomainMin, xDomainMax])
            .range([0, innerWidth]);
        
        const yScale = d3.scaleLinear()
            .domain([yDomainMin, yDomainMax])
            .range([innerHeight, 0]);

        const line = d3.line<WaveformPoint>()
            .x(d => xScale(d.x))
            .y(d => yScale(d.y));
    
        const g = svg.append('g')
            .attr('transform', `translate(${margin.left}, ${margin.top})`);

        // create a color scale.
        const colorScale = d3.scaleOrdinal(d3.schemeSet1);

        waveformsTransformed.forEach((waveform, index) => {
            g.append('path')
                .datum(waveform)
                .attr('class', `signal-line waveform-${index}`)
                .attr('d', line)
                .attr('fill', 'none')
                .attr('stroke', labels ? colorScale(labels[index].toString()) : 'black') // Convert number to string.
                .attr('stroke-width', 1.5);
        });

        const xAxis = d3.axisBottom(xScale).tickValues([shiftedTimeArray[0], 0, shiftedTimeArray[shiftedTimeArray.length - 1]]);
        const yAxis = d3.axisLeft(yScale)
            .tickValues([yDomainMin, yDomainMax])
            .tickFormat(d3.format(".3"));
        
        g.append('g')
            .attr('transform', `translate(0, ${innerHeight})`)
            .call(xAxis);
    
        g.append('g')
            .call(yAxis);

        if (titles) {
            // append x axis label
            g.append("text")             
                .attr("transform",
                    "translate(" + (innerWidth/2) + " ," + 
                                    (innerHeight + margin.top + 20) + ")")
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

    }, [waveformsTransformed]);

    return (
        <>
            <svg ref={ref} className="w-full h-full flex mx-auto" />
        </>
    );
}
