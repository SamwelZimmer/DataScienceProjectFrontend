"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { AiOutlineFieldTime, AiOutlineSetting, AiOutlineFund } from "react-icons/ai";

interface SpeedSelectorProps {
    tickPerSecond: number;
    sampleRate: number;
    windowSize: number;
    setTickPerSecond: React.Dispatch<React.SetStateAction<number>>;
    setWindowSize: React.Dispatch<React.SetStateAction<number>>;
}

export default function SpeedSelector({ tickPerSecond, setTickPerSecond, windowSize, setWindowSize, sampleRate }: SpeedSelectorProps) {

    const [visible, setVisible] = useState(false);

    const handleSpeedChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setTickPerSecond(Number(event.target.value));
    };

    const handleWindowChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setWindowSize(Number(event.target.value));
    };

    const variants = {
        enter: { opacity: 1, y: 0 },
        exit: { opacity: 0, y: "200%" },
    }

    return (
        <div className="relative gap-3 w-max" onMouseEnter={() => setVisible(true)} onMouseLeave={() => setVisible(false)}>
            <motion.button className="flex items-center justify-end w-32">
                <AiOutlineSetting size={30} /> 
            </motion.button>   
            
            <motion.div animate={visible ? "enter" : "exit"} variants={variants} className={`${!visible && "hidden"} absolute pt-3 right-0 z-10`}>
                <div className="p-3 w-max rounded-md bg-white border border-black flex flex-col text-center gap-6">
                    <div className="w-full rounded-md bg-white flex flex-col text-center">
                        <span className="opacity-50 text-xs">Player Speed {"("}samples / second{")"}</span>
                        <div className="flex items-center gap-3">
                            <AiOutlineFieldTime size={25} />
                            <input id="minmax-range" type="range" min={0} max={sampleRate} value={tickPerSecond} onChange={handleSpeedChange} className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer" />
                        </div>
                        <span className="text-sm">{tickPerSecond}</span>
                    </div>

                    <div className="w-full rounded-md bg-white flex flex-col text-center">
                        <span className="opacity-50 text-xs">Window Size {"("}samples{")"}</span>
                        <div className="flex items-center gap-3">
                            <AiOutlineFund size={25} />
                            <input id="minmax-range" type="range" min={10} max={10000} value={windowSize} onChange={handleWindowChange} className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer" />
                        </div>
                        <span className="text-sm">{windowSize}</span>
                    </div>
                </div>
            </motion.div>

        </div>
    );
}