"use client"

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { VscChevronLeft, VscChevronRight } from "react-icons/vsc";
import { BsDashLg, BsDash } from "react-icons/bs";

import SingleStaticSignalPlot from "../components/SingleStaticSignalPlot";
import WaveformPlot from "../components/WaveformPlot";
import SpikeTrainPlot from "../components/SpikeTrainPlot";
import StackedSpikeTrainPlot from "../components/StackedSpikeTrainPlot";

interface ExtractionParams {
    thresholdMultiplier: number;
    waveformDuration: number;
};

interface WaveformInfo {
    highest_value: number;
    lowest_value: number;
    spike_end: number;
    spike_start: number;
    values: number[];
};

export type ElectrodeWaveformInfo = WaveformInfo[];

type AllWaveformInfo = ElectrodeWaveformInfo[];

// a single waveform, represented as an array of points
export type Waveform = number[];

export default function ExtractionSection() {

    const [activeIndex, setActiveIndex] = useState(0);
    const [activeSignal, setActiveSignal] = useState(null);
    const [showSpiketrain, setShowSpiketrain] = useState(false);
    const [allWaveforms, setAllWaveforms] = useState<Waveform[][] | null>(null);
    const [allWaveformInfo, setAllWaveformInfo] = useState<AllWaveformInfo | null>(null);
    const [threshold, setThreshold] = useState<boolean | number>(false);
    const [extractionParams, setExtractionParams] = useState({
        thresholdMultiplier: 4,
        waveformDuration: 0.3
    });

    const time = JSON.parse(sessionStorage.getItem('recordedSignals') || "[]")["time"];

    useEffect(() => {
        let recordedSignals = JSON.parse(sessionStorage.getItem('recordedSignals') || "[]");
        setActiveSignal(recordedSignals["signals"][activeIndex]);
    }, [activeIndex]);

    useEffect(() => {
        if (activeSignal) {
            handleThresholdChange().then((res) => setThreshold(res))
            .catch(err => console.error(err));
        }
    }, [extractionParams, activeIndex]);

    const handleThresholdChange = async () => {    
        const requestBody = {
            signal: activeSignal,
            thresholdMultiplier: extractionParams["thresholdMultiplier"]
        };
    
        const response = await fetch('http://127.0.0.1:5000/threshold_value', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(requestBody), 
        });
    
        const data = await response.json();
        
        return data.threshold;
    };

    return (
        <>
            <section className="flex flex-col justify-center gap-6 w-full h-full px-12 sm:px-0">

                {/* buttons to change active signal */}
                <ActiveIndexButtons activeIndex={activeIndex} setActiveIndex={setActiveIndex} />

                {/* individual electrode recording with horizontal line */}
                { activeSignal && 
                    <div className="w-full">
                        <div className="h-[150px] w-full flex flex-col text-center">
                            <span className="font-thin">Electrode {activeIndex + 1}</span>
                            <SingleStaticSignalPlot signal={activeSignal} time={time} windowSize={time.length} yLine={threshold} labels={["Time (s)", "Potential (mV)"]} />
                        </div>
                    </div>
                }

                <div className="flex flex-col md:flex-row item-center justify-around w-full mx-auto gap-6 md:gap-0">
                    {/* toggle to change threshold value */}
                    <div className="w-max flex items-center mx-auto md:mx-0">
                        <SingleSlider text={"Multiplier"} name={"thresholdMultiplier"} min={1} max={6} initial={4} extractionParams={extractionParams} setExtractionParams={setExtractionParams} />
                    </div>
                    
                    {/* button to extract spikes */}
                    <div className="w-max mx-auto md:mx-0">
                        <ExtractButton extractionParams={extractionParams} setAllWaveforms={setAllWaveforms} setAllWaveformInfo={setAllWaveformInfo} />
                    </div>
                </div>

                <div className="w-full flex gap-6 items-center mx-auto justify-center">
                    <hr className="w-32 h-px  bg-gray-200 border-0 rounded" />
                    <span className="font-thin w-max">Waveforms</span>
                    <hr className="w-32 h-px  bg-gray-200 border-0 rounded" />
                </div>
                
                {/* large screens */}
                <div className="hidden md:flex flex-row items-center justify-between gap-12">
                    {/* individual spike waveform viewer */}
                    <div className="h-48 w-48">
                        { allWaveforms && <WaveformPlot waveforms={allWaveforms[activeIndex]} titles={["Time (ms)", "Potential (mV)"]} />}
                    </div>
                    
                    {/* individual spike train viewer */}
                    <div className="h-[100px]">
                        { allWaveformInfo && <SpikeTrain waveformInfo={allWaveformInfo[activeIndex]} time={time} titles={["Time (s)", "Potential (mV)"]} /> }
                    </div>

                    {/* this doesnt work yet */}
                    {/* <div className="h-full bg-red-200">
                        { allWaveformInfo && <StackedSpikeTrain allWaveformInfo={allWaveformInfo} time={time} /> }
                    </div> */}
                </div>
                
                {/* small screens */}
                <div className="flex md:hidden flex-col mx-auto gap-3">
                    <motion.button onClick={() => setShowSpiketrain(!showSpiketrain)} className="w-[175px] mx-auto border-b pb-1 text-center">
                        { showSpiketrain ? "Show Waveforms" : "Show Spike Train" }
                    </motion.button>

                    <div className="h-48 flex justify-center items-center">
                        {
                            showSpiketrain 
                            ? 
                            <div className="h-[100px] w-full">
                                { allWaveformInfo && <SpikeTrain waveformInfo={allWaveformInfo[activeIndex]} time={time} titles={["Time (s)", "Potential (mV)"]} /> }
                            </div>
                            :
                            <div className="w-48 h-full">
                                { allWaveforms && <WaveformPlot waveforms={allWaveforms[activeIndex]} titles={["Time (ms)", "Potential (mV)"]} />}
                            </div>
                        }
                    </div>


                </div>

            </section>
        </>
    );
}

