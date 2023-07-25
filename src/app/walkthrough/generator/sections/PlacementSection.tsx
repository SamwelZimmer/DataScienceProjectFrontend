"use client"

import { motion } from "framer-motion";
import { useState, useRef, useEffect } from "react";
import PlacementGrid from "../components/PlacementGrid";

export default function PlacementSection() {

    return (
        <>

                <h1 className="text-4xl font-semibold px-12 sm:px-0">Grid Size and Placement</h1>

                <section className="w-full h-full px-12 sm:px-0">
                    <PlacementGrid />
                </section>


        </>
    );
}
