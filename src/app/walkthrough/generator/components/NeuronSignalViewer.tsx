"use client";

import { useState } from "react";

import SingleStaticSignalPlot from "./SingleStaticSignalPlot";
import { Signal } from "../page";

interface NeuronSignalViewerProps {
    signal: Signal | null;
}

export default function NeuronSignalViewer({ signal }: NeuronSignalViewerProps) {

    return (
        <section className="w-full h-full flex flex-col items-center justify-center">
            { 
                signal ? 
                <div className="w-full h-full sm:h-[200px]">
                    <SingleStaticSignalPlot signal={signal.y} time={signal.x} windowSize={signal.y.length} labels={["Time (s)", "Potential (mV)"]} />
                </div>
                :
                <div className="w-full h-full sm:h-[200px] border border-dashed rounded-md flex flex-col items-center justify-center">
                    <span className="flex self-center mx-auto opacity-30 px-6 text-center">Press {"'"}Apply{"'"} to See Graph</span>
                </div>
                }
        </section>
    );
};