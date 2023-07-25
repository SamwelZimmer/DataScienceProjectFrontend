"use client"

import { motion } from "framer-motion";
import Link from "next/link";
import { useState, useRef, useEffect } from "react";

import styles from "./GeneratorPage.module.css"
import Navbar from "../../../../components/Navbar";
import NavButtons from "./components/NavButtons";
import PlacementSection from "./sections/PlacementSection";

const sectionNames = ["Placement", "Neuron", "Spikes"];

export default function GeneratorPage() {
    const [activeSection, setActiveSection] = useState(0);

    const section1 = useRef<HTMLDivElement>(null);
    const section2 = useRef<HTMLDivElement>(null);
    const section3 = useRef<HTMLDivElement>(null);

    const sections: Array<React.RefObject<HTMLDivElement>> = [section1, section2, section3];

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
                        <h2>Section 2 Will Go Here</h2>
                    </div>
                </section>

                <section ref={section3} className={`${styles.snapsection} flex items-center justify-center`}>
                    <div className="relative w-full h-full sm:w-[600px] md:w-[700px] py-24">
                        <h2>Section 3. Miss Me?</h2>
                    </div>
                </section>

            </main>

            <NavButtons activeSection={activeSection} sections={sections} scrollTo={scrollTo} names={sectionNames} />

        </>
    );
}
