"use client"

import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { VscChevronLeft, VscChevronDown } from "react-icons/vsc";
import { NeuronParams } from "../page";

interface RangeParameterProps {
    name: string;
    min: number;
    max: number;
    initial: number;
    symbol: JSX.Element;
}

interface OptionsParameterProps {
    name: string;
    options: string[];
}

interface CheckboxParameterProps {
    name: string;
    defaultChecked: boolean;
    symbol: JSX.Element;
}

interface RangeParameter {
    name: string;
    type: "RangeParameter";
    values: RangeParameterProps;
}

interface CheckboxParameter {
    name: string;
    type: "CheckboxParameter";
    values: CheckboxParameterProps;
}

interface OptionsParameter {
    name: string;
    type: "OptionsParameter";
    values: OptionsParameterProps;
}

type Parameter = RangeParameter | CheckboxParameter | OptionsParameter;

const RangeParameterComponent: React.FC<RangeParameterProps & NeuronParametersProps> = ({ name, min, max, initial, symbol, neuronParams, setNeuronParams }) => {

    const [value, setValue] = useState(initial);

    useEffect(() => {
        setNeuronParams({ ...neuronParams, [name]: value });
    }, [value]);

    return (
        <div className="flex items-center justify-between w-max mx-auto gap-3">
            <span className="w-8 text-left">{symbol}</span>
            <input id="steps-range" type="range" min={min} max={max} value={value} step="1" onChange={(e) => setValue(Number(e.target.value))} className="w-[150px] h-6 px-1 bg-gray-200 rounded-full appearance-none cursor-pointer" />
            <span className="w-8 text-right">{value}</span>
        </div>    
    );
}

const CheckboxParameterComponent: React.FC<CheckboxParameterProps & NeuronParametersProps> = ({ name, defaultChecked, neuronParams, setNeuronParams, symbol }) => {

    const [checked, setChecked] = useState(defaultChecked);
    
    useEffect(() => {
        setNeuronParams({ ...neuronParams, [name]: checked });
    }, [checked]);

    return (
        <div className="flex items-center justify-between w-max mx-auto gap-3">
            <span>{symbol}</span>
            <input type="checkbox" checked={checked} onChange={(e) => setChecked(e.target.checked)} />
        </div>
    );
}

