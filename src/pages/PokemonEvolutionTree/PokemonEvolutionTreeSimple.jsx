import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';
import './PokemonEvolutionTree.css';

const PokemonEvolutionTreeSimple = ({ pokemonName, isStandalone = false }) => {
    const navigate = useNavigate();
    const { isDark } = useTheme();
    const [evolutionChain, setEvolutionChain] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [searchPokemon, setSearchPokemon] = useState(pokemonName || '');

    // Simple evolution chain fetching
    const fetchEvolutionChain = async (pokemon) => {
        try {
            setLoading(true);
            setError(null);

            console.log('Fetching evolution for:', pokemon);

            // Get species data
            const speciesResponse = await fetch(`https://pokeapi.co/api/v2/pokemon-species/${pokemon.toLowerCase()}`);
            if (!speciesResponse.ok) {
                throw new Error('Pokemon not found');
            }

            const speciesData = await speciesResponse.json();
            console.log('Species data:', speciesData);

            // Get evolution chain
            const evolutionResponse = await fetch(speciesData.evolution_chain.url);
            if (!evolutionResponse.ok) {
                throw new Error('Evolution data not found');
            }

            const evolutionData = await evolutionResponse.json();
            console.log('Evolution data:', evolutionData);

            // Simple parsing
            const parseEvolution = (chain) => {
                const pokemonId = chain.species.url.split('/').slice(-2, -1)[0];
                return {
                    name: chain.species.name,
                    id: pokemonId,
                    image: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${pokemonId}.png`,
                    evolutions: chain.evolves_to ? chain.evolves_to.map(parseEvolution) : []
                };
            };

            const chain = parseEvolution(evolutionData.chain);
            console.log('Parsed chain:', chain);

            setEvolutionChain(chain);
        } catch (err) {
            console.error('Error fetching evolution chain:', err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    // Handle search
    const handleSearch = () => {
        if (searchPokemon.trim()) {
            fetchEvolutionChain(searchPokemon.trim());
        }
    };

    // Initial fetch if pokemonName provided
    useEffect(() => {
        if (pokemonName) {
            fetchEvolutionChain(pokemonName);
        }
    }, [pokemonName]);

    // Render evolution node
    const renderEvolutionNode = (pokemon) => {
        return (
            <div key={pokemon.id} className="evolution-node">
                <div className="pokemon-card">
                    <img
                        src={pokemon.image}
                        alt={pokemon.name}
                        onError={(e) => {
                            e.target.src = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemon.id}.png`;
                        }}
                    />
                    <h5>{pokemon.name}</h5>
                    <small>#{pokemon.id}</small>
                </div>

                {pokemon.evolutions && pokemon.evolutions.length > 0 && (
                    <div className="evolution-arrow">→</div>
                )}

                {pokemon.evolutions && pokemon.evolutions.length > 0 && (
                    <div className="evolutions">
                        {pokemon.evolutions.map(renderEvolutionNode)}
                    </div>
                )}
            </div>
        );
    };

    return (
        <div className={`pokemon-evolution-tree ${isDark ? 'dark-theme' : 'light-theme'}`}>
            <div className="container py-4">
                {!isStandalone && (
                    <div className="d-flex align-items-center mb-4">
                        <button
                            className="btn btn-outline-primary me-3"
                            onClick={() => navigate('/')}
                        >
                            <i className="bi bi-arrow-left me-2"></i>
                            Back to Pokemon List
                        </button>
                        <h2 className="mb-0">Pokemon Evolution Tree</h2>
                    </div>
                )}

                <div className="search-section mb-4">
                    <div className="row">
                        <div className="col-md-8">
                            <div className="input-group">
                                <input
                                    type="text"
                                    className="form-control"
                                    placeholder="Enter Pokemon name (e.g., pikachu, charmander)"
                                    value={searchPokemon}
                                    onChange={(e) => setSearchPokemon(e.target.value)}
                                    onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                                />
                                <button
                                    className="btn btn-primary"
                                    onClick={handleSearch}
                                    disabled={loading}
                                >
                                    {loading ? 'Loading...' : 'Search'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Results */}
                {loading && (
                    <div className="text-center py-5">
                        <div className="spinner-border text-primary" role="status">
                            <span className="visually-hidden">Loading...</span>
                        </div>
                        <p className="mt-3">Loading evolution tree...</p>
                    </div>
                )}

                {error && (
                    <div className="alert alert-danger" role="alert">
                        <i className="bi bi-exclamation-triangle me-2"></i>
                        {error}
                    </div>
                )}

                {evolutionChain && !loading && (
                    <div className="evolution-display">
                        <h4 className="mb-4">Evolution Chain</h4>
                        <div className="evolution-tree">
                            {renderEvolutionNode(evolutionChain)}
                        </div>
                    </div>
                )}

                {!evolutionChain && !loading && !error && (
                    <div className="text-center py-5 text-muted">
                        <i className="bi bi-search" style={{ fontSize: '3rem' }}></i>
                        <p className="mt-3">Search for a Pokemon to see its evolution tree</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default PokemonEvolutionTreeSimple;