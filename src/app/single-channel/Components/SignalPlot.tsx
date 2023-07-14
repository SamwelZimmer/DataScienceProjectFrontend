"use client";

import { useState, useRef, useEffect } from "react";
import * as d3 from "d3";

type Coordinate = {
  x: number;
  y: number;
};

type SignalPlotProps = {
    signal: number[];
    time: number[];
    numberOfTicks: number;
};

export default function SignalPlot({ signal, time, numberOfTicks  }: SignalPlotProps) {

    const windowSize = 10000;

    const ref = useRef();

    useEffect(() => {
        // stop updating if not enough points left to plot
        if (numberOfTicks >= time.length - windowSize) {
            return;
        }
        
        // Clear SVG canvas
        const svg = d3.select(ref.current);
        svg.selectAll("*").remove();

        // Get subset of signal and time data
        let ySubset = signal.slice(numberOfTicks - 1, numberOfTicks - 1 + windowSize);
        let xSubset = time.slice(numberOfTicks - 1, numberOfTicks - 1 + windowSize);

        // Adjust x values to start from 0
        const minX = d3.min(xSubset);
        xSubset = xSubset.map(x => x - minX);

        const data: Coordinate[] = xSubset.map((xValue, i): Coordinate => ({ x: xValue, y: ySubset[i] }));
    
        const parent = svg.node().parentNode;
        const width = parent.clientWidth;
        const height = parent.clientHeight;
    
        const margin = { top: 1, right: 0, bottom: 1, left: 0 };
        const innerWidth = width - margin.left - margin.right;
        const innerHeight = height - margin.top - margin.bottom;
    
        const xScale = d3.scaleLinear()
            .domain([d3.min(data, d => d.x), d3.max(data, d => d.x)])
            .range([0, innerWidth]);
    
        const yScale = d3.scaleLinear()
            .domain([d3.min(data, d => d.y), d3.max(data, d => d.y)])
            .range([innerHeight, 0]);
    
        const line = d3.line<Coordinate>()
        .x(d => xScale(d.x))
        .y(d => yScale(d.y));
    
        const g = svg.append('g')
        .attr('transform', `translate(${margin.left}, ${margin.top})`);
    
        g.append('path')
        .datum(data)
        .attr('class', 'single-signal-line')
        .attr('d', line); 
    
    }, [signal, time, numberOfTicks]); // Update the dependency array to include numberOfTicks

    return (
        <>
            {/* {
                numberOfTicks ? <svg ref={ref} className="w-full h-full flex mx-auto" /> : 
            } */}

            <svg ref={ref} className="w-full h-full flex mx-auto" />   

            { !numberOfTicks && 
                <div className="absolute w-full h-full top-0 flex items-center justify-center">
                    <p>Press Play To See Graph</p>
                </div> 
            }         

        </>
    );
}

    

