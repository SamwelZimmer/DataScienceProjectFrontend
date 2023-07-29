"use client"

import { useState } from "react";

import ProcessingParameters from "../components/ProcessingParameters";
import NeuronSignalViewer from "../components/NeuronSignalViewer";
import { Signal } from "../page";

export interface ProcessingParams {
    decay_type: string;
    decay_rate: number;
    noise_type: string;
    noise_std: number;
    filter_type: string;
    low: number;
    high: number;
}

interface ProcessingSectionProps {
    signal: Signal | null;
}

export default function ProcessingSection({ signal }: ProcessingSectionProps) {

    const [electrodeSignal, setElectrodeSignal] = useState<Signal | null>(null);

    const [processingParams, setProcessingParams] = useState({
        decay_type: 'square',
        decay_rate: 2,
        noise_type: 'none',
        noise_std: 0.5,
        filter_type: 'none',
        low: 500,
        high: 3000
    });

    return (
        <>
            <h1 className="text-4xl font-semibold px-12 sm:px-0">Signal Noise and Filtering</h1>

            <div className="w-full h-full px-12 sm:px-0 flex flex-col md:flex-row md:gap-6">

                <div className="flex flex-col w-full h-full items-center justify-center gap-6">
                    <ProcessingParameters processingParams={processingParams} setProcessingParams={setProcessingParams} />
                    <GenerateButton neuronSignal={signal} processingParams={processingParams} setElectrodeSignal={setElectrodeSignal} />
                </div>

                <div className="flex flex-col w-full items-center justify-center">
                    <div className="hidden sm:flex w-full flex-col gap-1">
                        <span className="font-thin text-center">Neuron Output Signal</span>
                        <NeuronSignalViewer signal={signal} />
                    </div>
                    <div className="w-full flex flex-col gap-1">
                        <span className="font-thin text-center">Example Recorded Electrode Signal</span>
                        <NeuronSignalViewer signal={electrodeSignal} />
                    </div>
                </div>
            </div>
        </>
    );
};

interface GenerateButtonProps {
    processingParams: ProcessingParams;
    neuronSignal: Signal | null;
    setElectrodeSignal: React.Dispatch<React.SetStateAction<Signal | null>>;
};

const GenerateButton = ({ processingParams, setElectrodeSignal, neuronSignal }: GenerateButtonProps) => {

    const handleClick = async () => {
        if (!neuronSignal) {
            console.log("Need Neuron Signal To Process");
            // maybe react hot toast here 
            return;
        }
    
        const requestBody = {
            processingParams: processingParams,
            neuronSignal: neuronSignal
        };
    
        const response = await fetch('http://127.0.0.1:5000/process_signal', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(requestBody), 
        });
    
        const data = await response.json();
        
        // signal has an x and y component
        setElectrodeSignal(data);
    };


    

    return (
        <button onClick={handleClick} className="border border-black rounded-md px-6 py-2">
            Apply
        </button>
    );
};
