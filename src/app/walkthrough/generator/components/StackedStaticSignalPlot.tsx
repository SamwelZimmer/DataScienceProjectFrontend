"use client";

import { useState, useRef, useEffect } from "react";
import * as d3 from "d3";

type Coordinate = {
  x: number;
  y: number;
};

type StackedStaticSignalPlotProps = {
    signals: number[][];
    time: number[];
    numberOfTicks?: number;
    windowSize?: number;
};

// NOT WORKING PROPERLY

export default function StackedStaticSignalPlot({ signals, time, numberOfTicks=1, windowSize=10000  }: StackedStaticSignalPlotProps) {

    const ref = useRef<SVGSVGElement>(null);

    const yDomainMin = d3.min(signals.flat()) ?? 0;
    const yDomainMax = d3.max(signals.flat()) ?? 1;

    useEffect(() => {
        if (numberOfTicks >= time.length - windowSize) {
            return;
        }

        if (!ref.current) return;

        const svg = d3.select(ref.current);
        svg.selectAll("*").remove();

        let xSubset = time.slice(numberOfTicks - 1, numberOfTicks - 1 + windowSize);

        const parent = (svg.node() as Element).parentNode as Element;
        const width = parent.clientWidth;
        const height = parent.clientHeight;
    
        const margin = { top: 10, right: 10, bottom: 20, left: 30 };
        const innerWidth = width - margin.left - margin.right;
        const innerHeight = height - margin.top - margin.bottom;

        const xDomainMin = d3.min(xSubset) ?? 0;
        const xDomainMax = d3.max(xSubset) ?? 1;

        const xScale = d3.scaleLinear()
            .domain([xDomainMin, xDomainMax])
            .range([0, innerWidth]);
        
        const yScale = d3.scaleLinear()
            .domain([yDomainMin, yDomainMax])
            .range([innerHeight, 0]);

        const xAxis = d3.axisBottom(xScale).tickValues([Math.min(...xSubset), Math.max(...xSubset)]);
    
        const line = d3.line<Coordinate>()
        .x(d => xScale(d.x))
        .y(d => yScale(d.y));
    
        const g = svg.append('g')
        .attr('transform', `translate(${margin.left}, ${margin.top})`);

        let offset = 0;  
        const offsetIncrement = 10; 
    
        signals.forEach((signal, i) => {
            // get subset of signal and time data
            // let ySubset = signal.slice(numberOfTicks - 1, numberOfTicks - 1 + windowSize);
            let xSubset = time.slice(numberOfTicks - 1, numberOfTicks - 1 + windowSize);
            const ySubset = signal.map(y => y + offset);

            // adjust x values to start from 0
            const minX = d3.min(xSubset);
            if (!minX) {
                xSubset = xSubset.map(x => x - 0);
            } else {
                xSubset = xSubset.map(x => x - minX);
            }

            const data: Coordinate[] = xSubset.map((xValue, i): Coordinate => ({ x: xValue, y: ySubset[i] }));
            const yAxis = d3.axisLeft(yScale).tickValues([-70, Math.max(...ySubset)]);  

            g.append('g')
                .attr('transform', `translate(0, ${innerHeight * i})`)
                .call(yAxis);

            g.append('path')
            .datum(data)
            .attr('class', 'single-signal-line')
            .attr('d', line); 

            offset += offsetIncrement;  // Increase the offset for the next signal

        });

        g.append('g')
        .attr('transform', `translate(0, ${innerHeight})`)
        .call(xAxis);
    
    }, [signals]);

    return (
        <>
            <svg ref={ref} className="w-full h-full flex mx-auto" />
        </>
    );
}

    

