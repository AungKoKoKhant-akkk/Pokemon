import React from 'react';
import SearchBar from '../../components/SearchBar/SearchBar';
import PokemonGrid from '../../components/PokemonGrid/PokemonGrid';

const HomePage = () => {
    return (
        <>
            <SearchBar />
            <PokemonGrid />
        </>
    );
};

export default HomePage;