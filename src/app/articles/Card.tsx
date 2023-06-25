"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { AiOutlineInfoCircle } from "react-icons/ai";

import { Article } from "./page";

interface CardProps {
    article: Article;
}

export default function Card ({ article }: CardProps) {
    
    const [flipped, setFlipped] = useState(false);

    const date = new Date(Number(article.datetime));
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
    const formattedDate = date.toLocaleDateString('en-US', options);

    const handleFlip = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setFlipped(!flipped);
    }
    return (
        <>  
            <Link href={`articles/${article.id}`} className="relative w-full flex flex-col justify-between p-3 gap-1 border rounded-lg cursor-pointer hover:border-slate-800">
                <span className="font-bold">{article.title}</span>
                { 
                    flipped 
                    ? 
                    <div className="flex flex-col opacity-50">
                        <span className=""><span className="opacity-50">type:</span> {article.type}</span>
                        <span className=""><span className="opacity-50">style:</span> {article.writingStyle}</span>
                    </div>
                    : 
                    <div className="flex flex-col opacity-50">
                        <span className="opacity-50">{article.readingTime} min read</span>
                        <span className="">{formattedDate}</span>
                    </div>
                }  
            
            <motion.button onClick={handleFlip} className="absolute right-0 bottom-0 p-3 hover:opacity-50">
                <AiOutlineInfoCircle size={20} />
            </motion.button>

            
            </Link>
        </>

    );
}