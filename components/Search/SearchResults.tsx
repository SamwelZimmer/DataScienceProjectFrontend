'use client';

import { SearchResultsProps } from "./Search";

const SearchResults = ({ searchResults }: SearchResultsProps) => {
  return (
    <div>   
      {searchResults && searchResults.map(result => (
          <div key={result.result}>
              {result.result}
          </div>
      ))}
    </div>
  );
}

export default SearchResults;