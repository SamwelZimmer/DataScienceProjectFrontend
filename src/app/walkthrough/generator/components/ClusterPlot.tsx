import { useEffect, useRef } from 'react';
import * as d3 from 'd3';

interface ClusterPlotProps {
    x: number[];
    y: number[];
    titles?: false | string[];
    labels?: false | number[] | null;
}

export default function ClusterPlot({ x, y, titles=false, labels=false }: ClusterPlotProps) {
    const ref = useRef<SVGSVGElement>(null);

    useEffect(() => {
        if (!ref.current) return;

        // combine the arrays into an array of objects
        let data = x.map((x, i) => ({x: x, y: y[i], label: labels ? labels[i] : null}));
        
        const svg = d3.select(ref.current);
        svg.selectAll("*").remove();
    
        const parent = (svg.node() as Element).parentNode as Element;
        const width = parent.clientWidth;
        const height = parent.clientHeight;
        const margin = { top: 10, right: 10, bottom: 30, left: 30 };
        const innerWidth = width - margin.left - margin.right;
        const innerHeight = height - margin.top - margin.bottom;

        const xDomainMin = d3.min(data, d => d.x) ?? 0;
        const xDomainMax = d3.max(data, d => d.x) ?? 1;
        const yDomainMin = d3.min(data, d => d.y) ?? 0;
        const yDomainMax = d3.max(data, d => d.y) ?? 1;

        let left = xDomainMin - Math.abs(0.2 * xDomainMin)
        let right = xDomainMax + Math.abs(0.2 * xDomainMin)
        let bottom = yDomainMin - Math.abs(0.2 * yDomainMin)
        let top = yDomainMax + Math.abs(0.2 * yDomainMax)

        const xScale = d3.scaleLinear()
            .domain([left, right])
            .range([0, innerWidth]);
        
        const yScale = d3.scaleLinear()
            .domain([bottom, top])
            .range([innerHeight, 0]);

        const g = svg.append('g')
            .attr('transform', `translate(${margin.left}, ${margin.top})`);

        // create a color scale.
        const colorScale = d3.scaleOrdinal(d3.schemeDark2);
         
         // add the scatterplot
        g.selectAll("dot")
            .data(data)
            .enter().append("circle")
            .attr("r", 5)
            .attr("cx", function(d) { return xScale(d.x); })
            .attr("cy", function(d) { return yScale(d.y); })
            .attr("fill", function(d) { return labels ? colorScale(String(d.label)) : 'black'; });
         
         const xAxis = d3.axisBottom(xScale).tickValues([left, right])
         const yAxis = d3.axisLeft(yScale).tickValues([bottom, top])
         
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

    }, [x, y]);

    return (
        <>
            <svg ref={ref} className="w-full h-full flex mx-auto" />
        </>
    );
}
