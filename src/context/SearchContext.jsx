import React, { createContext, useContext, useState } from 'react';

const SearchContext = createContext();

export const useSearch = () => {
    const context = useContext(SearchContext);
    if (!context) {
        throw new Error('useSearch must be used within a SearchProvider');
    }
    return context;
};

export const SearchProvider = ({ children }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [searchResults, setSearchResults] = useState([]);

    const updateSearch = (term) => {
        setSearchTerm(term);
    };

    const clearSearch = () => {
        setSearchTerm('');
        setSearchResults([]);
    };

    return (
        <SearchContext.Provider value={{
            searchTerm,
            searchResults,
            setSearchResults,
            updateSearch,
            clearSearch
        }}>
            {children}
        </SearchContext.Provider>
    );
};

export default SearchContext;