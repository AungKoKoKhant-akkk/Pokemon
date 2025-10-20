import React, { useEffect, useState, useRef } from 'react';
import { useSearch } from '../../context/SearchContext';
import { useFavorites } from '../../context/FavoritesContext';
import { useComparison } from '../../context/ComparisonContext';
import { usePokemonData } from '../../context/PokemonDataContext';
import { useLocalStorageObject, useMultipleFeedback } from '../../hooks';
import Pagination from "../Pagination/Pagination.jsx";
import PokemonCard from './PokemonCard';
import TypeFilter from './TypeFilter';
import { CARDS_PER_PAGE_OPTIONS, DEFAULT_CARDS_PER_PAGE, DEFAULT_PAGE } from '../../constants/pokemonGrid';


const PokemonGrid = () => {
    const { searchTerm } = useSearch();
    const { favoritesCount } = useFavorites();
    const { getComparisonCount } = useComparison();
    const { pokemonList, pokemonTypes, isLoading } = usePokemonData();
    const [pokemon, setPokemon] = useState([]);
    const [loading, setLoading] = useState(true);

    // Use custom hook for localStorage pagination state
    const [paginationState, , setPaginationValue] = useLocalStorageObject('pokemonList', {
        Page: DEFAULT_PAGE,
        CardsPerPage: DEFAULT_CARDS_PER_PAGE,
        Type: 'All'
    });

    // Extract values for easier use
    const { Page: currentPage, CardsPerPage: cardsPerPage, Type: selectedType } = paginationState;

    // Validate and fix localStorage values if they're no longer valid
    useEffect(() => {
        if (!CARDS_PER_PAGE_OPTIONS.includes(cardsPerPage)) {
            console.log(`⚠️ Invalid cards per page value (${cardsPerPage}), resetting to ${DEFAULT_CARDS_PER_PAGE}`);
            setPaginationValue('CardsPerPage', DEFAULT_CARDS_PER_PAGE);
        }
    }, [cardsPerPage, setPaginationValue]);

    // Use custom hook for feedback messages
    const feedback = useMultipleFeedback({
        favorite: { duration: 3000 },
        comparison: { duration: 3000 }
    });

    const [filteredPokemon, setFilteredPokemon] = useState([]);
    const [types, setTypes] = useState([]);

    // Track previous filter values to detect actual changes
    const prevSearchTerm = useRef(searchTerm);
    const prevSelectedType = useRef(selectedType);

    // Handle page changes with persistence using custom hook
    const handlePageChange = (page) => {
        setPaginationValue('Page', page);
    };

    const processCachedData = () => {
        if (pokemonList.length > 0) {
            console.log('📋 Using cached Pokemon data!');
            setPokemon(pokemonList);
            setFilteredPokemon(pokemonList);
            setTypes(pokemonTypes);
            setLoading(false);
        }
    }

    // Combined filtering function for both search and type filtering
    const applyFilters = (shouldResetPage = false) => {
        let filtered = pokemon;

        // Apply search filter
        if (searchTerm && searchTerm.length > 0) {
            filtered = filtered.filter(p =>
                p.name.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        // Apply type filter
        if (selectedType !== 'All') {
            filtered = filtered.filter(p =>
                p.pokemonTypes && p.pokemonTypes.some(pokemonType =>
                    pokemonType.toLowerCase() === selectedType.toLowerCase()
                )
            );
        }

        setFilteredPokemon(filtered);

        // Only reset to first page when filters actually change, not on component remount
        if (shouldResetPage) {
            setPaginationValue('Page', 1);
        }
    };

    const handleTypeFilter = (type) => {
        setPaginationValue('Type', type);
        setPaginationValue('Page', 1); // Reset to first page when changing filter
    };

    // Apply filters whenever search term, selected type, or pokemon data changes
    useEffect(() => {
        if (pokemon.length > 0) {
            // Check if filters actually changed
            const filtersChanged = (
                prevSearchTerm.current !== searchTerm ||
                prevSelectedType.current !== selectedType
            );

            applyFilters(filtersChanged);

            // Update previous values
            prevSearchTerm.current = searchTerm;
            prevSelectedType.current = selectedType;
        }
    }, [searchTerm, selectedType, pokemon]);

    useEffect(() => {
        if (!isLoading && pokemonList.length > 0) {
            processCachedData();
        } else {
            setLoading(isLoading);
        }
    }, [isLoading, pokemonList, pokemonTypes]);

    const totalPages = Math.ceil(filteredPokemon.length / cardsPerPage);
    const startIdx = (currentPage - 1) * cardsPerPage;
    const currentCards = filteredPokemon.slice(startIdx, startIdx + cardsPerPage);

    return (
        <div className="container">
            {/* Favorites Action Feedback Toast */}
            {feedback.favorite.feedback && (
                <div className="position-fixed top-0 start-50 translate-middle-x" style={{ zIndex: 1050, marginTop: '20px' }}>
                    <div className={`alert fade show ${feedback.favorite.feedback.type === 'added' ? 'alert-success' : 'alert-info'
                        }`} role="alert">
                        <i className={`bi ${feedback.favorite.feedback.type === 'added' ? 'bi-heart-fill text-danger' : 'bi-heart'
                            } me-2`}></i>
                        {feedback.favorite.feedback.message}
                    </div>
                </div>
            )}

            {/* Comparison Action Feedback Toast */}
            {feedback.comparison.feedback && (
                <div className="position-fixed top-0 start-50 translate-middle-x" style={{ zIndex: 1049, marginTop: feedback.favorite.feedback ? '80px' : '20px' }}>
                    <div className={`alert fade show ${feedback.comparison.feedback.type === 'success' ? 'alert-info' : 'alert-warning'
                        }`} role="alert">
                        <i className={`bi ${feedback.comparison.feedback.type === 'success' ? 'bi-bar-chart-fill' : 'bi-exclamation-triangle'
                            } me-2`}></i>
                        {feedback.comparison.feedback.message}
                    </div>
                </div>
            )}

            {loading ? (
                <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '300px' }}>
                    <div className="text-center">
                        <div className="spinner-border text-primary" style={{ width: '3rem', height: '3rem' }} role="status">
                            <span className="visually-hidden">Loading...</span>
                        </div>
                        <h4 className="mt-3">Loading Pokemon...</h4>
                    </div>
                </div>
            ) : (
                <>
                    {/* Type Filter Section */}
                    <TypeFilter
                        types={types}
                        selectedType={selectedType}
                        onTypeFilter={handleTypeFilter}
                        pokemon={pokemon}
                        filteredPokemon={filteredPokemon}
                        searchTerm={searchTerm}
                        favoritesCount={favoritesCount}
                        comparisonCount={getComparisonCount()}
                    />

                    {/* Pokemon Grid */}
                    {currentCards.length > 0 ? (
                        <div className="row mt-4 g-4">
                            {currentCards.map((pokemon, index) => (
                                <PokemonCard
                                    key={`${pokemon.name}-${index}`}
                                    pokemon={pokemon}
                                    index={index}
                                    feedback={feedback}
                                />
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-5">
                            <div className="mb-3">
                                <i className="bi bi-search" style={{ fontSize: '3rem', color: '#6c757d' }}></i>
                            </div>
                            <h4 className="text-muted">No Pokemon Found</h4>
                            {searchTerm && selectedType !== 'All' ? (
                                <>
                                    <p className="text-muted">No Pokemon match both search term <strong>"{searchTerm}"</strong> and type <strong>{selectedType}</strong></p>
                                    <p className="text-muted small">Try clearing your search or selecting a different type filter</p>
                                </>
                            ) : searchTerm ? (
                                <>
                                    <p className="text-muted">No Pokemon match the search term: <strong>"{searchTerm}"</strong></p>
                                    <p className="text-muted small">Try searching for Pokemon like "Pikachu", "Charizard", or "Bulbasaur"</p>
                                </>
                            ) : (
                                <>
                                    <p className="text-muted">No Pokemon match the selected type filter: <strong>{selectedType}</strong></p>
                                    <button
                                        className="btn btn-primary"
                                        onClick={() => handleTypeFilter('All')}
                                    >
                                        <i className="bi bi-arrow-clockwise me-2"></i>
                                        Show All Pokemon
                                    </button>
                                </>
                            )}
                        </div>
                    )}

                    {/* Pagination Controls */}
                    {filteredPokemon.length > 0 && (
                        <div className="d-flex justify-content-between align-items-center mt-4 mb-3">
                            {/* Page Size Selector */}
                            <div className="d-flex align-items-center">
                                <small className="text-muted me-2">Show:</small>
                                <select
                                    className="form-select form-select-sm"
                                    style={{ width: 'auto' }}
                                    value={cardsPerPage}
                                    onChange={(e) => {
                                        const newCardsPerPage = Number(e.target.value);
                                        setPaginationValue('CardsPerPage', newCardsPerPage);
                                        setPaginationValue('Page', 1); // Reset to first page
                                    }}
                                >
                                    {CARDS_PER_PAGE_OPTIONS.map(option => (
                                        <option key={option} value={option}>
                                            {option} per page
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Pagination Summary */}
                            <small className="text-muted">
                                Page {currentPage} of {totalPages} ({filteredPokemon.length} total results)
                            </small>
                        </div>
                    )}

                    {/* Pagination */}
                    {filteredPokemon.length > 0 && totalPages > 1 && (
                        <Pagination
                            currentPage={currentPage}
                            totalPages={totalPages}
                            onPageChange={handlePageChange}
                        />
                    )}
                </>
            )}
        </div>
    );
};

export default PokemonGrid;