"use client"

import { motion } from "framer-motion";
import { useState, useEffect, useRef } from "react";

// this inital grid makes it appear on the screen instantly

export default function PlacementGrid() {
    const [gridSize, setGridSize] = useState<number>(5);
    const [placements, setPlacements] = useState<number[]>([]);
    const [placementType, setPlacementType] = useState<number>(0); 

    const initialRender = useRef(true); // Ref to track initial render

    useEffect(() => {
        // Now that we're on the client side, read from sessionStorage
        const defaultPlacements = JSON.stringify([0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]);
        const storedPlacements = JSON.parse(sessionStorage.getItem('placements') || defaultPlacements);
        setGridSize(storedPlacements.length > 0 ? Math.sqrt(storedPlacements.length) : 5);
        setPlacements(storedPlacements);
    }, []);  // Empty array means this runs once on mount

    useEffect(() => {
        // Skip effect if it's the initial render or if placements aren't all zeros
        if (initialRender.current || placements.some(val => val !== 0)) {
            initialRender.current = false;
        } else {
            let newPlacements: number[] = [];
            for (let i = 0; i < gridSize ** 2; i++) {
                newPlacements.push(0);
            }
            setPlacements(newPlacements);
        }
    }, [gridSize]);

    useEffect(() => {
        // add grid placement info to the storage 
        sessionStorage.setItem('placements', JSON.stringify(placements));    
    }, [placements]);

    const handleTileClick = (id: number) => {
        setPlacements(prevPlacements => prevPlacements.map((placement, index) => {
            if (index === id) {
                if (placement !== placementType) {
                    return placementType;
                } else {
                    return 0;
                };
            }
            return placement;
        }));
    }

    const clearGrid = () => {
        let newPlacements: number[] = [];
        for (let i = 0; i < gridSize ** 2; i++) {
            newPlacements.push(0)
        }
        setPlacements(newPlacements);
    }

    const colours = ["bg-transparent", "bg-red-600", "bg-blue-800"];

    return (
        <>
            <div className="py-12 md:py-0 w-full h-full flex flex-col md:flex-row justify-around md:justify-between items-center">

                {/* grid */}
                <div className="grid border w-full xs:w-[300px] xs:h-[300px] sm:w-[400px] sm:h-[400px]" style={{gridTemplateColumns: `repeat(${gridSize}, 1fr)`}}>
                    {placements.map((placement, index) => 
                        <Tile id={index} key={index} onClick={handleTileClick} colour={colours[placement % colours.length]} />
                    )}
                </div>

                {/* controls */}
                <div className="grid gap-y-2 md:gap-6 grid-cols-2 md:grid-cols-1 flex-col justify-start items-start gap-6 py-6">

                    <span className="text-center font-thin md:text-left md:pl-3 grid-cols-1 row-start-1 col-span-2">Grid Size</span>

                    <div className="flex flex-col mx-auto my-auto gap-1 col-start-1 row-start-2 col-span-2">
                        <div className="flex items-center justify-between w-[200px]">
                            <input id="steps-range" type="range" min="4" max="12" value={gridSize} step="1" onChange={(e) => setGridSize(Number(e.target.value))}  className="w-[170px] h-6 px-1 bg-gray-200 rounded-full appearance-none cursor-pointer" />
                            <span>{gridSize}</span>
                        </div>
                    </div>

                    <span className="text-center font-thin md:text-left md:pl-3 col-start-1 col-span-2 row-start-3 pt-3">Placements</span>

                    <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => setPlacementType(1)} className="col-start-1 row-start-4 flex items-center p-3 w-max sm:w-[145px] mx-auto md:mx-0 justify-between border-2 rounded-md shadow-md gap-3 md:gap-6">
                        <div className="h-full w-6 rounded-md aspect-square bg-red-600" /> 
                        <span className="">Neuron</span>
                    </motion.button>

                    <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => setPlacementType(2)} className="col-start-2 md:col-start-1 row-start-4 md:row-start-5 mx-auto md:mx-0 flex items-center p-3 w-max sm:w-[145px] justify-between border-2 rounded-md shadow-md gap-3 md:gap-6">
                        <div className="h-full w-6 rounded-md aspect-square bg-blue-800" />
                        <span>Electrode</span>
                    </motion.button>

                    <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={clearGrid} className="w-max mx-auto md:mx-0 text-center col-start-1 col-span-2 md:col-start-1 row-start-6 md:row-start-6 flex items-center py-2 px-6 justify-between border-2 rounded-md shadow-md gap-6">
                        <span>Clear</span>
                    </motion.button>

                </div>

            </div>

        </>
    );
}

interface TileProps {
    id: number;
    onClick: (id: number) => void;
    colour: string;
};

const Tile = ({ id, onClick, colour }: TileProps) => {

    return (
        <div 
            style={{  }}
            onClick={() => onClick(id)}
            className={`${colour} w-full aspect-square flex items-center justify-center border cursor-pointer hover:bg-black/20`}>
        </div>
    );
}