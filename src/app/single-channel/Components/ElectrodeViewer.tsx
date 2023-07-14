"use client";

import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";

import PlayButton from "./PlayButton";
import PlayTime from "./PlayTime";
import Electrode from "./Electrode";
import SpeedSelector from "./SpeedSelector";
import SignalPlot from "./SignalPlot";
import TimeIndicator from "./TimeIndicator";

interface ElectrodeViewerProps {
    signal: number[];
    time: number[];
    sampleLength: number;
    maxAmplitude: number;
    minAmplitude: number;
    sampleRate: number;
};

export default function ElectrodeViewer({ signal, time, maxAmplitude, minAmplitude, sampleRate, sampleLength }: ElectrodeViewerProps) {

    const [numberOfTicks, setNumberOfTicks] = useState(0);
    const [tickPerSecond, setTickPerSecond] = useState(10000);
    const [windowSize, setWindowSize] = useState(10000);

    const seconds = numberOfTicks / sampleRate;

    function normalise(value: number, min: number, max: number): number {
        return (value - min) / (max - min);
    };

    // TODO: 
    //     * Slider to set the time

    return (
        <>
            <section className="w-full flex flex-col items-center gap-12">
                <div className="h-48 w-full relative">
                    {
                        numberOfTicks ? 
                        <div className=" h-full relative">
                            <SignalPlot signal={signal} time={time} numberOfTicks={numberOfTicks} windowSize={windowSize} />
                            <TimeIndicator time={time} numberOfTicks={numberOfTicks} windowSize={windowSize} />
                        </div> :
                        <div className="absolute w-full h-full top-0 flex items-center justify-center bg-gray-100 border-2 border-dashed border-black rounded-md">
                            <p>Press Play To See Graph</p>
                        </div> 
                    }
                   
                </div>

                {/* buttons and interface */}
                <div className="w-full flex flex-col sm:flex-row items-center justify-between gap-6">
                    <div className="flex items-center gap-3">
                        <PlayButton sampleLength={sampleLength} tickPerSecond={tickPerSecond} setNumberOfTicks={setNumberOfTicks} />
                        <PlayTime duration={sampleLength / sampleRate} currentTime={seconds} />
                    </div>
                    <div className="flex items-center gap-3">
                        <SpeedSelector windowSize={windowSize} setWindowSize={setWindowSize} tickPerSecond={tickPerSecond} setTickPerSecond={setTickPerSecond} sampleRate={sampleRate} />
                    </div>
                </div>

                <div>
                    <Electrode value={normalise(signal[numberOfTicks], minAmplitude, maxAmplitude)} />
                </div>
            </section>


        </>
    );
};

