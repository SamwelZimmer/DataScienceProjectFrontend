"use client"

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import Link from "next/link";

import Navbar from "../../../components/Navbar";
import ExampleSimulation from "./ExampleSimulation";

export default function WalkthroughPage() {

    const [data, setData] = useState(null);

    useEffect(() => {
      // Fetching JSON data from the public directory
      fetch('.')
        .then(response => response.json())
        .then(data => setData(data))
        .catch(error => console.error('Error fetching data:', error));
    }, []);

    return (
        <>
            <Navbar />

            <main className="w-full h-screen flex flex-col justify-around items-center p-20 px-12">

                {/* <ExampleSimulation /> */}
                <Link href={"walkthrough/generator"}>
                    <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} className="px-6 py-3 flex justify-center items-center bg-black text-white rounded-md shadow-md hover:opacity-50">
                        Make Your Own
                    </motion.button>
                </Link>

            </main>

        </>
    );
}
