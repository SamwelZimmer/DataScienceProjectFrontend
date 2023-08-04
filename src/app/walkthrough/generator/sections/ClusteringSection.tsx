"use client"

import { Component, useEffect, useState } from "react";
import { motion } from 'framer-motion';

import ClusterPlot from "../components/ClusterPlot";
import WaveformPlot from "../components/WaveformPlot";
import SpikeTrainPlot from "../components/SpikeTrainPlot";
import ClusteringParameters from "../components/ClusteringParameters";
import { Waveform, ElectrodeWaveformInfo } from "./ExtractionSection";

export interface ClusteringParams {
    cluster_type: string;
    k_type: string;
    k: number;
}

export default function ClusteringSection() {

    const [clusterData, setClusterData] = useState(null);
    const [loading, setLoading] = useState(false);

    const [clusteringParams, setClusteringParams] = useState({
        cluster_type: 'gmm',
        k_type: "manual",
        k: 2,
    });

    return (
        <>    
            <div className="w-full h-full py-12 px-12 sm:px-0 flex flex-col gap-12 justify-center">

                <div className="w-full flex-col flex md:flex-row justify-center gap-12">
                    <ClusteringParameters clusteringParams={clusteringParams} setClusteringParams={setClusteringParams} />
                    <ClusterGenerator clusteringParams={clusteringParams} setClusterData={setClusterData} setLoading={setLoading} />
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
                                        <span className="flex self-center mx-auto opacity-30">Press {"'"}Cluster{"'"} to Generate Plots</span>
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

    const options = ["Dimension Reduction", "Waveforms", "Spike Trains"]

    const [plotType, setPlotType] = useState(options[0]);
    const [dropdownOpen, setDropdownOpen] = useState(false);

    const [x1Component, setX1Component] = useState("component_1");
    const [x2Component, setX2Component] = useState("component_2");

    // getting data for the scatter plots
    const reductionDataStr = sessionStorage.getItem('reductionData');
    const reductionData = reductionDataStr ? JSON.parse(reductionDataStr) : null;

    let componentNames: string[] = [];
    let electrodeNames: string[] = [];
    if (reductionData) {
        electrodeNames = Object.keys(reductionData).filter(key => key !== 'quantities');
        componentNames = Object.keys(reductionData[Object.keys(reductionData)[0]]["points"]);
    };

    // getting data for the waveform plots
    const waveformsStr = sessionStorage.getItem('waveforms');
    const allWaveforms: Waveform[][] = waveformsStr ? JSON.parse(waveformsStr) : [];

    // getting and reformatting data for the spike train plots
    const time = JSON.parse(sessionStorage.getItem('recordedSignals') || "[]")["time"];
    const allWaveformInfoStr = sessionStorage.getItem('waveform_info');
    const allWaveformInfo: ElectrodeWaveformInfo[] = allWaveformInfoStr ? JSON.parse(allWaveformInfoStr) : [];

    function createArray(length: number, start: number, end: number) {
        const step = (end - start) / (length - 1);
        return Array.from({length}, (_, i) => (start + i * step) / 25000);
    }

    let allAllPoints: number[][][][] = [];
    for (let j = 0; j < allWaveformInfo.length; j++) {
        let waveformInfo = allWaveformInfo[j];
        let allPoints: number[][][] = [];
        for (let i = 0; i < waveformInfo.length; i++) {
            let waveformLength = waveformInfo[i]["values"].length;
            let xArr = createArray(waveformLength, waveformInfo[i]["spike_start"], waveformInfo[i]["spike_end"]);
            let yArr = waveformInfo[i]["values"];
            let points = xArr.map((x, idx) => [x, yArr[idx]]);
            allPoints.push(points);
        }
        allAllPoints.push(allPoints);
    }

    // for the animated dropdown
    const variants = {
        enter: { opacity: 1, y: 0 },
        exit: { opacity: 0, y: "200%" },
    };
    

    return (

        <div className="w-full h-full flex flex-col gap-6">
            
            {/* plot type selector */}
            <div className="flex w-max items-center gap-12">
                <div className="relative gap-3 w-full" onMouseEnter={() => setDropdownOpen(true)} onMouseLeave={() => setDropdownOpen(false)}>
                    <motion.button className="hover:opacity-50 rounded-md flex items-center justify-between gap-3 w-full">
                        <span className="pb-1 font-light opacity-50">Plot Type:</span>
                        <span className="border-b pb-1 w-max">{plotType}</span>
                    </motion.button>

                    <motion.div animate={dropdownOpen ? "enter" : "exit"} variants={variants} className={`${!dropdownOpen && "hidden"} w-max absolute pt-3 left-6 z-10 shadow-md`}>
                        <div className="p-3 w-full rounded-md bg-white border border-black flex flex-col gap-3 text-left">
                            {
                                options.map((option, index) => {
                                    return (
                                        <button 
                                            onClick={() => setPlotType(option)}
                                            key={index} 
                                            className={`${plotType === option ? "opacity-50" : "hover:opacity-50" } text-left`}>
                                            {option}
                                        </button>
                                    )
                                })
                            }
                        </div>
                    </motion.div>
                </div>
            </div>

            {/* reduction scatterm plots */}
            {   plotType === options[0] &&

                <div className="flex flex-col w-full mx-auto gap-6">
                    {/* <div className="flex flex-col md:flex-row mx-auto gap-3 md:gap-12">
                        <UnderlineDropdown text={"X1:"} options={componentNames} component={x1Component} setComponent={setX1Component} />
                        <UnderlineDropdown text={"X2:"} options={componentNames} component={x2Component} setComponent={setX2Component} />
                    </div> */}
                    <div className="flex flex-col w-full mx-auto gap-6">
                        <div className="w-full flex flex-row gap-12 overflow-x-auto whitespace-nowrap border-r border-dashed pr-12 hidden-scrollbar">
                            {
                                electrodeNames.map((electrodeName, key) => {
                                    return (
                                        <div key={key} className="h-48 aspect-2/1 flex-none mb-6 flex justify-center">
                                            <div className="aspect-square">
                                                <span className="w-full flex justify-center font-thin">Electrode {key + 1}</span>
                                                <ClusterPlot x={reductionData[electrodeName]["points"][x1Component]} y={reductionData[electrodeName]["points"][x2Component]} labels={clusterData ? clusterData["predicted_labels"] : false} titles={["X1 (a.u.)", "X2 (a.u.)"]} />
                                            </div>
                                        </div>
                                    );
                                })
                            }
                        </div>
                    </div>
                </div>
            }
            
            {/* waveforms */}
            {
                plotType === options[1] &&

                <div className="flex flex-col w-full mx-auto gap-6">
                    <div className="w-full flex flex-row gap-12 overflow-x-auto whitespace-nowrap border-r border-dashed pr-12 hidden-scrollbar">
                        {
                            allWaveforms.map((_, i) => (
                                <div key={i} className="h-48 w-48 flex-none mb-6">
                                    <span className="w-full flex justify-center font-thin">Electrode {i + 1}</span>
                                    { allWaveforms && <WaveformPlot waveforms={allWaveforms[i]} labels={clusterData ? clusterData["predicted_labels"] : false} titles={["Time (ms)", "Potential (mV)"]} />}
                                </div>
                            ))
                        }  
                    </div>
                </div>
            }

            {/* spike trains */}
            {
                plotType === options[2] &&

                <div className="flex flex-col w-full mx-auto gap-6">
                    <div className="w-full flex flex-row gap-12 overflow-x-auto whitespace-nowrap border-r border-dashed pr-12 hidden-scrollbar">
                        {
                            allAllPoints.map((_, i) => (
                                <div key={i} className="h-48 aspect-2/1 flex-none mb-6 flex justify-center">
                                    <div className="h-32 my-auto">
                                        <span className="w-full flex justify-center font-thin">Electrode {i + 1}</span>
                                        { allWaveforms && <SpikeTrainPlot data={allAllPoints[i]} labels={clusterData ? clusterData["predicted_labels"] : false} time={time} titles={["Time (ms)", "Potential (mV)"]} />}
                                    </div>
                                </div>
                            ))
                        }  
                    </div>
                </div>
            }
        </div>


    );
}

interface ClusterGeneratorProps {
    clusteringParams: ClusteringParams;
    setClusterData:React.Dispatch<React.SetStateAction< | null>>;
    setLoading:React.Dispatch<React.SetStateAction<boolean>>;
}

function ClusterGenerator({ clusteringParams, setClusterData, setLoading }: ClusterGeneratorProps) {

    const handleClick = async () => {
        setLoading(true);
    
        try {
            // store clusteringParams in session storage
            sessionStorage.setItem('clusteringParams', JSON.stringify(clusteringParams));
    
            // get the dimensionally reduced data from storage
            let reductionData = sessionStorage.getItem('reductionData');
    
            const requestBody = {
                clusteringParams: clusteringParams,
                reductionData: reductionData
            };
    
            const response = await fetch('http://127.0.0.1:5000/cluster', {
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

            sessionStorage.setItem('predictedLabels', JSON.stringify(data["predicted_labels"]));

            // signal has an x and y component
            setClusterData(data);
    
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
                    Cluster
                </motion.button>
            </section>
        </>
    );
};