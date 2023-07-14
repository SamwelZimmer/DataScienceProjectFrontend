"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { AiOutlineFieldTime } from "react-icons/ai";

interface SpeedSelectorProps {
    tickPerSecond: number;
    sampleRate: number;
    setTickPerSecond: React.Dispatch<React.SetStateAction<number>>;
}

export default function SpeedSelector({ tickPerSecond, setTickPerSecond, sampleRate }: SpeedSelectorProps) {

    const [visible, setVisible] = useState(false);

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setTickPerSecond(Number(event.target.value));
    };

    const variants = {
        enter: { opacity: 1, y: 0 },
        exit: { opacity: 0, y: "200%" },
    }

    return (
        <div className="relative gap-3 w-max" onMouseEnter={() => setVisible(true)} onMouseLeave={() => setVisible(false)}>
            <motion.button className="flex items-center gap-3 w-24 justify-end">
                <span>{tickPerSecond}</span>
                <AiOutlineFieldTime size={30} /> 
            </motion.button>   
            
            <motion.div animate={visible ? "enter" : "exit"} variants={variants} className={`${!visible && "hidden"} absolute pt-3 -left-1/2 z-10`}>
                <div className="p-3 w-max rounded-md bg-white border border-black flex flex-col text-center">
                    <span>Choose player speed</span>
                    <span className="opacity-50">{"("}samples / second{")"}</span>
                    <div>
                        <input id="minmax-range" type="range" min={0} max={sampleRate} value={tickPerSecond} onChange={handleChange} className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer" />
                    </div>
                </div>
            </motion.div>

        </div>
    );
}