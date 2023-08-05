"use client"

import { useState } from "react";
import { motion } from "framer-motion";

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
    const [loading, setLoading] = useState(false);

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
            <div className="w-full h-full py-12 px-12 sm:px-0 flex flex-col gap-12 justify-center">

                <div className="w-full flex-col flex md:flex-row justify-center gap-12">
                    <ProcessingParameters processingParams={processingParams} setProcessingParams={setProcessingParams} />
                    <GenerateButton neuronSignal={signal} processingParams={processingParams} setElectrodeSignal={setElectrodeSignal} setLoading={setLoading} />
                </div>

                {/* horizontal divider */}
                <div className="flex flex-row gap-6 items-center justify-center w-full sm:w-[500px] mx-auto">
                    <hr className="w-1/3 h-px" />
                </div>

                {/* visualisation */}
                <div className="w-full h-full flex flex-col items-center justify-start gap-3 md:gap-6">
                    {
                        loading 
                        ? 
                        <div className="w-full h-full border border-dashed rounded-md flex flex-col items-center justify-center">
                            <span className="flex self-center mx-auto opacity-30">Loading...</span>
                        </div>
                        :
                        <>
                            {
                                signal 
                                ? 
                                <div className="flex w-full h-full items-center justify-center gap-6">
                                    <div className="hidden h-full sm:flex w-full flex-col gap-1">
                                        <span className="font-thin text-center">Neuron Output Signal</span>
                                        <NeuronSignalViewer signal={signal} />
                                    </div>
                                    <div className="w-full h-full flex flex-col gap-1">
                                        <span className="font-thin text-center">Example Recorded Electrode Signal</span>
                                        <NeuronSignalViewer signal={electrodeSignal} />
                                    </div>
                                </div>
                                :
                                <div className="w-full h-full border border-dashed rounded-md flex flex-col items-center justify-center">
                                    <span className="flex self-center mx-auto opacity-30 px-6 text-center">Press {"'"}Generate{"'"} to Test Neuron Parameters</span>
                                </div>
                            }
                        </>
                    }
                </div>
                
            </div>
        </>
    );
};

interface GenerateButtonProps {
    processingParams: ProcessingParams;
    neuronSignal: Signal | null;
    setElectrodeSignal: React.Dispatch<React.SetStateAction<Signal | null>>;
    setLoading: React.Dispatch<React.SetStateAction<boolean>>;
};

const GenerateButton = ({ processingParams, setElectrodeSignal, neuronSignal, setLoading }: GenerateButtonProps) => {

    const handleClick = async () => {

        setLoading(true);

        if (!neuronSignal) {
            console.log("Need Neuron Signal To Process");
            // maybe react hot toast here 
            return;
        }

        try {
            // store neuronParams in session storage
            sessionStorage.setItem('processingParams', JSON.stringify(processingParams));
        
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
        } catch (error: any) {
            // add react hot toast
            alert(`An error occurred: ${error.message}`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <section className="w-full px-12 sm:px-0 flex items-center justify-center">
            <motion.button 
                onClick={handleClick} 
                className="border border-black rounded-md px-6 py-2 shadow-md font-semibold"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
            >
                Apply
            </motion.button>
        </section>
    );
};
