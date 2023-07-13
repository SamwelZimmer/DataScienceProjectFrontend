"use client";

import { AiOutlinePlayCircle, AiOutlinePauseCircle, AiOutlineStepBackward } from "react-icons/ai";
import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Timer } from "../../../../classes/Timer";
import { Player } from "../../../../classes/Player";

interface PlayButtonProps {
    tickPerSecond: number;
    sampleLength: number;
    setNumberOfTicks: React.Dispatch<React.SetStateAction<number>>;
}

export default function PlayButton({ setNumberOfTicks, tickPerSecond, sampleLength }: PlayButtonProps) {
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