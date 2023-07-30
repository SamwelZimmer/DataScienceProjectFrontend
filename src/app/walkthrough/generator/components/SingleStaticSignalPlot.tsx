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
    startPosition?: number;
    windowSize?: number;
};

export default function SingleStaticSignalPlot({ signal, time, startPosition=0, windowSize=10000 }: SignalPlotProps) {

    const ref = useRef<SVGSVGElement>(null);

    const yDomainMin = d3.min(signal) ?? 0;
    const yDomainMax = d3.max(signal) ?? 1;

    useEffect(() => {

        if (!ref.current) return;

        // clear SVG canvas
        const svg = d3.select(ref.current);
        svg.selectAll("*").remove();

        // get subset of signal and time data
        let ySubset = signal.slice(startPosition, startPosition + windowSize);
        let xSubset = time.slice(startPosition, startPosition + windowSize);

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
    
        const margin = { top: 10, right: 10, bottom: 20, left: 30 };
        const innerWidth = width - margin.left - margin.right;
        const innerHeight = height - margin.top - margin.bottom;

        const xDomainMin = d3.min(data, d => d.x) ?? 0;
        const xDomainMax = d3.max(data, d => d.x) ?? 1;
        // const yDomainMin = d3.min(data, d => d.y) ?? 0;
        // const yDomainMax = d3.max(data, d => d.y) ?? 1;

        const xScale = d3.scaleLinear()
            .domain([xDomainMin, xDomainMax])
            .range([0, innerWidth]);
        
        const yScale = d3.scaleLinear()
            .domain([yDomainMin, yDomainMax])
            .range([innerHeight, 0]);

        // create the axes
        const xAxis = d3.axisBottom(xScale).tickValues([Math.min(...xSubset), Math.max(...xSubset)]);
        const yAxis = d3.axisLeft(yScale).tickValues([-70, Math.max(...ySubset)]);  
    
        const line = d3.line<Coordinate>()
        .x(d => xScale(d.x))
        .y(d => yScale(d.y));
    
        const g = svg.append('g')
        .attr('transform', `translate(${margin.left}, ${margin.top})`);
    
        g.append('path')
        .datum(data)
        .attr('class', 'single-signal-line')
        .attr('d', line); 

        // append the axes to the group
        g.append('g')
        .attr('transform', `translate(0, ${innerHeight})`) // This positions the x-axis at the bottom
        .call(xAxis);
    
        g.append('g')
            .call(yAxis); 
    
    }, [signal]);

    return (
        <>
            <svg ref={ref} className="w-full h-full flex mx-auto" />
        </>
    );
}

    