interface StackedSpikeTrainProps {
    allWaveformInfo: AllWaveformInfo | null;
    time: number[];
    titles: string[];
}

const StackedSpikeTrain = ({ allWaveformInfo, time, titles }: StackedSpikeTrainProps) => {
    function createArray(length: number, start: number, end: number) {
        const step = (end - start) / (length - 1);
        return Array.from({length}, (_, i) => start + i * step);
    };

    if (!allWaveformInfo) {
        console.log('No waveform info')
        return (
            <>
            </>
        );
    };

    // reformat data
    let allWaveformsPoints = [];

    for (let j = 0; j < allWaveformsPoints.length; j++) {
        let waveformInfo = allWaveformInfo[j];

        let allPoints = [];
        for (let i = 0; i < waveformInfo.length; i++) {
            let waveformLength = waveformInfo[i]["values"].length;
            let xArr = createArray(waveformLength, waveformInfo[i]["spike_start"], waveformInfo[i]["spike_end"]);
            let yArr = waveformInfo[i]["values"];
            let points = xArr.map((x, idx) => [x, yArr[idx]]);
            allPoints.push(points);
        }
        allWaveformsPoints.push(allPoints);
    }

    return (
        <>
            {/* <StackedSpikeTrain data={allWaveformsPoints} time={time} /> */}
        </>
    );

}

interface SpikeTrainProps {
    waveformInfo: ElectrodeWaveformInfo | null;
    time: number[];
    titles?: string[];
}

const SpikeTrain = ({ waveformInfo, time, titles=[] }: SpikeTrainProps) => {

    function createArray(length: number, start: number, end: number) {
        const step = (end - start) / (length - 1);
        return Array.from({length}, (_, i) => (start + i * step) / 25000);
    }

    if (!waveformInfo) {
        return (
            <>
            </>
        );
    }

    // reformat data
    let allPoints = [];
    for (let i = 0; i < waveformInfo.length; i++) {
        let waveformLength = waveformInfo[i]["values"].length;
        let xArr = createArray(waveformLength, waveformInfo[i]["spike_start"], waveformInfo[i]["spike_end"]);
        let yArr = waveformInfo[i]["values"];
        let points = xArr.map((x, idx) => [x, yArr[idx]]);
        allPoints.push(points);
    }

    return (
        <>
            <SpikeTrainPlot data={allPoints} time={time} titles={titles} />
        </>
    );
}

