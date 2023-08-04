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
import GenerateSection from "./sections/GenerateSection";
import RecordingSection from "./sections/RecordingSection";
import ExtractionSection from "./sections/ExtractionSection";
import FeaturesSection from "./sections/FeaturesSection";
import ClusteringSection from "./sections/ClusteringSection";
import TriangulationSection from "./sections/TriangulationSection";

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

export default function GeneratorPage() {
    const [activeSection, setActiveSection] = useState(0);

    // state to determine which sections can be active
    const [isPlacements, setIsPlacements] = useState(false);
    const [isNeuronType, setIsNeuronType] = useState(false);
    const [preprocessed, setPreprocessed] = useState(false);
    const [generated, setGenerated] = useState(false);
    const [reduced, setReduced] = useState(false);
    const [extracted, setExtracted] = useState(false);
    const [clustered, setClustered] = useState(false);

    const [neuronSignal, setNeuronSignal] = useState<Signal | null>(null);

    const section1 = useRef<HTMLDivElement>(null);
    const section2 = useRef<HTMLDivElement>(null);
    const section3 = useRef<HTMLDivElement>(null);
    const section4 = useRef<HTMLDivElement>(null);
    const section5 = useRef<HTMLDivElement>(null);
    const section6 = useRef<HTMLDivElement>(null);
    const section7 = useRef<HTMLDivElement>(null);
    const section8 = useRef<HTMLDivElement>(null);
    const section9 = useRef<HTMLDivElement>(null);

    // only show certain number of sections before simulation
    let sections: Array<React.RefObject<HTMLDivElement>> = [section1, section2, section3, section4, section5, section6, section7, section8, section9];
    let sectionNames = ["Placement", "Neuron", "Processing", "Generate", "Recordings", "Spikes", "Reduction", "Clustering", "Triangulation"];

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

    useEffect(() => {

        const placements = JSON.parse(sessionStorage.getItem('placements') || "[]");
        if (placements.filter((item: number) => item === 1).length >= 1 && placements.filter((item: number) => item === 2).length >= 3) {
            setIsPlacements(true);
        } else {
            setIsPlacements(false);
        }

        const neuronParams = sessionStorage.getItem('neuronParams');
        if (isPlacements && neuronParams) {
            setIsNeuronType(true);
        } else {
            setIsNeuronType(false);
        }

        const processingParams = sessionStorage.getItem('processingParams');
        if (isNeuronType && processingParams) {
            setPreprocessed(true);
        } else {
            setPreprocessed(false);
        }

        const recordedSignals = sessionStorage.getItem('recordedSignals');
        if (preprocessed && recordedSignals) {
            setGenerated(true); 
        } else {
            setGenerated(false); 
        }

        const waveforms = sessionStorage.getItem('waveforms');
        if (generated && waveforms) {
            setExtracted(true);
        } else {
            setExtracted(false);
        }

        const reductionData = sessionStorage.getItem('reductionData');
        if (extracted && reductionData) {
            setReduced(true);
        } else {
            setReduced(false);
        }

        const clusteringParams = sessionStorage.getItem('clusteringParams');
        if (reduced && clusteringParams) {
            setClustered(true);
        } else {
            setClustered(false);
        }

    }, [activeSection]);

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
                        <h1 className="text-4xl font-semibold px-12 sm:px-0">Neuron Type and Signal</h1>
                        {
                            isPlacements ? <NeuronSection signal={neuronSignal} setSignal={setNeuronSignal} /> :
                            <div className="w-full h-full flex items-center justify-center px-12 sm:px-0 py-24">
                                <div onClick={() => scrollTo(section1)} className="w-full h-full border rounded-md border-dashed flex items-center justify-center hover:text-black/50 cursor-pointer">
                                    <span className="px-12 text-center font-light">Place at least 3 Electrodes and 1 Neuron to Continue</span>
                                </div>
                            </div>                    
                        }
                    </div>
                </section>

                <section ref={section3} className={`${styles.snapsection} flex items-center justify-center`}>
                    <div className="relative w-full h-full sm:w-[600px] md:w-[700px] py-24">
                        <h1 className="text-4xl font-semibold px-12 sm:px-0">Signal Noise and Filtering</h1>
                        {
                            isNeuronType ? <ProcessingSection signal={neuronSignal} /> :
                            <div className="w-full h-full flex items-center justify-center px-12 sm:px-0 py-24">
                                <div onClick={() => scrollTo(section2)} className="w-full h-full border rounded-md border-dashed flex items-center justify-center hover:text-black/50 cursor-pointer">
                                    <span className="px-12 text-center font-light">Configure Neuron Parameters to Continue</span>
                                </div>
                            </div>                    
                        }
                    </div>
                </section>

                <section ref={section4} className={`${styles.snapsection} flex items-center justify-center`}>
                    <div className="relative w-full h-full py-24">
                        <h1 className="text-4xl font-semibold px-12 sm:px-0 w-full sm:w-[600px] md:w-[700px] mx-auto">Generate Signals</h1>
                        {
                            preprocessed ? <GenerateSection /> :
                            <div className="relative w-full h-full mx-auto sm:w-[600px] md:w-[700px]">
                                <div className="w-full h-full flex items-center justify-center px-12 sm:px-0 py-24">
                                    <div onClick={() => scrollTo(section3)} className="w-full h-full border rounded-md border-dashed flex items-center justify-center hover:text-black/50 cursor-pointer">
                                        <span className="px-12 text-center font-light">Configure Signal Noise and Preprocessing to Continue</span>
                                    </div>
                                </div>       
                            </div>             
                        }
                        
                    </div>
                </section>

                {/* canny go any further until signal generation */}

                <section ref={section5} className={`${styles.snapsection} flex items-center justify-center`}>
                    
                    <div className="relative w-full h-full sm:w-[600px] md:w-[700px] py-24">
                        <h1 className="text-4xl font-semibold px-12 sm:px-0">Electrode Recordings</h1>
                        {
                            generated 
                            ?
                            <RecordingSection />
                            :
                            <div className="w-full h-full flex items-center justify-center px-12 sm:px-0 py-24">
                                <div onClick={() => scrollTo(section4)} className="w-full h-full border rounded-md border-dashed flex items-center justify-center hover:text-black/50 cursor-pointer">
                                    <span className="px-12 text-center font-light">Generate Signal to Continue</span>
                                </div>
                            </div>
                        }
                    </div>
                </section>

                <section ref={section6} className={`${styles.snapsection} flex items-center justify-center`}>
                    <div className="relative w-full h-full sm:w-[600px] md:w-[700px] py-24">
                    <h1 className="text-4xl font-semibold px-12 sm:px-0">Spike Extraction</h1>
                        {
                            generated 
                            ?
                            <ExtractionSection />
                            :
                            <div className="w-full h-full flex items-center justify-center px-12 sm:px-0 py-24">
                                <div onClick={() => scrollTo(section4)} className="w-full h-full border rounded-md border-dashed flex items-center justify-center hover:text-black/50 cursor-pointer">
                                    <span className="px-12 text-center font-light">Generate Signal to Continue</span>
                                </div>
                            </div>
                        }
                        
                    </div>
                </section>

                <section ref={section7} className={`${styles.snapsection} flex items-center justify-center`}>
                    <div className="relative w-full h-full sm:w-[600px] md:w-[700px] py-24">
                        <h1 className="text-4xl font-semibold px-12 sm:px-0">Dimensionality Reduction</h1>
                        {
                            extracted ? 
                            <FeaturesSection /> : 
                            <div className="w-full h-full flex items-center justify-center px-12 sm:px-0 py-24">
                                <div onClick={() => scrollTo(section6)} className="w-full h-full border rounded-md border-dashed flex items-center justify-center hover:text-black/50 cursor-pointer">
                                    <span className="px-12 text-center font-light">Extract Waveforms to Continue</span>
                                </div>
                            </div>
                        }
                    </div>
                </section>

                <section ref={section8} className={`${styles.snapsection} flex items-center justify-center`}>
                    <div className="relative w-full h-full sm:w-[600px] md:w-[700px] py-24">
                        <h1 className="text-4xl font-semibold px-12 sm:px-0">Neuron Clustering</h1>
                        {
                            reduced ? 
                            <ClusteringSection /> : 
                            <div className="w-full h-full flex items-center justify-center px-12 sm:px-0 py-24">
                                <div onClick={() => scrollTo(section7)} className="w-full h-full border rounded-md border-dashed flex items-center justify-center hover:text-black/50 cursor-pointer">
                                    <span className="px-12 text-center font-light">Reduce Dimensions to Continue</span>
                                </div>
                            </div>
                        }
                        
                    </div>
                </section>

                <section ref={section9} className={`${styles.snapsection} flex items-center justify-center`}>
                    <div className="relative w-full h-full sm:w-[600px] md:w-[700px] py-24">
                        <h1 className="text-4xl font-semibold px-12 sm:px-0">Triangulation</h1>
                        {
                            clustered ? 
                            <TriangulationSection /> : 
                            <div className="w-full h-full flex items-center justify-center px-12 sm:px-0 py-24">
                                <div onClick={() => scrollTo(section8)} className="w-full h-full border rounded-md border-dashed flex items-center justify-center hover:text-black/50 cursor-pointer">
                                    <span className="px-12 text-center font-light">Cluster the Spikes to Continue</span>
                                </div>
                            </div>
                        }
                    </div>
                </section>

            </main>

            <NavButtons activeSection={activeSection} sections={sections} scrollTo={scrollTo} names={sectionNames} />

        </>
    );
}
