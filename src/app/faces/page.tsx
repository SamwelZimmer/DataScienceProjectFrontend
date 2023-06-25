"use client";

import { useState } from "react";

// import SearchBar from "./SearchBar";
// import SearchResults from "./SearchResults";

export interface FaceResult {
    birthday: string;
    name: string;
    place_of_birth: string;
    popularity: number;
    profile_path: string;
}

export interface SearchBarProps {
    searchTerm: string;
    setSearchTerm: React.Dispatch<React.SetStateAction<string>>;
    setSearchResults: React.Dispatch<React.SetStateAction<FaceResult[] | null>>;
}

export interface SearchResultsProps {
    searchTerm: string;
    searchResults: FaceResult[] | null;
}

export default function FacesPage() {

    const [searchResults, setSearchResults] = useState<FaceResult[] | null>(null);
    const [searchTerm, setSearchTerm] = useState("");

    return (
      <>
        <main className="flex min-h-screen flex-col items-center justify-between py-24 px-6">
            {/* <section className='w-full flex flex-col gap-6'>
                    <div className="w-full sm:w-[400px] mx-auto">
                        <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} setSearchResults={setSearchResults} />
                    </div>
                    <SearchResults searchTerm={searchTerm} searchResults={searchResults} />
            </section> */}
            Face Search
        </main>
      </>
    )
}
