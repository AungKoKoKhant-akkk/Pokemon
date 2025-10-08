import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { SearchProvider } from './context/SearchContext';
import { FavoritesProvider } from './context/FavoritesContext';
import { ComparisonProvider } from './context/ComparisonContext';
import { ThemeProvider } from './context/ThemeContext';
import { PokemonDataProvider } from './context/PokemonDataContext';
import { PokemonQuizProvider } from './context/PokemonQuizContext';
import Navigation from "./components/Navigation/Navigation.jsx";
import "bootstrap/dist/css/bootstrap.css"
import "bootstrap/dist/js/bootstrap.bundle.min.js"
import "bootstrap-icons/font/bootstrap-icons.css"
import "./assets/theme.css"
import HomePage from "./pages/HomePage/HomePage.jsx";
import PokemonDetail from "./pages/PokemonDetail/PokemonDetail.jsx";
import PokemonComparison from "./pages/PokemonComparison/PokemonComparison.jsx";
import PokemonQuiz from "./pages/PokemonQuiz/PokemonQuiz.jsx";
import Favorites from "./pages/Favorites/Favorites.jsx";

const App = () => {
    return (
        <ThemeProvider>
            <PokemonDataProvider>
                <PokemonQuizProvider>
                    <FavoritesProvider>
                        <SearchProvider>
                            <ComparisonProvider>
                                <div>
                                    <Navigation />
                                    <Routes>
                                        <Route path="/" element={<HomePage />} />
                                        <Route path="/pokemon/:name" element={<PokemonDetail />} />
                                        <Route path="/comparison" element={<PokemonComparison />} />
                                        <Route path="/quiz" element={<PokemonQuiz />} />
                                        <Route path="/favorites" element={<Favorites />} />
                                    </Routes>
                                </div>
                            </ComparisonProvider>
                        </SearchProvider>
                    </FavoritesProvider>
                </PokemonQuizProvider>
            </PokemonDataProvider>
        </ThemeProvider>
    );
};

export default App;