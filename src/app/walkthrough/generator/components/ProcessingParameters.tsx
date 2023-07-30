"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { VscChevronLeft, VscChevronDown } from "react-icons/vsc";

import { ProcessingParams } from "../sections/ProcessingSection";

const decayTypes = ["Square", "Linear", "Exponential", "Inverse"];
const noiseTypes = ["None", "Gaussian"];
const filterTypes = ["None", "Bandpass"];

interface ProcessingParametersProps {
    processingParams: ProcessingParams;
    setProcessingParams: React.Dispatch<React.SetStateAction<ProcessingParams>>;
}

export default function ProcessingParameters({ processingParams, setProcessingParams}: ProcessingParametersProps) {

    return (
        <div className="flex flex-col gap-6 items-center justify-center">
            <div className="flex flex-col gap-1">
                <span className="font-thin text-center">Decay Parameters</span>
                <div className="flex flex-col gap-3">
                    <OptionsSelector options={decayTypes} unavailable={["Linear", "Exponential", "Inverse"]}  processingParams={processingParams} setProcessingParams={setProcessingParams} name={"decay_type"} />
                    <SingleSlider text={"Rate"} min={0.1} max={5} initial={2}  processingParams={processingParams} setProcessingParams={setProcessingParams} name={"decay_rate"} />
                </div>
            </div>

            <div className="flex flex-col gap-1">
                <span className="font-thin text-center">Noise Parameters</span>
                <div className="flex flex-col gap-3">
                    <OptionsSelector options={noiseTypes} unavailable={[""]}  processingParams={processingParams} setProcessingParams={setProcessingParams} name={"noise_type"} />
                    <SingleSlider text={'\u03C3'} min={0.1} max={5} initial={2}  processingParams={processingParams} setProcessingParams={setProcessingParams} name={"noise_std"} />
                </div>
            </div>

            <div className="flex flex-col gap-1">
                <span className="font-thin text-center">Filtering Parameters</span>
                <div className="flex flex-col gap-3">
                    <OptionsSelector options={filterTypes} unavailable={[""]}  processingParams={processingParams} setProcessingParams={setProcessingParams} name={"filter_type"} />
                    <DualRangeSlider text={["Low", "High"]} min={[0, 2000]} max={[2000, 9000]} initial={[500, 3000]}  processingParams={processingParams} setProcessingParams={setProcessingParams} name={["low", "high"]}  />
                </div>
            </div>
        </div>
    );
}

interface OptionsSelectorProps {
    options: string[];
    unavailable: string[];
    name: string
    processingParams: ProcessingParams;
    setProcessingParams: React.Dispatch<React.SetStateAction<ProcessingParams>>;
}

const OptionsSelector = ({ options, unavailable=[""], name, processingParams, setProcessingParams }: OptionsSelectorProps) => {

    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [selection, setSelection] = useState(options[0]);    

    const variants = {
        enter: { opacity: 1, y: 0 },
        exit: { opacity: 0, y: "200%" },
    };

    useEffect(() => {
        setProcessingParams({ ...processingParams, [name]: selection.toLocaleLowerCase() });
    }, [selection]);
    
    return (
        <div className="relative gap-3 w-full" onMouseEnter={() => setDropdownOpen(true)} onMouseLeave={() => setDropdownOpen(false)}>
        <motion.button className="border border-black hover:opacity-50 rounded-md px-6 py-1 flex items-center justify-between gap-3 w-full">
            <span className="">{selection}</span>
            { dropdownOpen ? <VscChevronLeft size={25} /> : <VscChevronDown size={25} /> }
        </motion.button>

        <motion.div animate={dropdownOpen ? "enter" : "exit"} variants={variants} className={`${!dropdownOpen && "hidden"} w-full absolute pt-3 right-0 z-10 shadow-md`}>
            <div className="p-3 w-full rounded-md bg-white border border-black flex flex-col gap-3 text-left">
                {
                    options.map((option, index) => {
                        return (
                            <button 
                                disabled={unavailable.includes(option)}
                                onClick={() => setSelection(option)}
                                key={index} 
                                className={`${selection === option ? "opacity-50" : "hover:opacity-50" } text-left`}>
                                {option}
                            </button>
                        )
                    })
                }
            </div>
        </motion.div>
    </div>
    );
}

interface SingleSliderProps {
    text: string;
    min: number;
    max: number;
    initial: number
    name: string
    processingParams: ProcessingParams;
    setProcessingParams: React.Dispatch<React.SetStateAction<ProcessingParams>>;
}

const SingleSlider = ({ text, name, min, max, initial, processingParams, setProcessingParams }: SingleSliderProps) => {

    const [value, setValue] = useState(initial);

    useEffect(() => {
        setProcessingParams({ ...processingParams, [name]: value });
    }, [value]);

    return (
        <div className="flex items-center justify-between w-max mx-auto gap-3">
            <span className="w-8 text-left">{text}</span>
            <input id="steps-range" type="range" min={min} max={max} value={value} step="0.1" onChange={(e) => setValue(Number(e.target.value))} className="w-[150px] h-6 px-1 bg-gray-200 rounded-full appearance-none cursor-pointer" />
            <span className="w-8 text-right">{value}</span>
        </div>    
    );
}

interface DualRangeSliderProps {
    text: string[];
    min: number[];
    max: number[];
    initial: number[];
    name: string[];
    processingParams: ProcessingParams;
    setProcessingParams: React.Dispatch<React.SetStateAction<ProcessingParams>>;
}

function DualRangeSlider({ text, name, min, max, initial, processingParams, setProcessingParams }: DualRangeSliderProps) {

    const [value1, setValue1] = useState(initial[0]);
    const [value2, setValue2] = useState(initial[1]);

    useEffect(() => {
        setProcessingParams(prevParams => ({
            ...prevParams,
            [name[0]]: value1,
            [name[1]]: value2,
        }));
    }, [value1, value2]);

    return (
        <>
            <div className="flex items-center justify-between w-max mx-auto gap-3">
                <span className="w-8 text-left">{text[0]}</span>
                <input id="steps-range" type="range" min={min[0]} max={max[0]} value={value1} step="1" onChange={(e) => setValue1(Number(e.target.value))} className="w-[150px] h-6 px-1 bg-gray-200 rounded-full appearance-none cursor-pointer" />
                <span className="w-8 text-right">{value1}</span>
            </div>  
            <div className="flex items-center justify-between w-max mx-auto gap-3">
                <span className="w-8 text-left">{text[1]}</span>
                <input id="steps-range" type="range" min={min[1]} max={max[1]} value={value2} step="1" onChange={(e) => setValue2(Number(e.target.value))} className="w-[150px] h-6 px-1 bg-gray-200 rounded-full appearance-none cursor-pointer" />
                <span className="w-8 text-right">{value2}</span>
            </div>  
        </>
  
    );
}
