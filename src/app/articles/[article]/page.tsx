"use client";

import React, { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation'
import ReactMarkdown from 'react-markdown';
import rehypeRaw from "rehype-raw";

import { Article } from "../page";
import { getArticle } from "../../../../lib/firebase";


export default function ArticlePage () {

    const [article, setArticle] = useState<Article | null>(null);
    const [content, setContent] = useState<string | null>(null);
    const [formattedDate, setFormattedDate] = useState<string | null>(null);

    const pathname = usePathname();

    const slug = pathname.split("/").pop();


    useEffect(() => {
        // Fetch the article inside the effect
        getArticle(slug).then(fetchedArticle => {
            const articleData = fetchedArticle as Article;
            setArticle(articleData);
            if (articleData?.content) setContent(articleData.content.replace(/\\n/g, '\n'))
    
            if (articleData?.datetime) {
                const date = new Date(Number(articleData.datetime.seconds * 1000)); // assuming datetime.seconds is in seconds
                const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
                setFormattedDate(date.toLocaleDateString('en-US', options));
            }
        });
    }, [slug]);
    

    return (
        <main  className="w-full sm:w-[400px] md:w-[600px]  mx-auto flex flex-col justify-between p-3 ">

            <span className='opacity-50'>{formattedDate}</span>

            {content && (
                <ReactMarkdown rehypePlugins={[rehypeRaw]} className='markdown w-full'>
                    {content}
                </ReactMarkdown>
            )}
        </main>
    );
}
