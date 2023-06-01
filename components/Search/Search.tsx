"use client";

import { useState } from "react";

import SearchBar from "./SearchBar";
import SearchResults from "./SearchResults";

export type SearchResult = {
    result: string;
};

export interface SearchBarProps {
    setSearchResults: React.Dispatch<React.SetStateAction<SearchResult[] | null>>;
}

export interface SearchResultsProps {
    searchResults: SearchResult[] | null;
}

export default function Search() {

    const [searchResults, setSearchResults] = useState<SearchResult[] | null>(null);

    console.log("searchResults", searchResults)

    return (
      <>
        <div className='w-full sm:w-[400px] flex flex-col gap-6'>
            <SearchBar setSearchResults={setSearchResults} />
            <SearchResults searchResults={searchResults} />
        </div>
      </>
    )
}