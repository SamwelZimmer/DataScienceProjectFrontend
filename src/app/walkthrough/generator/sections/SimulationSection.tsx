"use client";

import { useState, useEffect } from "react";

import SimulationPlayer from "../components/SimulationPlayer";

type LabelMap = {
    [key: number]: number[];
};

type Info = {
    spike_start: number;
};

export default function SimulationSection() {

    const [clusterData, setClusterData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [gridSize, setGridSize] = useState(1);
    const [neuronPositions, setNeuronPositions] = useState([]);
    const [neuronSpikes, setNeuronSpikes] = useState<LabelMap>({});
    const [tickPerSecond, setTickPerSecond] = useState(10000);
    const [time, setTime] = useState([]);

    useEffect(() => {
        const placements = sessionStorage.getItem('placements');
        const waveform_info = sessionStorage.getItem('waveform_info');
        const predictedLabels = sessionStorage.getItem('predictedLabels');
        const recordedSignals = sessionStorage.getItem('recordedSignals');
        const triangulatedData = sessionStorage.getItem('triangulatedData');

        let parsedPlacements = placements && JSON.parse(placements);
        setGridSize(Math.sqrt(parsedPlacements.length))

        let parsedRecordedSignals = recordedSignals && JSON.parse(recordedSignals);
        setTime(parsedRecordedSignals["time"])


        let parsedTriangulatedData = triangulatedData && JSON.parse(triangulatedData);
        setNeuronPositions(parsedTriangulatedData["predicted_neuron_positions"])

        let parsedPredictedLabels: number[] = predictedLabels && JSON.parse(predictedLabels);

        let parsedWaveform_info = waveform_info && JSON.parse(waveform_info);

        let allSpikeStartTimes: number[] = parsedWaveform_info[0].map((info: Info) => info.spike_start);

        const labelToValuesMap: LabelMap = {};

        parsedPredictedLabels.forEach((label, index) => {
            if (!labelToValuesMap[label]) {
                labelToValuesMap[label] = [];
            }
            labelToValuesMap[label].push(allSpikeStartTimes[index]);
        });

        setNeuronSpikes(labelToValuesMap);

    }, []);


    return (
        <div className="w-full h-full flex flex-col gap-6 items-center justify-center p-6">
            <SimulationPlayer 
                neuronPositions={neuronPositions} 
                neuronSpikes={neuronSpikes} 
                gridSize={gridSize} 
                tickPerSecond={tickPerSecond} 
                sampleLength={time.length} 
                time={time}
            />
        </div>
    );

}