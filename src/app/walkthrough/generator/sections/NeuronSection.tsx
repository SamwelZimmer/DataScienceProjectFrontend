"use client"

import { useEffect, useState } from "react";

import NeuronParameters from "../components/NeuronParameters";
import NeuronSignalViewer from "../components/NeuronSignalViewer";
import { NeuronParams, Signal } from "../page";

interface NeuronSectionProps {
    signal: Signal | null;
    setSignal: React.Dispatch<React.SetStateAction<Signal | null>>;
}

export default function NeuronSection({ signal, setSignal }: NeuronSectionProps) {

    const [neuronParams, setNeuronParams] = useState({
        neuron_type: 'standard',
        lambda: 14,
        v_rest: -70,
        v_thres: -10,
        t_ref: 0.02,
        fix_random_seed: false
    });

    return (
        <>
            <h1 className="text-4xl font-semibold px-12 sm:px-0">Neuron Type and Signal</h1>
    
            <div className="w-full h-full px-12 sm:px-0 flex flex-col md:flex-row">
                <NeuronParameters neuronParams={neuronParams} setNeuronParams={setNeuronParams} />

                <div className="h-full w-full flex flex-col items-center justify-start md:justify-center gap-3 md:gap-6">
                    <NeuronSignalViewer signal={signal}  />
                    <NeuronSignalGenerator neuronParams={neuronParams} setSignal={setSignal} />
                </div>
            </div>
        </>
    );
};

interface NeuronSignalGeneratorProps {
    setSignal: React.Dispatch<React.SetStateAction<Signal | null>>;
    neuronParams: object;
}

function NeuronSignalGenerator({ setSignal, neuronParams }: NeuronSignalGeneratorProps) {

    const handleClick = async () => {

        // store neuronParams in session storage
        sessionStorage.setItem('neuronParams', JSON.stringify(neuronParams));

        const response = await fetch('http://127.0.0.1:5000/generate_neuron_signal', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(neuronParams), 
        });
        const data = await response.json();
    
        // signal has an x and y component
        setSignal(data);
    };
    
    return (
        <>
            <section className="w-full px-12 sm:px-0 flex items-center justify-center">
                <button onClick={handleClick} className="border border-black rounded-md px-6 py-2">Generate</button>
            </section>
        </>
    );
};