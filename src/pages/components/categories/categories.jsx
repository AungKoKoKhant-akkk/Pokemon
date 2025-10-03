import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSearch } from '../../../context/SearchContext';
import { getPokemonTypes, listCategories } from "../../../services/categories.js";
import Pagination from "../../pagination/pagination.jsx";


const CARDS_PER_PAGE = 6;
const Categories = () => {
    const navigate = useNavigate();
    const { searchTerm } = useSearch();
    const [pokemon, setPokemon] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [filteredPokemon, setFilteredPokemon] = useState([]);
    const [types, setTypes] = useState([]);
    const [selectedType, setSelectedType] = useState('All');

    const fetchPokemon = async () => {
        try {
            const detailedPokemon = await listCategories();
            const allTypes = await getPokemonTypes();
            
            // Enhance Pokemon data with individual types for filtering
            const enhancedPokemon = detailedPokemon.map(p => {
                if (!p) return null;
                const typeString = p.type.replace('Type : ', '');
                const pokemonTypes = typeString.split(', ').map(t => t.trim());
                return {
                    ...p,
                    pokemonTypes: pokemonTypes
                };
            }).filter(Boolean);
            
            setPokemon(enhancedPokemon);
            setFilteredPokemon(enhancedPokemon);
            setTypes(['All', ...allTypes.map(type => type.name)]);
            setLoading(false);
            console.log('Enhanced Pokemon:', enhancedPokemon);
            console.log('Types:', allTypes);
        } catch (error) {
            console.error('Error fetching Pokémon data:', error);
            setLoading(false);
        }
    }

    // Combined filtering function for both search and type filtering
    const applyFilters = () => {
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
        setCurrentPage(1); // Reset to first page when filters change
    };

    const handleTypeFilter = (type) => {
        setSelectedType(type);
    };

    // Apply filters whenever search term, selected type, or pokemon data changes
    useEffect(() => {
        if (pokemon.length > 0) {
            applyFilters();
        }
    }, [searchTerm, selectedType, pokemon]);

    useEffect(() => {
        fetchPokemon();
    }, []);

    const totalPages = Math.ceil(filteredPokemon.length / CARDS_PER_PAGE);
    const startIdx = (currentPage - 1) * CARDS_PER_PAGE;
    const currentCards = filteredPokemon.slice(startIdx, startIdx + CARDS_PER_PAGE);

    return (
        <div className="container">
            {loading ? (
                <div className="d-flex justify-content-center align-items-center" style={{minHeight: '300px'}}>
                    <div className="text-center">
                        <div className="spinner-border text-primary" style={{width: '3rem', height: '3rem'}} role="status">
                            <span className="visually-hidden">Loading...</span>
                        </div>
                        <h4 className="mt-3">Loading Pokemon...</h4>
                    </div>
                </div>
            ) : (
                <>
                    {/* Type Filter Section */}
                    <div className="row mb-4">
                        <div className="col-12">
                            <div className="card shadow-sm">
                                <div className="card-header bg-primary text-white">
                                    <h5 className="mb-0">
                                        <i className="bi bi-funnel me-2"></i>
                                        Filter by Type
                                    </h5>
                                </div>
                                <div className="card-body">
                                    <div className="d-flex flex-wrap gap-2">
                                        {types.map((type) => {
                                            const typeColors = {
                                                'All': '#6c757d',
                                                'fire': '#FF6B6B',
                                                'water': '#4ECDC4',
                                                'grass': '#45B7D1',
                                                'electric': '#FFA07A',
                                                'psychic': '#DDA0DD',
                                                'ice': '#87CEEB',
                                                'dragon': '#9370DB',
                                                'dark': '#696969',
                                                'fighting': '#CD5C5C',
                                                'poison': '#9932CC',
                                                'ground': '#DAA520',
                                                'flying': '#87CEFA',
                                                'bug': '#32CD32',
                                                'rock': '#A0522D',
                                                'ghost': '#4B0082',
                                                'steel': '#778899',
                                                'fairy': '#FFB6C1',
                                                'normal': '#D2B48C'
                                            };
                                            
                                            const isSelected = selectedType === type;
                                            const typeColor = typeColors[type] || '#A8A8A8';
                                            
                                            return (
                                                <button
                                                    key={type}
                                                    className={`btn btn-sm ${isSelected ? 'btn-primary' : 'btn-outline-secondary'}`}
                                                    style={{
                                                        backgroundColor: isSelected ? typeColor : 'transparent',
                                                        borderColor: typeColor,
                                                        color: isSelected ? 'white' : typeColor,
                                                        fontWeight: isSelected ? 'bold' : 'normal',
                                                        textTransform: 'capitalize'
                                                    }}
                                                    onClick={() => handleTypeFilter(type)}
                                                >
                                                    {type}
                                                    {type !== 'All' && (
                                                        <span className="ms-1 badge bg-light text-dark rounded-pill">
                                                            {pokemon.filter(p => 
                                                                p.pokemonTypes && p.pokemonTypes.some(pokemonType => 
                                                                    pokemonType.toLowerCase() === type.toLowerCase()
                                                                )
                                                            ).length}
                                                        </span>
                                                    )}
                                                    {type === 'All' && (
                                                        <span className="ms-1 badge bg-light text-dark rounded-pill">
                                                            {pokemon.length}
                                                        </span>
                                                    )}
                                                </button>
                                            );
                                        })}
                                    </div>
                                    
                                    {/* Filter Results Info */}
                                    <div className="mt-3 text-muted">
                                        <small>
                                            <i className="bi bi-info-circle me-1"></i>
                                            Showing {filteredPokemon.length} of {pokemon.length} Pokemon
                                            {searchTerm && (
                                                <span className="ms-2">
                                                    <span className="badge bg-info">Search: "{searchTerm}"</span>
                                                </span>
                                            )}
                                            {selectedType !== 'All' && (
                                                <span className="ms-2">
                                                    <span className="badge bg-secondary">Type: {selectedType}</span>
                                                </span>
                                            )}
                                            {(searchTerm || selectedType !== 'All') && (
                                                <button 
                                                    className="btn btn-link btn-sm text-decoration-none ms-2 p-0"
                                                    onClick={() => {
                                                        setSelectedType('All');
                                                        // Clear search through context would be better, but this works for now
                                                    }}
                                                >
                                                    <i className="bi bi-x-circle"></i> Clear all filters
                                                </button>
                                            )}
                                        </small>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Pokemon Grid */}
                    {currentCards.length > 0 ? (
                        <div className="row mt-2 m-5">
                            {currentCards.map((p, index) => (
                                <div className="col-md-4 mb-3" key={index}>
                                    <div className="card" style={{ maxWidth: 320 }}>
                                        <img
                                            src={p.image} style={{ maxHeight: 200 }}
                                            className="card-img-top" alt="Pokemon Image"
                                        />
                                        <div className="card-body">
                                            <h5 className="card-title text-capitalize">{p.name}</h5>
                                            <p className="card-text">{p.description}</p>
                                            <p className="card-text">{p.type}</p>
                                            <p className="card-text"><small className="text-muted">Generations: {p.generations}</small></p>
                                            <div className="d-flex justify-content-between align-items-center">
                                                <div>
                                                    <i className="bi bi-star-fill text-warning"></i>
                                                    <i className="bi bi-star-fill text-warning"></i>
                                                    <i className="bi bi-star-fill text-warning"></i>
                                                    <i className="bi bi-star-fill text-warning"></i>
                                                    <i className="bi bi-star-half text-warning"></i>
                                                    <small className="text-muted">(4.5)</small>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="card-footer d-flex justify-content-between bg-light">
                                            <button
                                                className="btn btn-primary btn-sm"
                                                onClick={() => navigate(`/pokemon/${p.name.toLowerCase()}`)}
                                            >
                                                View Details
                                            </button>
                                            <button className="btn btn-outline-secondary btn-sm"><i className="bi bi-heart"></i></button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-5">
                            <div className="mb-3">
                                <i className="bi bi-search" style={{fontSize: '3rem', color: '#6c757d'}}></i>
                            </div>
                            <h4 className="text-muted">No Pokemon Found</h4>
                            {searchTerm && selectedType !== 'All' ? (
                                <>
                                    <p className="text-muted">No Pokemon match both search term <strong>"{searchTerm}"</strong> and type <strong>{selectedType}</strong></p>
                                    <div className="d-flex justify-content-center gap-2">
                                        <button 
                                            className="btn btn-outline-primary"
                                            onClick={() => setSelectedType('All')}
                                        >
                                            <i className="bi bi-funnel me-2"></i>
                                            Clear Type Filter
                                        </button>
                                        <button 
                                            className="btn btn-primary"
                                            onClick={() => {
                                                setSelectedType('All');
                                                // Would need to clear search through context
                                            }}
                                        >
                                            <i className="bi bi-arrow-clockwise me-2"></i>
                                            Clear All Filters
                                        </button>
                                    </div>
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
                                        onClick={() => setSelectedType('All')}
                                    >
                                        <i className="bi bi-arrow-clockwise me-2"></i>
                                        Show All Pokemon
                                    </button>
                                </>
                            )}
                        </div>
                    )}
                    
                    {/* Pagination */}
                    {filteredPokemon.length > 0 && (
                        <Pagination
                            currentPage={currentPage}
                            totalPages={totalPages}
                            onPageChange={(page) => setCurrentPage(page)}
                        />
                    )}
                </>
            )}
        </div>
    );
};

export default Categories;