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

    const ref = useRef<SVGSVGElement>(null);

    useEffect(() => {
        // stop updating if not enough points left to plot
        if (numberOfTicks >= time.length - windowSize) {
            return;
        }

        if (!ref.current) return;

        // clear SVG canvas
        const svg = d3.select(ref.current);
        svg.selectAll("*").remove();

        // get subset of signal and time data
        let ySubset = signal.slice(numberOfTicks - 1, numberOfTicks - 1 + windowSize);
        let xSubset = time.slice(numberOfTicks - 1, numberOfTicks - 1 + windowSize);

        // adjust x values to start from 0
        const minX = d3.min(xSubset);
        if (!minX) {
            xSubset = xSubset.map(x => x - 0);
        } else {
            xSubset = xSubset.map(x => x - minX);
        }

        const data: Coordinate[] = xSubset.map((xValue, i): Coordinate => ({ x: xValue, y: ySubset[i] }));
    
        const parent = (svg.node() as Element).parentNode as Element;
        const width = parent.clientWidth;
        const height = parent.clientHeight;
    
        const margin = { top: 1, right: 0, bottom: 1, left: 0 };
        const innerWidth = width - margin.left - margin.right;
        const innerHeight = height - margin.top - margin.bottom;

        const xDomainMin = d3.min(data, d => d.x) ?? 0;
        const xDomainMax = d3.max(data, d => d.x) ?? 1;
        const yDomainMin = d3.min(data, d => d.y) ?? 0;
        const yDomainMax = d3.max(data, d => d.y) ?? 1;

        const xScale = d3.scaleLinear()
            .domain([xDomainMin, xDomainMax])
            .range([0, innerWidth]);
        
        const yScale = d3.scaleLinear()
            .domain([yDomainMin, yDomainMax])
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
                <div className="absolute w-full h-full top-0 flex items-center justify-center bg-gray-100 border-2 border-dashed border-black rounded-md">
                    <p>Press Play To See Graph</p>
                </div> 
            }         
        </>
    );
}

    

