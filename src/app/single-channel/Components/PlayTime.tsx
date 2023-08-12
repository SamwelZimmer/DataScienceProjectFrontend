"use client";

import { useState } from "react";

import { motion } from "framer-motion";

interface PlayTimeProps {
    duration: number;
    currentTime: number;
    highRes?: boolean;
};

export default function PlayTime({ duration, currentTime, highRes=false }: PlayTimeProps) {

    function formatTime(seconds: number): string {
        // calculate minutes and remaining seconds
        let minutes = Math.floor(seconds / 60);
        
        let remainingSeconds;
        if (highRes) {
            let num = seconds % 60
            remainingSeconds = Math.round((num + Number.EPSILON) * 10) / 10
        } else {
            remainingSeconds = Math.floor(seconds % 60);
        }
      
        // pad the seconds with a zero if it's less than 10
        let paddedSeconds = remainingSeconds < 10 ? `0${remainingSeconds}` : `${remainingSeconds}`;
      
        // return formatted time
        return `${minutes}:${paddedSeconds}`;
    };

    return <p className={`${highRes && "w-24 flex justify-between"}`}><span>{formatTime(currentTime)}</span> / {formatTime(duration)}</p>;
}