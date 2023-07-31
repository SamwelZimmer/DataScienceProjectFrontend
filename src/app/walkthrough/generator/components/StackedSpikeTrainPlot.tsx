// this doesnt work yet

import { useRef, useEffect } from 'react';
import * as d3 from 'd3';

interface StackedSpikeTrainPlotProps {
    data: number[][][][];
    time: number[];
};

export default function StackedSpikeTrainPlot({ data, time }: StackedSpikeTrainPlotProps) {
    const ref = useRef<SVGSVGElement>(null);

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

        const allValues: {x: number, y: number}[][][] = data.map(group =>
            group.map(waveform => 
                waveform.map(([x, y]) => ({x, y}))
            )
        );

        const flatAllValues = allValues.flat(2);

        const xDomainMin = d3.min(flatAllValues, d => d.x) ?? 0;
        const xDomainMax = d3.max(flatAllValues, d => d.x) ?? 1;
        const yDomainMin = d3.min(flatAllValues, d => d.y) ?? 0;
        const yDomainMax = d3.max(flatAllValues, d => d.y) ?? 1;

        const xScale = d3.scaleLinear()
            .domain([0, time.length])
            .range([0, innerWidth]);
        
        const yScale = d3.scaleLinear()
            .domain([0, allValues.length]) // number of groups
            .range([0, innerHeight]);

        const line = d3.line<{x: number, y: number}>()
            .x(d => xScale(d.x))
            .y((d, i) => yScale(i));
    
        const g = svg.append('g')
            .attr('transform', `translate(${margin.left}, ${margin.top})`);

        allValues.forEach((group, groupIndex) => {
            group.forEach((waveform, i) => {
                g.append('path')
                    .datum(waveform)
                    .attr('class', `signal-line waveform-${i}`)
                    .attr('d', line)
                    .attr('fill', 'none')
                    .attr('stroke', 'black')
                    .attr('stroke-width', 1.5);
            });
        });

        const xAxis = d3.axisBottom(xScale);
        const yAxis = d3.axisLeft(yScale);

        g.append('g')
            .attr('transform', `translate(0, ${innerHeight})`)
            .call(xAxis);
    
        g.append('g')
            .call(yAxis);
    }, [data]);

    return (
        <svg ref={ref} className="w-full h-full flex mx-auto" />
    );
}
