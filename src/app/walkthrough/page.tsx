"use client"

import { motion } from "framer-motion";
import Link from "next/link";

import Navbar from "../../../components/Navbar";

export default function WalkthroughPage() {

    return (
        <>
            <Navbar />

            <main className="w-full h-screen flex flex-col justify-around items-center p-20 px-12">

                <div className="w-full sm:w-[400px] aspect-square flex justify-center items-center border-2 border-black">
                    Neuron Grid Demo
                </div>

                <Link href={"walkthrough/generator"}>
                    <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} className="px-6 py-3 flex justify-center items-center bg-black text-white rounded-md shadow-md hover:opacity-50">
                        Make Your Own
                    </motion.button>
                </Link>

            </main>

        </>
    );
}
