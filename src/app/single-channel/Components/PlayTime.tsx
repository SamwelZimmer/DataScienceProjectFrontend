"use client";

import { useState } from "react";

import { motion } from "framer-motion";

interface PlayTimeProps {
    duration: number;
    currentTime: number;
};

export default function PlayTime({ duration, currentTime }: PlayTimeProps) {

    function formatTime(seconds: number): string {
        // calculate minutes and remaining seconds
        let minutes = Math.floor(seconds / 60);
        let remainingSeconds = Math.floor(seconds % 60);
      
        // pad the seconds with a zero if it's less than 10
        let paddedSeconds = remainingSeconds < 10 ? `0${remainingSeconds}` : `${remainingSeconds}`;
      
        // return formatted time
        return `${minutes}:${paddedSeconds}`;
    };

    return <p>{formatTime(currentTime)} / {formatTime(duration)}</p>;
}