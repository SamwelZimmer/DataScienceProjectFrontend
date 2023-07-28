"use client";

import { useState } from "react";

import SingleSignalPlot from "./SingleSignalPlot";
import { Signal } from "../sections/NeuronSection";

interface NeuronSignalViewerProps {
    signal: Signal | null;
}

export default function NeuronSignalViewer({ signal }: NeuronSignalViewerProps) {

    return (
        <section className="w-full h-[175px] flex flex-col items-center justify-center">
            { 
                signal ? 
                <>
                    <SingleSignalPlot signal={signal.y} time={signal.x} numberOfTicks={1} windowSize={signal.y.length - 100} />
                </>
                :
                <div className="items-center justify-center bg-gray-100 border-2 border-dashed border-black rounded-md p-12">
                    <p>Generate Signal To See Graph</p>
                </div> 
                }
        </section>
    );
};