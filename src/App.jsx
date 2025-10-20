import React from 'react';
import { Routes, Route } from 'react-router-dom';

// Context Providers
import { SearchProvider } from './context/SearchContext';
import { FavoritesProvider } from './context/FavoritesContext';
import { ComparisonProvider } from './context/ComparisonContext';
import { ThemeProvider } from './context/ThemeContext';
import { LanguageProvider } from './context/LanguageContext';
import { PokemonDataProvider } from './context/PokemonDataContext';
import { PokemonQuizProvider } from './context/PokemonQuizContext';

// Components
import Navigation from './components/Navigation/Navigation';

// Pages
import HomePage from './pages/HomePage/HomePage';
import PokemonDetail from './pages/PokemonDetail/PokemonDetail';
import PokemonComparison from './pages/PokemonComparison/PokemonComparison';
import PokemonQuiz from './pages/PokemonQuiz/PokemonQuiz';
import Favorites from './pages/Favorites/Favorites';

// Global Styles
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import 'bootstrap-icons/font/bootstrap-icons.css';
import './assets/theme.css';

const App = () => {
    return (
        <ThemeProvider>
            <LanguageProvider>
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
            </LanguageProvider>
        </ThemeProvider>
    );
};

export default App;