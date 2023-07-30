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
    labels?: false | string[];
    yLine?: boolean | number;
};

export default function SingleStaticSignalPlot({ signal, time, startPosition=0, windowSize=10000, labels=false, yLine=false }: SignalPlotProps) {

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
    
        const margin = { top: 10, right: 10, bottom: 30, left: 30 };
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
        
        // show horizontal line if requested
        if (typeof yLine === "number") {
            const yValue = yScale(yLine);
            g.append("line")
                .attr("x1", 0)
                .attr("y1", yValue)
                .attr("x2", innerWidth)
                .attr("y2", yValue)
                .attr("stroke", "red")
                .attr("stroke-width", 1)
                .attr("stroke-dasharray", "5,5");  
        
            g.append("text")
                .attr("x", 5)
                .attr("y", yValue - 5)
                .text(`y = ${Math.round((yLine + Number.EPSILON) * 100) / 100}`)
                .attr("font-size", "10px")
                .attr("fill", "black");
        }

        if (labels) {
            // append x axis label
            g.append("text")             
                .attr("transform",
                    "translate(" + (innerWidth/2) + " ," + 
                                    (innerHeight + margin.top + 10) + ")")
                .style("text-anchor", "middle")
                .style("font-size", "11px") 
                .style("fill", "black") 
                .style("font-weight", "light") 
                .text(labels[0]);

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
                .text(labels[1]);  
        }
    
    }, [signal, yLine]);


    return (
        <>
            <svg ref={ref} className="w-full h-full flex mx-auto" />
        </>
    );
}

    

