import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { SearchProvider } from './context/SearchContext';
import { FavoritesProvider } from './context/FavoritesContext';
import { ComparisonProvider } from './context/ComparisonContext';
import { ThemeProvider } from './context/ThemeContext';
import Nav from "./componenets/nav/nav.jsx";
import SearchBar from "./SearchBar/searchBar.jsx";
import "bootstrap/dist/css/bootstrap.css"
import "bootstrap/dist/js/bootstrap.bundle.min.js"
import "bootstrap-icons/font/bootstrap-icons.css"
import "./assets/theme.css"
import Categories from "./pages/components/categories/categories.jsx";
import PokemonDetail from "./pages/PokemonDetail/PokemonDetail.jsx";
import PokemonComparison from "./pages/PokemonComparison/PokemonComparison.jsx";
import PokemonQuiz from "./pages/PokemonQuiz/PokemonQuiz.jsx";

const App = () => {
    return (
        <ThemeProvider>
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
                                <Route path="/quiz" element={<PokemonQuiz />} />
                            </Routes>
                        </div>
                    </ComparisonProvider>
                </SearchProvider>
            </FavoritesProvider>
        </ThemeProvider>
    );
};

export default App;