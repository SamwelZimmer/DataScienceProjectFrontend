import { useEffect, useRef } from 'react';
import * as d3 from 'd3';

interface TriangulatePlotProps {
    gridSize: number;
    predictedPosition: number[];
    truePosition: number[] | null;
    allElectrodes: [number, number][];
    usedElectrodes: number[];
    circles: [number[], number][];
    intersectingLines: [number, number][];
    showConstructions: boolean;
}

export default function TriangulatePlot({ gridSize, predictedPosition, truePosition, allElectrodes, usedElectrodes, circles, showConstructions }: TriangulatePlotProps) {
    const ref = useRef<SVGSVGElement>(null);
    
    useEffect(() => {
        if (ref.current) {
            const svg = d3.select(ref.current);

            svg.selectAll("*").remove();
    
            const parent = (svg.node() as Element).parentNode as Element;
            const width = parent.clientWidth;
            const height = parent.clientHeight;
            const margin = { top: 10, right: 10, bottom: 30, left: 30 };
            const innerWidth = width - margin.left - margin.right;
            const innerHeight = height - margin.top - margin.bottom;
            
            // create scales
            const xScale = d3.scaleLinear()
                .domain([0, gridSize])
                .range([0, innerWidth]); // width of the SVG

            const yScale = d3.scaleLinear()
                .domain([0, gridSize])
                .range([innerHeight, 0]); // height of the SVG, reversed because SVGs use top-left as origin

            const xAxis = d3.axisBottom(xScale);
            const yAxis = d3.axisLeft(yScale);

            // create a group for the plot inside the svg and translate it by the left and top margin
            const g = svg.append("g")
                .attr("transform", `translate(${margin.left},${margin.top})`);

            // append x and y axes to the group
            g.append("g")
                .attr("transform", `translate(0,${innerHeight})`)
                .call(xAxis);

            g.append("g")
                .call(yAxis);

            // plot all electrodes
            allElectrodes.forEach((d) => {
                g.append("circle")
                    .attr("cx", xScale(d[0]))
                    .attr("cy", yScale(d[1]))
                    .attr("r", 3)
                    .attr("fill", "blue");
            });
            
            // true position will not exist if more neurons are identified than actually exist
            if (truePosition) {
                // plot true position
                g.append("circle")
                    .attr("cx", xScale(truePosition[0]))
                    .attr("cy", yScale(truePosition[1]))
                    .attr("r", 5)
                    .attr("fill", "red");
            };

            // plot predicted position
            g.append("circle")
                .attr("cx", xScale(predictedPosition[0]))
                .attr("cy", yScale(predictedPosition[1]))
                .attr("r", 5)
                .attr("fill", "purple");

            if (showConstructions) {
                // create a line generator
                const line = d3.line()
                    .x(d => xScale(d[0]))
                    .y(d => yScale(d[1]));

                // get the positions of the used electrodes
                const usedElectrodePositions = usedElectrodes.map(i => allElectrodes[i]);

                // append the first electrode position to the end to form a loop
                usedElectrodePositions.push(usedElectrodePositions[0]);

                // draw the line
                g.append("path")
                    .datum(usedElectrodePositions)
                    .attr("fill", "none")
                    .attr("stroke", "blue")
                    .attr("d", line);

                // const radiusScale = d3.scaleLinear()
                //     .domain([0, d3.max(circles, d => d[1])]) // domain is 0 to max radius in your data
                //     .range([0, innerWidth / gridSize]); // range is 0 to the width of one grid cell

                // // create circles
                // circles.forEach((circle) => {
                //     const [center, radius] = circle;
                //     console.log("circle",center, radius)
                //     g.append("circle")
                //         .attr("cx", xScale(center[0]))
                //         .attr("cy", yScale(center[1]))
                //         .attr("r", radiusScale(radius)) // use the scale to set the radius
                //         .style("fill", "none")
                //         .attr("stroke", "green");
                // });

            }
        }
    }, [gridSize, predictedPosition, truePosition, allElectrodes, usedElectrodes, showConstructions, ref]);

    return (
        <>
            <svg ref={ref} className="w-full h-full flex mx-auto" />
        </>
    );
}


