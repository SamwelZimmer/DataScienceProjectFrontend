"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { AiOutlineArrowDown } from "react-icons/ai";

export default function Hero() {
    return (
        <section className='z-20 h-screen overflow-hidden'>
            <div className="relative px-4 lg:px-8">
            <div className="mx-auto py-20 sm:py-40 lg:py-48">
                <div className="text-center">
                <h1 className="md:w-[800px] lg:w-[850px] mx-auto px-4 text-3xl font-bold tracking-tight text-gray-900 sm:text-6xl">
                    A pair of tools for boosting spike sorting productivity
                </h1>
                <p className="mt-6 text-lg md:w-[500px] lg:w-[600px] mx-auto leading-8 text-gray-600">
                    A master{"'"}s project focused on increasing the rate of learning and iteration in the fields of neuroscience and neural recording
                </p>
                <div className="mt-10 flex items-center justify-center gap-x-6">
                    <a href="#choose-your-setup" className="rounded-md bg-slate-700 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-teal-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600" >
                        Learn More
                    </a>
                </div>
                </div>
            </div>          
            </div>

            <div className='absolute hidden md:flex top-[calc(100vh-4rem)] pb-6 w-full justify-center z-10'>
                <Link href="#features">
                    <motion.div className='cursor-pointer' whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                    <AiOutlineArrowDown size={25} />
                    </motion.div>
                </Link>
            </div>
        </section>
    );
}