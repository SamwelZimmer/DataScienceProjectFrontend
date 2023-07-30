"use client"

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { VscChevronLeft, VscChevronRight } from "react-icons/vsc";
import { BsDashLg, BsDash } from "react-icons/bs";

import SingleStaticSignalPlot from "../components/SingleStaticSignalPlot";
import WaveformPlot from "../components/WaveformPlot";

interface ExtractionParams {
    thresholdMultiplier: number;
    waveformDuration: number;
};

// a single waveform, represented as an array of points
export type Waveform = number[];

export default function ExtractionSection() {

    const [activeIndex, setActiveIndex] = useState(0);
    const [activeSignal, setActiveSignal] = useState(null);
    const [showSpiketrain, setShowSpiketrain] = useState(false);
    const [allWaveforms, setAllWaveforms] = useState<Waveform[][] | null>(null);
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
            <h1 className="text-4xl font-semibold px-12 sm:px-0">Spike Extraction</h1>

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
                        <ExtractButton extractionParams={extractionParams} setAllWaveforms={setAllWaveforms} />
                    </div>
                </div>

                <div className="w-full flex gap-6 items-center mx-auto justify-center">
                    <hr className="w-32 h-px my-8 bg-gray-200 border-0 rounded" />
                    <span className="font-thin w-max">Waveforms</span>
                    <hr className="w-32 h-px my-8 bg-gray-200 border-0 rounded" />
                </div>
                
                {/* large screens */}
                <div className="hidden md:flex flex-row items-center">
                    {/* individual spike waveform viewer */}
                    <div className="h-48 w-48 ">
                        { allWaveforms && <WaveformPlot waveforms={allWaveforms[activeIndex]} titles={["Time (ms)", "Potential (mV)"]} />}
                    </div>
                    
                    {/* individual spike train viewer */}
                </div>
                
                {/* small screens */}
                <div className="flex md:hidden flex-col mx-auto gap-3">
                    <motion.button onClick={() => setShowSpiketrain(!showSpiketrain)} className="w-[175px] mx-auto border border-black rounded-md py-1 text-center">
                        { showSpiketrain ? "Show Waveforms" : "Show Spike Train" }
                    </motion.button>

                    <div className="h-48 w-48 ">
                        {
                            showSpiketrain ? <></> :
                            <div className="w-full h-full">
                                { allWaveforms && <WaveformPlot waveforms={allWaveforms[activeIndex]} titles={["Time (ms)", "Potential (mV)"]} />}
                            </div>
                        }
                    </div>


                </div>

            </section>
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

                <motion.button disabled={activeIndex == numberOfSignals - 1} onClick={handleRightClick} whileHover={{ scale: 1.1, translateX: 2 }} whileTap={{ scale: 0.9 }}>
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
        <div className="flex items-center justify-between w-max mx-auto gap-3">
            <span className="w-15 text-left">{text}</span>
            <input id="steps-range" type="range" min={min} max={max} value={value} step="0.1" onChange={(e) => setValue(Number(e.target.value))} className="w-[150px] h-6 px-1 bg-gray-200 rounded-full appearance-none cursor-pointer" />
            <span className="w-8 text-right">{value}</span>
        </div>    
    );
}

interface ExtractButtonProps {
    extractionParams: ExtractionParams;
    setAllWaveforms: React.Dispatch<React.SetStateAction<Waveform[][] | null>>;
}

const ExtractButton = ({ extractionParams, setAllWaveforms }: ExtractButtonProps) => {

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
        setAllWaveforms(data["waveforms"])
    };

    return (
        <motion.button 
            onClick={handleClick}
            whileHover={{ scale: 1.05 }} 
            whileTap={{ scale: 0.95 }} 
            className="border border-black px-6 py-1 rounded-md"
        >
            Extract
        </motion.button>
    );
}