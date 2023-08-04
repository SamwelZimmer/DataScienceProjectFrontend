import { motion } from "framer-motion";
import { useState } from "react";

import TriangulatePlot from "../components/TriangulatePlot";

export default function TriangulationSection() {

    const [loading, setLoading] = useState(false);
    const [triangulatedData, setTriangulatedData] = useState(null);

    return (
        <>
            <div className="w-full h-full py-12 px-12 sm:px-0 flex flex-col gap-12 justify-center">

                {/* activate button */}
                <div className="w-full flex-col flex md:flex-row justify-center gap-12">
                    <Triangulator setLoading={setLoading} setTriangulatedData={setTriangulatedData} />
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
                                triangulatedData ? 
                                    <Plots data={triangulatedData} />
                                :
                                    <div className="w-full h-full border border-dashed rounded-md flex flex-col items-center justify-center">
                                        <span className="flex self-center mx-auto opacity-30">Press {"'"}Triangulate{"'"} to Generate Plot</span>
                                    </div>
                            }
                        </>
                    }
                </div>
            </div>
        </>
    );
}

interface TriangulateInfo {
    circles: [number[], number][];
    intersecting_lines: [number, number][];
    predicted_neuron_position: [number, number];
    true_neuron_position: [number, number];
    used_electrodes: number[];
}

interface PlotsProps {
    data: {
        [key: number]: TriangulateInfo;
        all_electrode_positions: [number, number][];
        predicted_neuron_positions: [number, number][];
        true_neuron_positions: [number, number][];
    } | null;
}

const Plots = ({ data }: PlotsProps) => {

    const [showConstruction, setShowConstruction] = useState(false);

    const placements =  JSON.parse(sessionStorage.getItem('placements') || "[]");

    if (!data) {
        return <></>
    }

    console.log(data)

    const predictedNeurons = data["predicted_neuron_positions"];
    const allElectrodes = data["all_electrode_positions"];

    return (

        <div className="w-full h-full flex flex-col gap-6">
            {/* plot parameters */}
            <div className="flex items-center justify-between w-max mx-auto gap-3">
                <span className="opacity-50 font-light">Show Construction</span>
                <input type="checkbox" checked={showConstruction} onChange={(e) => setShowConstruction(e.target.checked)} />
            </div>

            <div className="flex flex-col w-full h-full mx-auto gap-6">
                <div className="flex flex-col w-full h-full mx-auto gap-6">
                    <div className="w-full h-full flex flex-row gap-12 pr-3 overflow-x-auto whitespace-nowrap border-r border-dashed hidden-scrollbar">
                        {
                            predictedNeurons.map((predictedPosition, neuronIndex) => {

                                return (
                                    <div key={neuronIndex} className="flex-none flex justify-center">
                                        <div className="h-full w-full">
                                            <span className="w-full flex justify-center font-thin">Neuron {neuronIndex + 1} Prediction</span>
                                            <div className="w-full aspect-square">
                                                <TriangulatePlot 
                                                    gridSize={Math.sqrt(placements.length)} 
                                                    predictedPosition={predictedPosition} 
                                                    truePosition={neuronIndex > data["true_neuron_positions"].length - 1 ? null : data[neuronIndex]["true_neuron_position"]} 
                                                    allElectrodes={allElectrodes} 
                                                    usedElectrodes={data[neuronIndex]["used_electrodes"]} 
                                                    circles={data[neuronIndex]["circles"]} 
                                                    intersectingLines={data[neuronIndex]["intersecting_lines"]} 
                                                    showConstructions={showConstruction} 
                                                />
                                            </div>
                                        </div>
                                    </div>
                                );
                            })
                        }
                    </div>
                </div>
            </div>
        </div>

    );
}

interface TriangulatorProps {
    setLoading: React.Dispatch<React.SetStateAction<boolean>>;
    setTriangulatedData: React.Dispatch<React.SetStateAction<| null>>;
}

function Triangulator({ setLoading, setTriangulatedData }: TriangulatorProps) {

    const handleClick = async () => {
        setLoading(true);
    
        try {

            // get data from storage
            let recordedSignals = sessionStorage.getItem('recordedSignals');
            let placements = sessionStorage.getItem('placements');
            let waveforms = sessionStorage.getItem('waveforms');
            let processingParamsStr = sessionStorage.getItem('processingParams');
            let predictedLabels = sessionStorage.getItem('predictedLabels');

            // Parse processingParamsStr into an object, if it's not null
            let processingParams = processingParamsStr ? JSON.parse(processingParamsStr) : {decay_type: ''};
    
            const requestBody = {
                recordedSignals: recordedSignals,
                placements: placements,
                waveforms: waveforms,
                predictedLabels: predictedLabels,
                decay_type: processingParams["decay_type"]
            };
    
            const response = await fetch('http://127.0.0.1:5000/triangulate', {
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

            setTriangulatedData(data);
            sessionStorage.setItem('triangulatedData', JSON.stringify(data));
    
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
                    Triangulate
                </motion.button>
            </section>
        </>
    );
};