"use client"

import { motion } from "framer-motion";
import Link from "next/link";
import { useState, useRef, useEffect } from "react";

import styles from "./GeneratorPage.module.css"
import Navbar from "../../../../components/Navbar";
import NavButtons from "./components/NavButtons";
import PlacementSection from "./sections/PlacementSection";
import NeuronSection from "./sections/NeuronSection";
import ProcessingSection from "./sections/ProcessingSection";
import ExtractionSection from "./sections/ExtractionSection";

export type Signal = {
    x: number[];
    y: number[];
};

export interface NeuronParams {
    neuron_type: string;
    lambda: number;
    v_rest: number;
    v_thres: number;
    t_ref: number;
    fix_random_seed: boolean;
}

const sectionNames = ["Placement", "Neuron", "Processing", "Spikes"];

export default function GeneratorPage() {
    const [activeSection, setActiveSection] = useState(0);

    const [neuronSignal, setNeuronSignal] = useState<Signal | null>(null);

    const section1 = useRef<HTMLDivElement>(null);
    const section2 = useRef<HTMLDivElement>(null);
    const section3 = useRef<HTMLDivElement>(null);
    const section4 = useRef<HTMLDivElement>(null);

    const sections: Array<React.RefObject<HTMLDivElement>> = [section1, section2, section3, section4];

    // called whenever the user scrolls
    const handleScroll = () => {
        for (let i = 0; i < sections.length; i++) {
        const section = sections[i];
        if (section.current) {
            const { top, bottom } = section.current.getBoundingClientRect();
            if (top <= window.innerHeight / 2 && bottom >= window.innerHeight / 2) {
            setActiveSection(i);
            break;
            }
        }
        }
    };

    // attach the scroll listener
    useEffect(() => {
        const main = document.querySelector('main');
        main?.addEventListener('scroll', handleScroll);
    
        return () => {
        main?.removeEventListener('scroll', handleScroll);
        };
    }, []); 
    
    function scrollTo(section: React.RefObject<HTMLDivElement>) {
        section.current?.scrollIntoView({ behavior: 'smooth' });
    };

    return (
        <>
            <Navbar />

            <main  className={`${styles.snapcontainer} snap-container font-sans overflow-x-hidden`}>

                <section ref={section1} className={`${styles.snapsection} flex items-center justify-center`}>
                    <div className="relative w-full h-full sm:w-[600px] md:w-[700px] py-24">
                        <PlacementSection />
                    </div>
                </section>

                <section ref={section2} className={`${styles.snapsection} flex items-center justify-center`}>
                    <div className="relative w-full h-full sm:w-[600px] md:w-[700px] py-24">
                        <NeuronSection signal={neuronSignal} setSignal={setNeuronSignal} />
                    </div>
                </section>

                <section ref={section3} className={`${styles.snapsection} flex items-center justify-center`}>
                    <div className="relative w-full h-full sm:w-[600px] md:w-[700px] py-24">
                        <ProcessingSection signal={neuronSignal} />
                    </div>
                </section>

                <section ref={section4} className={`${styles.snapsection} flex items-center justify-center`}>
                    <div className="relative w-full h-full sm:w-[600px] md:w-[700px] py-24">
                        <ExtractionSection />
                    </div>
                </section>

            </main>

            <NavButtons activeSection={activeSection} sections={sections} scrollTo={scrollTo} names={sectionNames} />

        </>
    );
}