interface ActiveIndexButtonsProps {
    activeIndex: number;
    setActiveIndex: React.Dispatch<React.SetStateAction<number>>;
};

const ActiveIndexButtons = ({ activeIndex, setActiveIndex }: ActiveIndexButtonsProps) => {
    const numberOfSignals = JSON.parse(sessionStorage.getItem('recordedSignals') || "[]")["signals"].length;

    const handleLeftClick = () => {
        if (activeIndex > 0) {
            setActiveIndex(activeIndex - 1);
        };
    };

    const handleRightClick = () => {
        if (activeIndex <= numberOfSignals - 1) {
            setActiveIndex(activeIndex + 1);
        };    
    };

    return (
        <div className="w-full flex flex-row mx-auto">
            <div className="flex items-center mx-auto gap-3">
                <motion.button className="opacity-50" disabled={activeIndex == 0} onClick={handleLeftClick} whileHover={{ scale: 1.1, translateX: -2 }} whileTap={{ scale: 0.9 }}>
                    <VscChevronLeft size={25} />
                </motion.button>

                {[...Array(numberOfSignals)].map((_, i) => {
                    if (i === activeIndex) {
                        return (
                            <motion.div key={i} whileHover={{ scale: 1.1 }}>
                                    <BsDashLg size={20} />
                            </motion.div> 
                        )
                    } else {
                        return (
                            <motion.button  key={i} className="opacity-50" onClick={() => setActiveIndex(i)} whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                                <BsDash size={20} />
                            </motion.button> 
                        )
                    }
                })}

                <motion.button className="opacity-50" disabled={activeIndex == numberOfSignals - 1} onClick={handleRightClick} whileHover={{ scale: 1.1, translateX: 2 }} whileTap={{ scale: 0.9 }}>
                    <VscChevronRight size={25} />
                </motion.button>
            </div>
        </div>
    );
}

interface SingleSliderProps {
    text: string;
    min: number;
    max: number;
    initial: number
    name: string
    extractionParams: ExtractionParams;
    setExtractionParams: React.Dispatch<React.SetStateAction<ExtractionParams>>;
}

const SingleSlider = ({ text, name, min, max, initial, extractionParams, setExtractionParams }: SingleSliderProps) => {

    const [value, setValue] = useState(initial);

    useEffect(() => {
        setExtractionParams({ ...extractionParams, [name]: value });
    }, [value]);

    return (
        <div className="flex items-center w-max gap-3">
            <div className="w-28 text-left font-light flex justify-between">
                <span className="opacity-50">{text} :</span>
                <span>{value}</span>
            </div>
            <input id="steps-range" type="range" min={min} max={max} value={value} step="0.1" onChange={(e) => setValue(Number(e.target.value))} className="w-[150px] h-6 px-1 bg-gray-200 rounded-full appearance-none cursor-pointer" />
        </div>     
    );
}

interface ExtractButtonProps {
    extractionParams: ExtractionParams;
    setAllWaveforms: React.Dispatch<React.SetStateAction<Waveform[][] | null>>;
    setAllWaveformInfo: React.Dispatch<React.SetStateAction<AllWaveformInfo | null>>;
}

const ExtractButton = ({ extractionParams, setAllWaveforms, setAllWaveformInfo }: ExtractButtonProps) => {

    let recordedSignals = JSON.parse(sessionStorage.getItem('recordedSignals') || "[]");

    const handleClick = async () => {    
        const requestBody = {
            extractionParams: extractionParams,
            signals: recordedSignals["signals"]
        };
    
        const response = await fetch('http://127.0.0.1:5000/waveforms', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(requestBody), 
        });
    
        const data = await response.json();
        setAllWaveforms(data["waveforms"]);
        setAllWaveformInfo(data["waveform_info"])

        // store waveforms in session storage
        sessionStorage.setItem('waveforms', JSON.stringify(data["waveforms"]));
        sessionStorage.setItem('waveform_info', JSON.stringify(data["waveform_info"]));
    };

    return (
        <motion.button 
            onClick={handleClick} 
            className="border border-black rounded-md px-6 py-2 shadow-md font-semibold"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
        >
            Extract
        </motion.button>
    );
}