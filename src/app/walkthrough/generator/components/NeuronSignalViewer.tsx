"use client";

import { useState } from "react";

import SingleStaticSignalPlot from "./SingleStaticSignalPlot";
import { Signal } from "../page";

interface NeuronSignalViewerProps {
    signal: Signal | null;
}

export default function NeuronSignalViewer({ signal }: NeuronSignalViewerProps) {

    return (
        <section className="w-full h-[175px] flex flex-col items-center justify-center">
            { 
                signal ? 
                <>
                    <SingleStaticSignalPlot signal={signal.y} time={signal.x} numberOfTicks={1} windowSize={signal.y.length - 100} />
                </>
                :
                <div className="items-center justify-center bg-gray-100 border-2 border-dashed border-black rounded-md p-12">
                    <p>Generate Signal To See Graph</p>
                </div> 
                }
        </section>
    );
};