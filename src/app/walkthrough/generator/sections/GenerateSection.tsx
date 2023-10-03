"use client"

import { RiNumber1, RiNumber2, RiNumber3 } from "react-icons/ri";
import { TbPointFilled } from "react-icons/tb";
import { motion } from "framer-motion";
import { FC, useEffect, useState } from "react";

import { Signal } from "../page";
import { DefaultSpinner } from "../../../../../components/Spinners";

export default function GenerateSection() {

    const [loading, setLoading] = useState(false);
    const [signalData, setSignalData] = useState(null);

    const handleClick = async () => {

        // get the chosen settings from the local storage
        let placements = sessionStorage.getItem('placements');
        let neuronParams = sessionStorage.getItem('neuronParams');
        let processingParams = sessionStorage.getItem('processingParams');
        
        if (!placements) {
            console.log("Need Grid Placements");
            // maybe react hot toast here 
            return;
        } else if (!neuronParams) {
            console.log("Need Neuron Parameters");
            // maybe react hot toast here 
            return;
        } else if (!processingParams) {
            console.log("Need Processing Parameters");
            // maybe react hot toast here 
            return;
        };

        placements = JSON.parse(placements);
        neuronParams = JSON.parse(neuronParams);
        processingParams = JSON.parse(processingParams);

        setLoading(true);
    
        const requestBody = {
            placements: placements,
            neuronParams: neuronParams,
            processingParams: processingParams,
        };
    
        const response = await fetch('http://127.0.0.1:5000/simulate', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(requestBody), 
        });
    
        if (!response.ok) {
            console.log("something went wrong")
            // toast.error("Something went wrong while simulating");
            setLoading(false);
            return;
        }
    
        const data = await response.json();
        setSignalData(data);

        // store recorded signals in session storage
        sessionStorage.setItem('recordedSignals', JSON.stringify(data));

        // update loading state
        setLoading(false);
    };

    return (
        <>
                <section className="w-full h-full sm:px-0 flex flex-col gap-6 justify-between py-12">
                    <div className="w-full sm:w-[600px] md:w-[700px] mx-auto flex flex-col gap-6 px-12">
                        <span className="font-thin">What you{"'"}ve done so far...</span>
                        <ul className="flex flex-col md:flex-row gap-3 md:gap-12 justify-center">
                            <ListItem Icon={RiNumber1} text={"You've placed the neurons and electrodes in a grid format."} />
                            <ListItem Icon={RiNumber2} text={"You chose the type and shape of the neuron signal."} />
                            <ListItem Icon={RiNumber3} text={"You selected the type of noise, attenuation and filtering to apply."} />
                        </ul>
                    </div>

                    <div className="bg-slate-200 border-y border-slate-800 w-full xs:h-[142px] py-6 px-12">
                        <div className="w-full h-full my-auto sm:w-[300px] mx-auto flex flex-row item-center justify-center gap-6">
                            {
                                loading ? 
                                
                                <>
                                    <p className="flex flex-col item-center justify-center">
                                        <span>Simulating...</span>
                                    </p>
                                    <div className="h-12 my-auto">
                                        <DefaultSpinner fill="fill-slate-600" bg="text-white" />
                                    </div>
                                </>

                                :
                                
                                <>
                                    <p className="flex flex-col item-center justify-center">
                                        <span className="opacity-50 text-sm">What to do now?</span>
                                        <span>Simulate neuron activation and electrode recording</span>
                                    </p>
                                    <motion.button 
                                        whileHover={{ scale: 1.05 }} 
                                        whileTap={{ scale: 0.95 }} 
                                        className="border bg-slate-800 text-slate-200 rounded-md px-6 py-1 h-min my-auto"
                                        onClick={handleClick}
                                    >
                                        Generate
                                    </motion.button>
                                </>

                            }

                        </div>
                    </div>

                    <div className="w-full sm:w-[600px] md:w-[700px] mx-auto flex flex-col gap-6 px-12">
                        <span className="font-thin">What{"'"}s to come...</span>
                        <ul className="flex flex-col md:flex-row gap-3 md:gap-12 justify-center">
                            <ListItem Icon={TbPointFilled} text={"Next, we'll identify the spikes and extract the waveforms from each electrode signal."} />
                            <ListItem Icon={TbPointFilled} text={"Then, the features of these waveforms will be extracted into a vectorised format."} />
                            <ListItem Icon={TbPointFilled} text={"We'll finish up by grouping these vectorised spikes by their neuron of origin and predicting their positions."} />
                        </ul>
                    </div>
                </section>
        </>
    );
}

interface ListItemProps {
    Icon: FC<{ size: number }>;
    text: string;
  }

const ListItem = ({ Icon, text }: ListItemProps) => {
    return (
        <div className="flex flex-row md:flex-col items-center w-full md:w-[200px] text-left md:text-center gap-3">
            <span className="text-slate-700 opacity-30">
                <Icon size={20} />
            </span>
            <p className="text-sm">{text}</p>
        </div>
    );
}
