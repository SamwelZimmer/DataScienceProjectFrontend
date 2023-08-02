"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { VscChevronLeft, VscChevronDown } from "react-icons/vsc";

import { ClusteringParams } from "../sections/ClusteringSection";

const reductionTypes = ["GMM", "KNN", "t-Dist"];
const ktypes = ["Manual", "BIC"];

interface ClusteringParametersProps {
    clusteringParams: ClusteringParams;
    setClusteringParams: React.Dispatch<React.SetStateAction<ClusteringParams>>;
}

export default function ClusteringParameters({ clusteringParams, setClusteringParams }: ClusteringParametersProps) {

    const reductionData =  JSON.parse(sessionStorage.getItem('reductionData') || "[]");
    const placements =  JSON.parse(sessionStorage.getItem('placements') || "[]");

    function countOccurrences(array: number[], value: number): number {
        return array.filter(num => num === value).length;
    }
    

    // set initial value to the number of neuron on the grid
    let initial_k = countOccurrences(placements, 1);
    if (initial_k === 0) {
        initial_k = 1;
    }

    // set maximum to the number of spikes
    let max_k = reductionData["quantities"]["n_spikes"];

    return (
        <div className="flex flex-col gap-6">
            <div className="flex gap-6">
                <OptionsSelector 
                    text={"Clustering Model:"}
                    options={reductionTypes} 
                    unavailable={["KNN", "t-Dist"]}  
                    clusteringParams={clusteringParams} 
                    setClusteringParams={setClusteringParams} 
                    name={"cluster_type"} 
                />
            </div>

            <div className="flex gap-6 items-center">               
                <OptionsSelector 
                    text={"Number of Clusters:"}
                    options={ktypes} unavailable={[]}  
                    clusteringParams={clusteringParams} 
                    setClusteringParams={setClusteringParams} 
                    name={"k_type"} 
                />
            </div>

            <div className="flex gap-6 items-center">               
                <SingleSlider 
                    text={"K:"} 
                    name={"k"} 
                    min={1} 
                    max={max_k} 
                    initial={initial_k}
                    clusteringParams={clusteringParams} 
                    setClusteringParams={setClusteringParams}  
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
    clusteringParams: ClusteringParams;
    setClusteringParams: React.Dispatch<React.SetStateAction<ClusteringParams>>;
}

const SingleSlider = ({ text, name, min, max, initial, clusteringParams, setClusteringParams }: SingleSliderProps) => {

    const [value, setValue] = useState(initial);

    useEffect(() => {
        setClusteringParams({ ...clusteringParams, [name]: value });
    }, [value]);

    return (
        <div className="flex w-max gap-3">
            <span className="text-left font-light opacity-50">{text}</span>
            <input 
                disabled={clusteringParams["k_type"] !== "manual"} 
                id="steps-range" 
                type="range" 
                min={min} 
                max={max} 
                value={value} 
                step="1" 
                onChange={(e) => setValue(Number(e.target.value))} 
                className="w-[150px] h-6 px-1 bg-gray-200 rounded-full appearance-none cursor-pointer" 
            />
            <span className="w-4 text-right">{clusteringParams["k_type"] === "manual" ? value : "N/A"}</span>
        </div>    
    );
}

interface OptionsSelectorProps {
    options: string[];
    unavailable: string[];
    name: string
    text: string;
    clusteringParams: ClusteringParams;
    setClusteringParams: React.Dispatch<React.SetStateAction<ClusteringParams>>;
}

const OptionsSelector = ({ options, unavailable=[""], name, clusteringParams, setClusteringParams, text }: OptionsSelectorProps) => {

    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [selection, setSelection] = useState(options[0]);    

    const variants = {
        enter: { opacity: 1, y: 0 },
        exit: { opacity: 0, y: "200%" },
    };

    useEffect(() => {
        setClusteringParams({ ...clusteringParams, [name]: selection.toLocaleLowerCase() });
    }, [selection]);
    
    return (
        <div className="relative gap-3 w-[300px]" onMouseEnter={() => setDropdownOpen(true)} onMouseLeave={() => setDropdownOpen(false)}>
            <motion.button className="hover:opacity-50 rounded-md flex items-center gap-3 w-full">
                <span className="pb-1 opacity-50 font-light">{text}</span>
                <span className="border-b pb-1 w-max">{selection}</span>
            </motion.button>

            <motion.div animate={dropdownOpen ? "enter" : "exit"} variants={variants} className={`${!dropdownOpen && "hidden"} w-32 absolute pt-3 right-14 z-10 shadow-md`}>
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