"use client";

import { useRef, useEffect } from "react";

interface ElectrodeProps {
    value: number;
}

export default function Electrode({ value }: ElectrodeProps) { 
      
    const canvasRef = useRef<HTMLCanvasElement | null>(null);

    function getColor(value: number): string {
        // ensure the value is between 0 and 1
        value = Math.max(0, Math.min(1, value));
      
        // use the value to interpolate between red and green
        const red = Math.floor((1 - value) * 255);
        const green = Math.floor(value * 255);
      
        // return the color as a RGB string
        return `rgb(${red},${green},0)`;
    }  

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        
        const context = canvas.getContext('2d');
        if (!context) return;

        const colour = getColor(value);
    
        // clear the previous drawing
        context.clearRect(0, 0, canvas.width, canvas.height);
    
        // draw a rectangle of the specified color
        context.fillStyle = colour;
        context.fillRect(0, 0, 100, 100);
    
      }, [value]);
        
    return (
        <div className="relative w-full h-32 flex items-center">
            <canvas 
                ref={canvasRef} 
                width="100" 
                height="100" 
                className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-gray-200 border border-black rounded-lg"
                />
        </div>    
      );
};