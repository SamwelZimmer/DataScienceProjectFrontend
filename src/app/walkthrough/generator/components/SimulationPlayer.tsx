"use client";

import { useRef, useEffect, useState } from "react";
import { AiOutlinePlayCircle, AiOutlinePauseCircle, AiOutlineStepBackward } from "react-icons/ai";
import { color, motion } from "framer-motion";

import { Player } from "../../../../../classes/Player";
import PlayTime from "@/app/single-channel/Components/PlayTime";
import PlayableSpikeTrain from "./PlayableSpikeTrain";

type LabelMap = {
    [key: number]: number[];
};

interface SimulationPlayerProps {
    neuronPositions: number[][];
    neuronSpikes: LabelMap;
    gridSize: number;
    tickPerSecond: number;
    sampleLength: number;
    time: number[];
}

export default function SimulationPlayer({ neuronPositions, neuronSpikes, gridSize, tickPerSecond, sampleLength, time }: SimulationPlayerProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const [containerWidth, setContainerWidth] = useState(1);
    const [numberOfTicks, setNumberOfTicks] = useState(0);

    const sampleRate = 25000;

    const seconds = numberOfTicks / sampleRate;

    const allSpikeLocations = Object.values(neuronSpikes).map(innerArray => 
        innerArray.map(value => value / sampleRate)
    );
  
    useEffect(() => {
        function handleResize() {
            if (containerRef.current) {
                setContainerWidth(containerRef.current.offsetWidth);
            };
        };
  
        // Initial width set
        handleResize();
    
        // Add event listener for window resize
        window.addEventListener('resize', handleResize);

    
        // Cleanup: remove event listener
        return () => window.removeEventListener('resize', handleResize);
    }, [neuronPositions]); // run on component mount

    const gridUnit = containerWidth / gridSize

    return (
        <div className="w-full flex flex-col">

            <div className="relative w-full md:w-[350px] mx-auto aspect-square border" ref={containerRef}>
                {neuronPositions.map((position, index) => (
                    <Neuron 
                        key={index} 
                        position={position} 
                        index={index} 
                        gridUnit={gridUnit} 
                        numberOfTicks={numberOfTicks} 
                        spikeLocations={neuronSpikes[index]}
                    />
                ))}
            </div>

            <div className="flex w-full md:w-[350px] mx-auto p-6 items-center gap-3">
                <PlayButton tickPerSecond={tickPerSecond} sampleLength={sampleLength} setNumberOfTicks={setNumberOfTicks} />
                <PlayTime duration={sampleLength / sampleRate} currentTime={seconds} highRes={true} />
            </div>

            <div className="w-full">
                <PlayableSpikeTrain 
                    data={allSpikeLocations} 
                    time={time} 
                    titles={["Time (s)", ""]} 
                    numberOfTicks={numberOfTicks} 
                />
            </div>
        </div>
    );
}

interface PlayButtonProps {
    tickPerSecond: number;
    sampleLength: number;
    setNumberOfTicks: React.Dispatch<React.SetStateAction<number>>;
}

function PlayButton({ setNumberOfTicks, tickPerSecond, sampleLength }: PlayButtonProps) {
    const [playing, setPlaying] = useState(false);
    const playerRef = useRef<Player | null>(null);

    useEffect(() => {
        // Create player only once
        if (!playerRef.current) {
            playerRef.current = new Player(setNumberOfTicks, tickPerSecond, sampleLength);
        }

        // Play or pause based on playing state
        if (playing) {
            playerRef.current?.start();
        } else {
            playerRef.current?.pause();
        }

        // Cleanup when component unmounts
        return () => {
            playerRef.current?.destroy();
        };
    }, [playing]); // Re-run effect when playing state changes

    useEffect(() => {
        handleRewindClick();
    }, [tickPerSecond])

    const handlePlayClick = () => {
        setPlaying(prevPlaying => !prevPlaying);
    };

    const handleRewindClick = () => {
        setNumberOfTicks(0);
        playerRef.current?.destroy();
        playerRef.current = new Player(setNumberOfTicks, tickPerSecond, sampleLength);

        if (!playing) {
            playerRef.current?.pause();
        };
    };

    return (
        <>
            <motion.button onClick={handleRewindClick}>
                <AiOutlineStepBackward size={30} />
            </motion.button>
            <motion.button onClick={handlePlayClick}>
                { playing ? <AiOutlinePauseCircle size={40} /> : <AiOutlinePlayCircle size={40} /> }
            </motion.button>
        </>

    );
}

interface Neuron {
    position: number[];
    index: number;
    gridUnit: number;
    numberOfTicks: number;
    spikeLocations: number[];
}

const Neuron = ({ position, index, gridUnit, numberOfTicks, spikeLocations }: Neuron) => {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);

    let expandedArray = spikeLocations;

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        
        const context = canvas.getContext('2d');
        if (!context) return;

        let colour = "rgb(255,255,255)"
        if (spikeLocations.some(val => val >= numberOfTicks - 200 && val <= numberOfTicks + 200)) {
            colour = "rgb(255,0,0)";
        } else {
            colour = "rgb(255,255,255)"
        }
    
        // clear the previous drawing
        context.clearRect(0, 0, canvas.width, canvas.height);
    
        // draw a rectangle of the specified color
        context.fillStyle = colour;
        context.fillRect(0, 0, 100, 100);
    
      }, [numberOfTicks]);

    return (
        <div 
            key={index}
            style={{
                position: 'absolute',
                bottom: `${position[1] * gridUnit}px`,
                left: `${position[0] * gridUnit}px`,
            }}
        >
            <canvas 
                ref={canvasRef} // This might cause issues since all canvases will share the same ref. You might want to handle refs differently if you need individual references.
                width={gridUnit}
                height={gridUnit} 
                className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-gray-200 border rounded-lg"
            />
        </div>
    );
}