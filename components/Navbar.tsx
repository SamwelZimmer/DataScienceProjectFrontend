"use client";

import { AiOutlineMenu, AiOutlineArrowLeft, AiOutlineFileText, AiOutlineHome, AiOutlineMenuUnfold, AiOutlineBulb } from "react-icons/ai";
import { VscGraphScatter } from "react-icons/vsc";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { useState } from "react";

export default function Navbar({ showBackButton=true }) {

    const [isOpen, setIsOpen] = useState(false);

    const router = useRouter();

    const variants = {
        enter: { opacity: 1, x: 0 },
        exit: { opacity: 0, x: "-100%" },
    }

    return (
        <>
            <motion.div onMouseEnter={() => setIsOpen(true)} onMouseLeave={() => setIsOpen(false)} transition={{ layout: { duration: 0.2 } }} layout className={`fixed z-40 top-0 left-0 p-3 flex flex-col justify-between h-screen ${isOpen && 'border-r-2 border-black bg-white'}`}>
                <div className="flex gap-6 flex-col">
                    <motion.div layout="position" className="cursor-pointer backdrop-blur-sm rounded-lg">
                        { isOpen ? <AiOutlineMenuUnfold size={30} /> : <AiOutlineMenu size={30} /> }
                    </motion.div>

                    {isOpen && (
                        
                        <motion.div className="flex flex-col w-full items-center gap-3">
                            { navItems.map((item, index) => <NavItem key={index} {...item} />) }
                        </motion.div>
                    )}
                </div>
                { showBackButton && 
                    <motion.div onClick={() => router.back()} className="flex flex-row backdrop-blur-sm rounded-lg items-center gap-3 cursor-pointer hover:opacity-50">
                        { isOpen && <p>go back</p> }
                        <motion.div layout="position"><AiOutlineArrowLeft size={30} /></motion.div> 
                    </motion.div>
                }
                
            </motion.div>
        </>
    );
}

const navItems = [
    {route: "/", Icon: AiOutlineHome, text: "Home" },
    {route: "/articles", Icon: AiOutlineFileText, text: "Articles" },
    {route: "/single-channel", Icon: AiOutlineBulb, text: "Single Channel" },
    {route: "/walkthrough", Icon: VscGraphScatter, text: "Walkthrough" }
];

interface NavItemProps {
    route: string;
    Icon: React.ComponentType<any>;
    size?: number; 
    text: string;
};

const NavItem = ({ route, Icon, text, size=30 }: NavItemProps ) => {

    return (
        <Link href={route} className="flex flex-row w-full items-center gap-3 hover:opacity-50">
            <Icon size={size} />
            <p>{text}</p>
        </Link>
    );
};
