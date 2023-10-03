import Link from "next/link";
import Image from "next/image";

export default function Footer() {

    const date = new Date();

    return (

        <footer className="p-4 bg-gray-100 border-t-2 border-black shadow md:px-6 md:py-8">
            <div className="sm:flex sm:items-center sm:justify-between">
                <Link href="/" className="flex items-center mb-4 sm:mb-0">
                    <span className="self-center text-2xl font-semibold whitespace-nowrap">Samwel Zimmer</span>
                </Link>

                <span className="block text-sm text-gray-500 sm:text-center">
                <span className="text-xs font-light pr-4">Project Associated with the University of Bristol</span> © {date.getFullYear()} <Link href="/" className="hover:underline"></Link> 
                </span>
       
            </div>
            
        </footer>

    );
};