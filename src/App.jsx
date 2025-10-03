import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { SearchProvider } from './context/SearchContext';
import { FavoritesProvider } from './context/FavoritesContext';
import { ComparisonProvider } from './context/ComparisonContext';
import Nav from "./componenets/nav/nav.jsx";
import SearchBar from "./SearchBar/searchBar.jsx";
import "bootstrap/dist/css/bootstrap.css"
import "bootstrap/dist/js/bootstrap.bundle.min.js"
import "bootstrap-icons/font/bootstrap-icons.css"
import Categories from "./pages/components/categories/categories.jsx";
import PokemonDetail from "./pages/PokemonDetail/PokemonDetail.jsx";
import PokemonComparison from "./pages/PokemonComparison/PokemonComparison.jsx";

const App = () => {
    return (
        <FavoritesProvider>
            <SearchProvider>
                <ComparisonProvider>
                    <div>
                        <Nav />
                        <Routes>
                            <Route path="/" element={
                                <>
                                    <SearchBar />
                                    <Categories />
                                </>
                            } />
                            <Route path="/pokemon/:name" element={<PokemonDetail />} />
                            <Route path="/comparison" element={<PokemonComparison />} />
                        </Routes>
                    </div>
                </ComparisonProvider>
            </SearchProvider>
        </FavoritesProvider>
    );
};

export default App;