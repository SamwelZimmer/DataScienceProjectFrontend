"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { CgOptions } from "react-icons/cg";

import { SearchBarProps } from "./Search";

const SearchBar = ({ setSearchResults }: SearchBarProps) => {

    const [searchTerm, setSearchTerm] = useState('');
    const [open, setOpen] = useState(false);
    const [searchType, setSearchType] = useState('search');

    const search = async () => {
        // const response = await fetch(`https://samwelzimmer.pythonanywhere.com/${searchType}?term=${searchTerm}`);
        const response = await fetch(`http://127.0.0.1:5000/${searchType}?term=${searchTerm}`);
        const data = await response.json();
        setSearchResults([{ result: data.result }])
    };

    const handleSubmit = (e: React.SyntheticEvent) => {
        e.preventDefault();
        search();
    }

    return (
      <form onSubmit={handleSubmit}>   
          <label htmlFor="default-search" className="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white">Search</label>
          <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-5 pointer-events-none">
                  <svg aria-hidden="true" className="w-5 h-5 text-gray-500 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
              </div>
              <input
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                type="search"  
                id="default-search" 
                className="block w-full p-4 pl-12 pr-12 text-sm text-gray-900 border border-gray-300 rounded-full bg-gray-50 focus:ring-blue-500 focus:border-blue-500" 
                placeholder="Search..." 
                required 
                />
                <div onMouseEnter={() => setOpen(true)} onMouseLeave={() => setOpen(false)} className="absolute z-10 inset-y-0 right-0 flex items-center pr-5">
                    <div className="relative flex items-center">
                        <motion.button  className="" >
                            <CgOptions size={20} />
                        </motion.button>

                        <motion.div className={`${!open && "hidden"} flex items-center justify-center w-full absolute top-full pt-3`}>
                            <ul className="border p-3 rounded-lg bg-white w-max cursor-pointer">
                                {searchTypes.map((type, i) => (
                                    <li className={`${searchType == type && "opacity-50"}`} onClick={() => setSearchType(type)} key={i}>{type}</li>
                                ))}
                            </ul>
                        </motion.div>
                    </div>

                </div>

          </div>
      </form>
    );
}

const searchTypes = ["search", "maths", "faces"]

export default SearchBar