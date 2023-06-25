'use client';

import Image from "next/image";

import { SearchResultsProps, FaceResult } from "./page";

const SearchResults = ({ searchResults, searchTerm }: SearchResultsProps) => {
    return (
        <>  
            {
                searchTerm && 
                <div className="relative flex flex-col justify-center p-3 gap-3 rounded-lg border w-max mx-auto">
                    <div className="w-[200px] h-auto">
                        <Image 
                            alt={"searched Image"} 
                            src={searchTerm} 
                            width={300} 
                            height={300} 
                        />
                    </div>

                    <span className="font-medium text-center">Your Input Image</span>
                </div>
            }


            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 w-max mx-auto"> 
                {searchResults?.map((person, i) => (
                    <PersonCard key={i} person={person} />
                ))}
            </div>
        </>

    );
}

interface PersonCardProps {
    person: FaceResult;
}

const PersonCard = ({ person }: PersonCardProps ) => {

    return (
        <div className="relative flex flex-col justify-center p-3 gap-3 rounded-lg border w-max mx-auto">
        <div className="w-[200px] h-auto">
            <Image 
                alt={"searched Image"} 
                src={`https://image.tmdb.org/t/p/h632/${person.profile_path}`} 
                width={200} 
                height={300} 
            />
        </div>

        <span className="font-medium text-center">{person.name}</span>

    </div>
    );
}

export default SearchResults;