const OptionsParameterComponent: React.FC<OptionsParameterProps & NeuronParametersProps> = ({ neuronParams, setNeuronParams, name, options }) => {
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [selection, setSelection] = useState(options[0]);

    const variants = {
        enter: { opacity: 1, y: 0 },
        exit: { opacity: 0, y: "200%" },
    };

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

interface NeuronParameters {
    [key: string]: { [key: number]: Parameter | null };
}

const neuronParameters: NeuronParameters = {
    "Leaky Integral Fire (LIF)": {
      0: { name: "lambda", type: "RangeParameter", values: { min: 5, max:20, initial: 14, symbol: <span>&lambda;</span>, name: "lambda" } },
      1: { name: "v_rest", type: "RangeParameter", values: { min: -140, max: 40, initial: -70, symbol: <span>V<sub>rest</sub></span>, name: "v_rest" } },
      2: { name: "v_thres", type: "RangeParameter", values: { min: -40, max: 40, initial: -10, symbol: <span>V<sub>thr</sub></span>, name: "v_thres" } },
    //   3: { name: "t_ref", type: "RangeParameter", values: { min: 0.001, max: 0.2, initial: 0.02, name: "v_thres" } },
      4: { name: "fix_random_seed", type: "CheckboxParameter", values: { defaultChecked: false, symbol: <span>Fix Random Seed</span>, name: "fix_random_seed" } },
    },
    "Bursting Neuron": {
      0: null,
    //   1: { name: "Example", type: "OptionsParameter", values: { options: [ "Value Seven", "Value Eight", "Value Nine" ] } },
    }
};

const componentMap = {
    RangeParameter: RangeParameterComponent,
    CheckboxParameter: CheckboxParameterComponent,
    OptionsParameter: OptionsParameterComponent
};

interface NeuronParametersProps {
    neuronParams: NeuronParams;
    setNeuronParams: React.Dispatch<React.SetStateAction<NeuronParams>>;
}

export default function NeuronParameters({ neuronParams, setNeuronParams }: NeuronParametersProps) {
    const [neuronType, setNeuronType] = useState(Object.keys(neuronParameters)[0]);

    return (
            <div className="w-full h-full flex flex-col justify-center items-center gap-6">
                <div className="w-full flex flex-col justify-center items-center">
                    <span className="text-center w-full font-thin">Neuron Type</span>
                    <NeuronSelector neuronType={neuronType} setNeuronType={setNeuronType} />
                </div>

                <div className="w-full flex flex-col justify-center items-center">
                    <span className="text-center font-thin">Neuron Parameters</span>
                    <div className="flex w-full flex-col gap-3">
                        {
                            Object.keys(neuronParameters[neuronType]).map((key, i) => {
                                const param = neuronParameters[neuronType][Number(key)] as Parameter | null;
                                if (param) {
                                    if (param.type === 'RangeParameter') {
                                        const { values } = param as RangeParameter;
                                        return (
                                            <div key={i} className="w-full flex justify-between items-center gap-3">
                                                <RangeParameterComponent
                                                    neuronParams={neuronParams}
                                                    setNeuronParams={setNeuronParams}
                                                    {...values}
                                                />
                                            </div>
                                        );
                                    } else if (param.type === 'CheckboxParameter') {
                                        const { values } = param as CheckboxParameter;
                                        return (
                                            <div key={i} className="w-full flex justify-between items-center gap-3">
                                                <CheckboxParameterComponent
                                                    neuronParams={neuronParams}
                                                    setNeuronParams={setNeuronParams}
                                                    {...values}
                                                />
                                            </div>
                                        );
                                    } else if (param.type === 'OptionsParameter') {
                                        const { values } = param as OptionsParameter;
                                        return (
                                            <div key={i} className="w-full flex justify-between items-center gap-3">
                                                <OptionsParameterComponent
                                                    neuronParams={neuronParams}
                                                    setNeuronParams={setNeuronParams}
                                                    {...values}
                                                />
                                            </div>
                                        );
                                    }
                                }
                                return null;
                            })
                        }
                    </div>

                </div>

            </div>
    );
};

interface NeuronSelector {
    neuronType: string;
    setNeuronType: React.Dispatch<React.SetStateAction<string>>;
}

const NeuronSelector = ({ neuronType, setNeuronType }: NeuronSelector) => {
    const [dropdownOpen, setDropdownOpen] = useState(false);

    const variants = {
        enter: { opacity: 1, y: 0 },
        exit: { opacity: 0, y: "200%" },
    };

    return (
        <div className="relative gap-3 w-max" onMouseEnter={() => setDropdownOpen(true)} onMouseLeave={() => setDropdownOpen(false)}>
            <motion.button className="border border-black hover:opacity-50 rounded-md px-6 py-2 flex items-center justify-between gap-3">
                <span className="">{neuronType}</span>
                { dropdownOpen ? <VscChevronLeft size={25} /> : <VscChevronDown size={25} /> }
            </motion.button>

            <motion.div animate={dropdownOpen ? "enter" : "exit"} variants={variants} className={`${!dropdownOpen && "hidden"} w-full absolute pt-3 right-0 z-10 shadow-md`}>
                <div className="p-3 w-full rounded-md bg-white border border-black flex flex-col gap-6 text-left">
                    {
                        Object.keys(neuronParameters).map((type, index) => {
                            return (
                                <button 
                                    disabled={neuronParameters[type][0] === null}
                                    onClick={() => setNeuronType(type)}
                                    key={index} 
                                    className={`${neuronType === type ? "opacity-50" : "hover:opacity-50" } text-left`}>
                                    {type}
                                </button>
                            )
                        })
                    }
                </div>
            </motion.div>
        </div>
    );
};


