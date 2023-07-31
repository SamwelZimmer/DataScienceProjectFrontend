import { useRef, useEffect } from 'react';
import * as d3 from 'd3';

interface SpikeTrainPlotProps {
    data: number[][][];
    time: number[];
    titles: string[];
};

export default function SpikeTrainPlot({ data, time, titles=[] }: SpikeTrainPlotProps) {
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

        const allValues: {x: number, y: number}[][] = data.map(waveform => 
            waveform.map(([x, y]) => ({x, y}))
        );

        const flatAllValues = allValues.flat();

        const xDomainMin = d3.min(flatAllValues, d => d.x) ?? 0;
        const xDomainMax = d3.max(flatAllValues, d => d.x) ?? 1;
        const yDomainMin = d3.min(flatAllValues, d => d.y) ?? 0;
        const yDomainMax = d3.max(flatAllValues, d => d.y) ?? 1;

        const xScale = d3.scaleLinear()
            .domain([0, time[time.length - 1]])
            .range([0, innerWidth]);
        
        const yScale = d3.scaleLinear()
            .domain([yDomainMin, yDomainMax])
            .range([innerHeight, 0]);

        const line = d3.line<{x: number, y: number}>()
            .x(d => xScale(d.x))
            .y(d => yScale(d.y));
    
        const g = svg.append('g')
            .attr('transform', `translate(${margin.left}, ${margin.top})`);

        allValues.forEach((waveform, i) => {
            g.append('path')
                .datum(waveform)
                .attr('class', `signal-line waveform-${i}`)
                .attr('d', line)
                .attr('fill', 'none')
                .attr('stroke', 'black')
                .attr('stroke-width', 1.5);
        });

        const xAxis = d3.axisBottom(xScale).tickValues([0, time[time.length - 1]]);
        const yAxis = d3.axisLeft(yScale).ticks(0);

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
    }, [data]);

    return (
        <svg ref={ref} className="w-full h-full flex mx-auto" />
    );
}
