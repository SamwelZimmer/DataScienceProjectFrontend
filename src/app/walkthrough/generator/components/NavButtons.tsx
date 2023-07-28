"use client"

import { motion } from "framer-motion";
import { VscChevronLeft, VscChevronRight } from "react-icons/vsc";

interface NavButtonsProps {
    activeSection: number;
    sections: Array<React.RefObject<HTMLDivElement>>;
    names: Array<string>;
    scrollTo: (section: React.RefObject<HTMLDivElement>) => void;
}

export default function NavButtons({ activeSection, sections, scrollTo, names }: NavButtonsProps) {

    const handleRightClick = () => {
        if (activeSection != sections.length  - 1) {
            scrollTo(sections[activeSection + 1])
        };
    };
    
    const handleLeftClick = () => {
        if (activeSection != 0) {
            scrollTo(sections[activeSection - 1])
        };
    };
    
    return (
        <>
            <div className="fixed bottom-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex gap-6 items-center">

                {
                    activeSection != 0 ?
                    <motion.button 
                        onClick={handleLeftClick} 
                        whileHover={{ scale: 1.1, translateX: -2 }} 
                        whileTap={{ scale: 0.9 }}
                        className="flex items-center gap-1"
                    >
                        <span className="text-sm opacity-50">{names[activeSection - 1]}</span>
                        <VscChevronLeft size={30} />
                    </motion.button>
                    :
                    <motion.button className="opacity-0 flex items-center gap-1">
                        <span>{names[activeSection]}</span>
                        <VscChevronLeft size={30} />
                    </motion.button>
                }

                
                {
                    activeSection != sections.length  - 1 ?

                    <motion.button 
                        onClick={handleRightClick} 
                        whileHover={{ scale: 1.1, translateX: 2 }} 
                        whileTap={{ scale: 0.9 }}
                        className="flex items-center"
                    >
                        <VscChevronRight size={30} />
                        <span className="text-sm opacity-50">{names[activeSection + 1]}</span>
                    </motion.button>
                    :
                    <motion.button className="opacity-0 flex items-center">
                        <VscChevronRight size={30} />
                        <span>{names[activeSection]}</span>
                    </motion.button>

                }

            </div>
        </>
    );
};
