'use client';

import ReactMarkdown from 'react-markdown';
import rehypeRaw from "rehype-raw";
import { useState } from 'react';
import { Toaster } from 'react-hot-toast';

import { successToast, errorToast } from '../../../lib/toasties';
import { uploadArticle } from "../../../lib/firebase";

export default function NewsPage() {
    return (
        <>

            <main className="w-full flex flex-col justify-center items-center py-20 px-12">

                <h1 className='pb-6 text-3xl'>let{"'"}s make news</h1>

                <div className="w-full sm:w-[400px]">
                    <Form />
                </div>
            </main>

            <Toaster />
        </>
    );
}

const Form = () => {
    const [title, setTitle] = useState<string | undefined>("");
    const [content, setContent] = useState<string | undefined>("");

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()

        try {
            uploadArticle(title, content);
            successToast("i think it worked");
        } catch (err) {
            errorToast(err);
        }
    }




    return (
        <>
            <form onSubmit={handleSubmit} className='flex flex-col gap-6'>
                <input value={title} onChange={(e) => setTitle(e.target.value)} type="text" id="headline" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" placeholder="news headline" required />

                <textarea value={content} onChange={(e) => setContent(e.target.value)} id="message" rows={10} className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500" placeholder="news content in markdown" />



                <div className='w-full flex items-center flex-row gap-6 justify-center px-3'>
                    <button type="submit" className="text-white w-20 flex justify-center items-center self-center bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5">submit</button>
                </div>
            </form>

            <Preview content={content} />
        </>
    );
}

interface PreviewProps {
    content?: string;
}

const Preview: React.FC<PreviewProps> = ({ content="" }) => {

    return (
        <div className='flex flex-col justify-center items-center text-start gap-6 py-12'>

            <hr className='w-1/2' />

            <p className='opacity-30'>preview</p>
                        
            <ReactMarkdown rehypePlugins={[rehypeRaw]} className='markdown w-full'>
                {content}
            </ReactMarkdown>
        </div>
    );
}