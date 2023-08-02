"use client"

import { Component, useEffect, useState } from "react";
import { motion } from 'framer-motion';
import { VscChevronLeft, VscChevronDown } from "react-icons/vsc";

import FeaturesParameters from "../components/FeaturesParameters";
import ClusterPlot from "../components/ClusterPlot";

export interface FeaturesParams {
    reduction_type: string;
    n_components: number;
}

export default function FeaturesSection() {

    const [clusterData, setClusterData] = useState(null);
    const [loading, setLoading] = useState(false);

    const [featuresParams, setFeaturesParams] = useState({
        reduction_type: 'pca',
        n_components: 3,
    });

    return (
        <>
            <h1 className="text-4xl font-semibold px-12 sm:px-0">Dimensionality Reduction</h1>
    
            <div className="w-full h-full py-12 px-12 sm:px-0 flex flex-col gap-12 justify-center">

                <div className="w-full flex-col flex md:flex-row justify-center gap-12">
                    <FeaturesParameters featuresParams={featuresParams} setFeaturesParams={setFeaturesParams} />
                    <DimensionalReductionGenerator featuresParams={featuresParams} setClusterData={setClusterData} setLoading={setLoading} />
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
                                clusterData ? 
                                    <Plots clusterData={clusterData} />
                                :
                                    <div className="w-full h-full border border-dashed rounded-md flex flex-col items-center justify-center">
                                        <span className="flex self-center mx-auto opacity-30">Press {"'"}Reduce{"'"} to Generate Plots</span>
                                </div>
                            }
                        </>
                    }
                </div>

            </div>
        </>
    );
};

interface PlotsProps {
    clusterData:  | null;
}

const Plots = ({ clusterData }: PlotsProps) => {

    const [x1Component, setX1Component] = useState("component_1");
    const [x2Component, setX2Component] = useState("component_2");

    let componentNames: string[] = [];
    let electrodeNames: string[] = [];
    if (clusterData) {
        electrodeNames = Object.keys(clusterData).filter(key => key !== 'quantities');
        componentNames = Object.keys(clusterData[Object.keys(clusterData)[0]]["points"]);
    };    

    return (
        <div className="w-full flex items-center gap-6">
            {
                electrodeNames && clusterData
                ? 
                <div className="flex flex-col w-full mx-auto gap-6">
                    <div className="flex flex-col md:flex-row mx-auto gap-3 md:gap-12">
                        <UnderlineDropdown text={"X1:"} options={componentNames} component={x1Component} setComponent={setX1Component} />
                        <UnderlineDropdown text={"X2:"} options={componentNames} component={x2Component} setComponent={setX2Component} />
                    </div>
                    <div className="w-full flex flex-row gap-12 overflow-scroll hidden-scrollbar border-r border-dashed pr-12">
                        {
                            electrodeNames.map((electrodeName, key) => {
                                return (
                                    <div key={key} className="flex flex-col w-full">
                                        <span className="font-thin mx-auto">Electrode {key + 1}</span>
                                        <div className="w-[200px] aspect-square flex flex-col text-center mx-auto">
                                            <ClusterPlot x={clusterData[electrodeName]["points"][x1Component]} y={clusterData[electrodeName]["points"][x2Component]} titles={["X1 (a.u.)", "X2 (a.u.)"]} />
                                        </div>
                                    </div>
                                );
                            })
                        }
                    </div>
                </div>

                :
                <span className="font-semibold self-center mx-auto">Press {"'"}Reduce{"'"} to Generate Plots</span>
            }
        </div>
    );
}

interface UnderlineDropdown {
    text: string;
    options: string[];
    component: string;
    setComponent: React.Dispatch<React.SetStateAction<string>>;
}

const UnderlineDropdown = ({ text, options, component, setComponent }: UnderlineDropdown) => {

    const [dropdownOpen, setDropdownOpen] = useState(false);

    const variants = {
        enter: { opacity: 1, y: 0 },
        exit: { opacity: 0, y: "200%" },
    };

    const activeIndex = options.indexOf(component)

    const formattedOptions = options.map(option => 
        option.split('_')  
            .map(word => word.charAt(0).toUpperCase() + word.slice(1)) 
            .join(' ')
    );

    return (
        <div className="relative gap-3 w-full" onMouseEnter={() => setDropdownOpen(true)} onMouseLeave={() => setDropdownOpen(false)}>
            <motion.button className="hover:opacity-50 rounded-md px-6 flex items-center justify-between gap-3 w-full">
                <span className="pb-1 opacity-50">{text}</span>
                <span className="border-b pb-1 w-32">{formattedOptions[activeIndex]}</span>
                {/* { dropdownOpen ? <VscChevronLeft size={25} /> : <VscChevronDown size={25} /> } */}
            </motion.button>

            <motion.div animate={dropdownOpen ? "enter" : "exit"} variants={variants} className={`${!dropdownOpen && "hidden"} w-max absolute pt-3 right-6 z-10 shadow-md`}>
                <div className="p-3 w-full max-h-48 overflow-y-auto rounded-md bg-white border border-black flex flex-col gap-3 text-left hidden-scrollbar">
                    {
                        options.map((option, index) => {

                            return (
                                <button 
                                    onClick={() => setComponent(option)}
                                    key={index} 
                                    className={`${component === option ? "opacity-50" : "hover:opacity-50" } text-left`}>
                                    {formattedOptions[index]}
                                </button>
                            )
                        })
                    }
                </div>
            </motion.div>
        </div>
    );
}

interface DimensionalReductionGeneratorProps {
    featuresParams: object;
    setClusterData: React.Dispatch<React.SetStateAction< | null>>;
    setLoading: React.Dispatch<React.SetStateAction<boolean>>;
}

function DimensionalReductionGenerator({ featuresParams, setClusterData, setLoading }: DimensionalReductionGeneratorProps) {

    const handleClick = async () => {

        setLoading(true);

        try {
            // store neuronParams in session storage
            sessionStorage.setItem('featuresParams', JSON.stringify(featuresParams));

            // get the waveforms from storage
            let waveforms = sessionStorage.getItem('waveforms');

            const requestBody = {
                featuresParams: featuresParams,
                waveforms: waveforms
            };

            const response = await fetch('http://127.0.0.1:5000/reduce', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(requestBody), 
            });

            if (!response.ok) {
                // add react hot toast
                throw new Error(`HTTP error! status: ${response.status}`);
            }
    
            const data = await response.json();
    
            // signal has an x and y component
            setClusterData(data);

            sessionStorage.setItem('reductionData', JSON.stringify(data));

        } catch (error: any) {
            // add react hot toast
            alert(`An error occurred: ${error.message}`);
        } finally {
            setLoading(false);
        }
    
    };
    
    return (
        <>
            <section className="mx-auto px-12 sm:px-0 flex items-center justify-center">
                <motion.button 
                    onClick={handleClick} 
                    className="border border-black rounded-md px-6 py-2 shadow-md font-semibold"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                >
                    Reduce
                </motion.button>            
            </section>
        </>
    );
};