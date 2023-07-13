"use client";

import { useState } from "react";
import { motion } from "framer-motion";

import PlayButton from "./PlayButton";
import PlayTime from "./PlayTime";
import Electrode from "./Electrode";
import SpeedSelector from "./SpeedSelector";

interface ElectrodeViewerProps {
    signal: number[];
    time: number[];
    sampleLength: number;
    maxAmplitude: number;
    minAmplitude: number;
    sampleRate: number;
}

export default function ElectrodeViewer({ signal, time, maxAmplitude, minAmplitude, sampleRate, sampleLength }: ElectrodeViewerProps) {

    const [numberOfTicks, setNumberOfTicks] = useState(0);
    const [tickPerSecond, setTickPerSecond] = useState(10000);

    const seconds = numberOfTicks / sampleRate;

    function normalise(value: number, min: number, max: number): number {
        return (value - min) / (max - min);
    };

    return (
        <>
            <section className="w-full flex flex-col items-center gap-12">
                {/* buttons and interface */}
                <div className="w-full flex flex-col sm:flex-row items-center justify-between gap-6">
                    <div className="flex items-center gap-3">
                        <PlayButton sampleLength={sampleLength} tickPerSecond={tickPerSecond} setNumberOfTicks={setNumberOfTicks} />
                        <PlayTime duration={sampleLength / sampleRate} currentTime={seconds} />
                    </div>
                    <div className="flex items-center gap-3">
                        <SpeedSelector tickPerSecond={tickPerSecond} setTickPerSecond={setTickPerSecond} sampleRate={sampleRate} />
                    </div>
                </div>

                <div>
                    <Electrode value={normalise(signal[numberOfTicks], minAmplitude, maxAmplitude)} />
                </div>
            </section>


        </>
    );
}

