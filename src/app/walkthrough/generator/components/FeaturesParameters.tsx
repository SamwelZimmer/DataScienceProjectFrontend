"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { VscChevronLeft, VscChevronDown } from "react-icons/vsc";

import { FeaturesParams } from "../sections/FeaturesSection";

const reductionTypes = ["PCA", "UMAP", "tSNE", "Autoencoder"];

interface FeaturesParametersProps {
    featuresParams: FeaturesParams;
    setFeaturesParams: React.Dispatch<React.SetStateAction<FeaturesParams>>;
}

export default function FeaturesParameters({ featuresParams, setFeaturesParams }: FeaturesParametersProps) {

    return (
        <div className="flex flex-col gap-6">
            <div className="flex gap-6">
                <OptionsSelector 
                    text={"Clustering Model:"}
                    options={reductionTypes} 
                    unavailable={["UMAP", "tSNE", "Autoencoder"]}
                    featuresParams={featuresParams} 
                    setFeaturesParams={setFeaturesParams} 
                    name={"reduction_type"} 
                />
            </div>

            <div className="flex gap-6 items-center">               
                <SingleSlider 
                    text={"Components:"} 
                    name={"n_components"} 
                    min={2} 
                    max={10} 
                    initial={3}
                    featuresParams={featuresParams} 
                    setFeaturesParams={setFeaturesParams} 
                />
            </div>
        </div>

    );
}

interface SingleSliderProps {
    text: string;
    min: number;
    max: number;
    initial: number;
    name: string
    featuresParams: FeaturesParams;
    setFeaturesParams: React.Dispatch<React.SetStateAction<FeaturesParams>>;
}

const SingleSlider = ({ text, name, min, max, initial, featuresParams, setFeaturesParams }: SingleSliderProps) => {

    const [value, setValue] = useState(initial);

    useEffect(() => {
        setFeaturesParams({ ...featuresParams, [name]: value });
    }, [value]);

    return (
        <div className="flex w-max gap-3">
            <span className="text-left font-light opacity-50">{text}</span>
            <input 
                id="steps-range" 
                type="range" 
                min={min} 
                max={max} 
                value={value} 
                step="1" 
                onChange={(e) => setValue(Number(e.target.value))} 
                className="slider w-[150px] h-6 px-1 bg-gray-200 rounded-full appearance-none cursor-pointer" 
            />
            <span className="w-4 text-right">{value}</span>
        </div>    
    );
}

interface OptionsSelectorProps {
    options: string[];
    unavailable: string[];
    name: string;
    text: string;
    featuresParams: FeaturesParams;
    setFeaturesParams: React.Dispatch<React.SetStateAction<FeaturesParams>>;
}

const OptionsSelector = ({ options, unavailable=[""], name, text, featuresParams, setFeaturesParams }: OptionsSelectorProps) => {

    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [selection, setSelection] = useState(options[0]);    

    const variants = {
        enter: { opacity: 1, y: 0 },
        exit: { opacity: 0, y: "200%" },
    };

    useEffect(() => {
        setFeaturesParams({ ...featuresParams, [name]: selection.toLocaleLowerCase() });
    }, [selection]);
    
    return (
        <div className="relative gap-3 w-[300px]" onMouseEnter={() => setDropdownOpen(true)} onMouseLeave={() => setDropdownOpen(false)}>
            <motion.button className="hover:opacity-50 rounded-md flex items-center gap-3 w-full">
                <span className="pb-1 opacity-50 font-light">{text}</span>
                <span className="border-b pb-1 w-max">{selection}</span>
            </motion.button>

            <motion.div animate={dropdownOpen ? "enter" : "exit"} variants={variants} className={`${!dropdownOpen && "hidden"} w-32 absolute pt-3 right-32 z-10 shadow-md`}>
                <div className="p-3 w-full rounded-md bg-white border border-black flex flex-col gap-3 text-left">
                    {
                        options.map((option, index) => {
                            return (
                                <button 
                                    disabled={unavailable.includes(option)}
                                    onClick={() => setSelection(option)}
                                    key={index} 
                                    className={`${selection === option ? "opacity-50" : "hover:opacity-50" } ${unavailable.includes(option) && "line-through"} text-left`}>
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

