"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { CgOptions } from "react-icons/cg";

import { SearchBarProps } from "./page";

const SearchBar = ({ setSearchResults, searchTerm, setSearchTerm }: SearchBarProps) => {

    const [searchText, setSearchText] = useState("")

    const search = async () => {
        // const response = await fetch(`https://samwelzimmer.pythonanywhere.com/faces?img=${searchTerm}`);
        // const response = await fetch(`http://127.0.0.1:5000/faces?img=${encodeURIComponent(searchTerm)}`);
        // const data = await response.json();
        // setSearchResults(data.result);
    };

    const handleSubmit = (e: React.SyntheticEvent) => {
        e.preventDefault();
        search();
        setSearchTerm(searchText)
    }

    return (
      <form onSubmit={handleSubmit}>   
          <label htmlFor="default-search" className="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white">Search</label>
          <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-5 pointer-events-none">
                  <svg aria-hidden="true" className="w-5 h-5 text-gray-500 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
              </div>
              <input
                value={searchText}
                onChange={e => setSearchText(e.target.value)}
                type="search"  
                id="default-search" 
                className="block w-full p-4 pl-12 text-sm text-gray-900 border border-gray-300 rounded-full bg-gray-50 focus:ring-blue-500 focus:border-blue-500" 
                placeholder="Image Search..." 
                required 
                />
          </div>
      </form>
    );
}

export default SearchBar