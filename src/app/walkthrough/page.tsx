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

            <main className="w-full h-screen flex flex-col pb-24 justify-end items-center p-20 px-12">

                <div className="flex flex-col items-center gap-4 pb-12">
                    <span className="text-center">Ready to start experimenting with<br /> a visual spike sorting pipeline?</span>
                    <Link href={"walkthrough/generator"}>
                        <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} className="px-6 py-3 flex justify-center items-center bg-black text-white rounded-md shadow-md hover:opacity-50">
                            Get Started
                        </motion.button>
                    </Link>
                </div>

                <div className="mx-auto w-full flex flex-col gap-4 sm:w-[400px] border border-dashed border-orange-400 rounded-md p-4 text-orange-400">
                    <p>Notice: This application is no longer functional as the API is not hosted.</p>
                    <p>However, you can <a href="https://drive.google.com/file/d/15dLszj8FZ71s85uNpG_nSkrT187lF0TE/view?usp=sharing" className="underline">watch this video</a> which includes me walking through the entire process.</p>
                </div>

                <span className="w-full sm:w-[400px] text-center font-light text-red-700 pt-4">Warning: if you do decide to watch it, please excuse my awkwardness and unkept hair. It was a busy week.</span>




            </main>

        </>
    );
}
