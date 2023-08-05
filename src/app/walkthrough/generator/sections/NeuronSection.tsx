"use client"

import { useState } from "react";
import { motion } from "framer-motion";

import NeuronParameters from "../components/NeuronParameters";
import NeuronSignalViewer from "../components/NeuronSignalViewer";
import { Signal } from "../page";

interface NeuronSectionProps {
    signal: Signal | null;
    setSignal: React.Dispatch<React.SetStateAction<Signal | null>>;
}

export default function NeuronSection({ signal, setSignal }: NeuronSectionProps) {

    const [loading, setLoading] = useState(false);

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
            <div className="w-full h-full py-12 px-12 sm:px-0 flex flex-col gap-12 justify-center">

                <div className="w-full flex-col flex md:flex-row justify-center gap-12">
                    <NeuronParameters neuronParams={neuronParams} setNeuronParams={setNeuronParams} />
                    <NeuronSignalGenerator neuronParams={neuronParams} setSignal={setSignal} setLoading={setLoading} />
                </div>

                {/* horizontal divider */}
                <div className="flex flex-row gap-6 items-center justify-center w-full sm:w-[500px] mx-auto">
                    <hr className="w-1/3 h-px" />
                </div>

                {/* <div className="w-full h-full flex flex-col items-center justify-start gap-3 md:gap-6">
                    <NeuronSignalViewer signal={signal}  />
                </div> */}

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
                                <NeuronSignalViewer signal={signal}  />
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

interface NeuronSignalGeneratorProps {
    setSignal: React.Dispatch<React.SetStateAction<Signal | null>>;
    neuronParams: object;
    setLoading: React.Dispatch<React.SetStateAction<boolean>>;
}

function NeuronSignalGenerator({ setSignal, neuronParams, setLoading }: NeuronSignalGeneratorProps) {

    const handleClick = async () => {

        setLoading(true);

        try {
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
        } catch (error: any) {
            // add react hot toast
            alert(`An error occurred: ${error.message}`);
        } finally {
            setLoading(false);
        }

    };
    
    return (
        <>
            <section className="w-full px-12 sm:px-0 flex items-center justify-center">
                <motion.button 
                    onClick={handleClick} 
                    className="border border-black rounded-md px-6 py-2 shadow-md font-semibold"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                >
                    Generate
                </motion.button>
            </section>
        </>
    );
};