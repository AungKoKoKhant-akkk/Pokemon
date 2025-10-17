import React, { useState, useEffect, useCallback, useMemo } from 'react';

// Utils
import {
    getPokemonTypeColor,
    getPokemonStatColor,
    getStatRating,
    formatStatName,
    getStatPercentage,
    getPokemonImageFallbacks,
    getBestPokemonImage
} from '../../utils';

// Constants
import { CACHE_EXPIRY } from '../../constants';

// HTTP Client
import axios from 'axios';

// Styles
import './PokemonEvolutionTree.css';

// Enhanced cache with expiration
const evolutionCache = new Map();

// Simplified evolution data structure for faster processing
const createSimplifiedPokemon = (name, id) => ({
    name,
    id,
    image: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`,
    fallbackImage: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`,
    evolutionDetails: []
});

// Ultra-fast evolution chain parser (no additional API calls)
const parseEvolutionChainFast = (chain) => {
    const parseNode = (node) => {
        const pokemon = createSimplifiedPokemon(node.species.name, node.species.url.split('/').slice(-2, -1)[0]);
        pokemon.evolutionDetails = node.evolution_details || [];

        if (node.evolves_to.length > 0) {
            pokemon.evolutions = node.evolves_to.map(parseNode);
        }

        return pokemon;
    };

    return parseNode(chain);
};

const PokemonEvolutionTree = ({ pokemonName }) => {
    const [evolutionChain, setEvolutionChain] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showPokemonModal, setShowPokemonModal] = useState(false);
    const [pokemonDetails, setPokemonDetails] = useState(null);
    const [modalLoading, setModalLoading] = useState(false);

    // Ultra-fast evolution chain fetching with aggressive caching
    const fetchEvolutionChain = useCallback(async (pokemon) => {
        try {
            setLoading(true);
            setError(null);
            const pokemonKey = pokemon.toLowerCase();

            // Check cache first (with expiration)
            const cached = evolutionCache.get(pokemonKey);
            if (cached && (Date.now() - cached.timestamp) < CACHE_EXPIRY) {
                setEvolutionChain(cached.data);
                setLoading(false);
                return;
            }

            // Use direct species API call (faster than pokemon -> species)
            let speciesUrl;
            try {
                // Try species endpoint first (faster)
                const speciesResponse = await axios.get(`https://pokeapi.co/api/v2/pokemon-species/${pokemonKey}`);
                const speciesData = speciesResponse.data;
                speciesUrl = speciesData.evolution_chain.url;
            } catch {
                try {
                    // Fallback to pokemon endpoint
                    const pokemonResponse = await axios.get(`https://pokeapi.co/api/v2/pokemon/${pokemonKey}`);
                    const pokemonData = pokemonResponse.data;
                    const speciesResponse2 = await axios.get(pokemonData.species.url);
                    const speciesData = speciesResponse2.data;
                    speciesUrl = speciesData.evolution_chain.url;
                } catch {
                    throw new Error('Pokemon not found');
                }
            }

            // Get evolution chain (this is usually fast)
            const evolutionResponse = await axios.get(speciesUrl);
            const evolutionData = evolutionResponse.data;

            // Fast parsing without additional API calls
            const chain = parseEvolutionChainFast(evolutionData.chain);

            // Cache with timestamp
            evolutionCache.set(pokemonKey, {
                data: chain,
                timestamp: Date.now()
            });

            setEvolutionChain(chain);
        } catch (err) {
            console.error('Error fetching evolution chain:', err);
            setError(err.message || 'Pokemon not found or evolution data unavailable');
        } finally {
            setLoading(false);
        }
    }, []);

    // Fetch detailed Pokemon information for modal
    const fetchPokemonDetails = useCallback(async (pokemonName) => {
        try {
            setModalLoading(true);
            const response = await axios.get(`https://pokeapi.co/api/v2/pokemon/${pokemonName.toLowerCase()}`);
            const pokemonData = response.data;

            // Get species data for description
            let description = 'No description available';
            try {
                const speciesResponse = await axios.get(pokemonData.species.url);
                const speciesData = speciesResponse.data;
                const englishEntry = speciesData.flavor_text_entries.find(
                    entry => entry.language.name === 'en'
                );
                if (englishEntry) {
                    description = englishEntry.flavor_text.replace(/\f/g, ' ').trim();
                }
            } catch (speciesError) {
                console.debug('Could not fetch species description:', speciesError);
            }

            const details = {
                name: pokemonData.name,
                id: pokemonData.id,
                height: pokemonData.height,
                weight: pokemonData.weight,
                types: pokemonData.types,
                stats: pokemonData.stats,
                abilities: pokemonData.abilities,
                sprites: pokemonData.sprites,
                description: description
            };

            setPokemonDetails(details);
            setShowPokemonModal(true);
        } catch (error) {
            console.error('Error fetching Pokemon details:', error);
            alert('Failed to load Pokemon details');
        } finally {
            setModalLoading(false);
        }
    }, []);

    // Handle Pokemon card click
    const handlePokemonClick = useCallback((pokemonName) => {
        // When embedded in detail page, show modal
        fetchPokemonDetails(pokemonName);
    }, [fetchPokemonDetails]);

    // Get evolution trigger text (cached for performance)
    const getEvolutionTrigger = useCallback((details) => {
        if (!details || details.length === 0) return 'Base Form';

        const detail = details[0];
        let trigger = '';

        if (detail.trigger?.name === 'level-up') {
            if (detail.min_level) {
                trigger = `Level ${detail.min_level}`;
            } else {
                trigger = 'Level Up';
            }

            if (detail.time_of_day) {
                trigger += ` (${detail.time_of_day})`;
            }

            if (detail.held_item) {
                trigger += ` with ${detail.held_item.name}`;
            }

            if (detail.known_move) {
                trigger += ` knowing ${detail.known_move.name}`;
            }

            if (detail.min_happiness) {
                trigger += ` (Happiness ≥${detail.min_happiness})`;
            }

            if (detail.location) {
                trigger += ` at ${detail.location.name}`;
            }
        } else if (detail.trigger?.name === 'use-item') {
            trigger = `Use ${detail.item?.name || 'Item'}`;
        } else if (detail.trigger?.name === 'trade') {
            trigger = 'Trade';
            if (detail.held_item) {
                trigger += ` holding ${detail.held_item.name}`;
            }
        } else if (detail.trigger?.name === 'shed') {
            trigger = 'Level 20 (extra Pokéball)';
        }

        return trigger || 'Special Condition';
    }, []);

    // Optimized image loading with multiple fallbacks
    const getOptimizedImageUrl = useCallback((pokemon) => {
        const { id, image } = pokemon;

        // Priority order for faster loading
        const imageOptions = [
            image, // Primary image from API
            `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`,
            `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/dream_world/${id}.svg`,
            `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`
        ];

        return imageOptions.filter(Boolean)[0];
    }, []);

    // Memoized evolution statistics for better performance
    const evolutionStats = useMemo(() => {
        if (!evolutionChain) return null;

        return {
            stages: getEvolutionStages(evolutionChain),
            totalForms: getTotalForms(evolutionChain),
            branchPoints: getBranchPoints(evolutionChain)
        };
    }, [evolutionChain]);

    // Render evolution tree with enhanced card design
    const renderEvolutionNode = useCallback((pokemon, level = 0) => {
        return (
            <div key={pokemon.name} className={`evolution-node level-${level}`}>
                <div
                    className="pokemon-card enhanced-card"
                    onClick={() => handlePokemonClick(pokemon.name)}
                    title={`Click to view ${pokemon.name} details`}
                >
                    <div className="card-background-pattern"></div>
                    <div className="pokemon-image-container">
                        <div className="image-glow"></div>
                        <img
                            src={getOptimizedImageUrl(pokemon)}
                            alt={pokemon.name}
                            className="pokemon-image"
                            loading="lazy"
                            onError={(e) => {
                                // Use centralized fallback system
                                const fallbacks = getPokemonImageFallbacks(pokemon);
                                const currentSrc = e.target.src;
                                const nextFallback = fallbacks.find(url => url !== currentSrc);

                                if (nextFallback) {
                                    e.target.src = nextFallback;
                                }
                            }}
                        />
                    </div>

                    <div className="pokemon-info">
                        <div className="pokemon-id-badge">#{pokemon.id.toString().padStart(3, '0')}</div>
                        <h5 className="pokemon-name">{pokemon.name}</h5>

                        <div className="evolution-requirement">
                            <i className="bi bi-arrow-up-circle-fill requirement-icon"></i>
                            <span className="requirement-text">
                                {getEvolutionTrigger(pokemon.evolutionDetails)}
                            </span>
                        </div>


                    </div>

                    <div className="card-hover-overlay">
                        <i className="bi bi-cursor-fill"></i>
                        <span>Click for details</span>
                    </div>
                </div>

                {pokemon.evolutions && pokemon.evolutions.length > 0 && (
                    <div className="evolution-children">
                        {pokemon.evolutions.map((evolution) => (
                            <div key={evolution.name} className="evolution-branch">
                                <div className="evolution-line"></div>
                                {renderEvolutionNode(evolution, level + 1)}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        );
    }, [handlePokemonClick, getOptimizedImageUrl]);

    // Initialize component
    useEffect(() => {
        if (pokemonName) {
            fetchEvolutionChain(pokemonName);
        }
    }, [pokemonName, fetchEvolutionChain]);

    if (loading) {
        return (
            <div className="evolution-tree-container">
                <div className="text-center py-5">
                    <div className="loading-animation mb-3">
                        <div className="spinner-border text-primary" style={{ width: '3rem', height: '3rem' }} role="status">
                            <span className="visually-hidden">Loading evolution tree...</span>
                        </div>
                        <div className="loading-dots mt-2">
                            <span className="dot"></span>
                            <span className="dot"></span>
                            <span className="dot"></span>
                        </div>
                    </div>
                    <h4 className="mt-3">Loading Evolution Tree...</h4>
                    <div className="progress mt-3" style={{ width: '300px', margin: '0 auto' }}>
                        <div
                            className="progress-bar progress-bar-striped progress-bar-animated"
                            role="progressbar"
                            style={{ width: '100%' }}
                        ></div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="evolution-tree-container">
            {error && (
                <div className="alert alert-warning text-center">
                    <i className="bi bi-exclamation-triangle me-2"></i>
                    {error}
                </div>
            )}

            {evolutionChain && (
                <div className="evolution-tree">
                    <div className="evolution-tree-title">
                        <h4>
                            <i className="bi bi-arrow-up-right me-2"></i>
                            Evolution Chain for {evolutionChain.name}
                        </h4>
                    </div>

                    <div className="tree-visualization">
                        {renderEvolutionNode(evolutionChain)}
                    </div>

                    {/* Evolution Stats */}
                    {evolutionStats && (
                        <div className="evolution-stats mt-4">
                            <div className="row text-center">
                                <div className="col-md-4">
                                    <div className="stat-card">
                                        <i className="bi bi-layers text-primary"></i>
                                        <h6>Evolution Stages</h6>
                                        <span className="stat-value">
                                            {evolutionStats.stages}
                                        </span>
                                    </div>
                                </div>
                                <div className="col-md-4">
                                    <div className="stat-card">
                                        <i className="bi bi-collection text-success"></i>
                                        <h6>Total Forms</h6>
                                        <span className="stat-value">
                                            {evolutionStats.totalForms}
                                        </span>
                                    </div>
                                </div>
                                <div className="col-md-4">
                                    <div className="stat-card">
                                        <i className="bi bi-shuffle text-info"></i>
                                        <h6>Branch Points</h6>
                                        <span className="stat-value">
                                            {evolutionStats.branchPoints}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            )}

            {/* Enhanced Pokemon Details Modal */}
            {showPokemonModal && (
                <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.7)' }}>
                    <div className="modal-dialog modal-xl modal-dialog-centered">
                        <div className="modal-content enhanced-modal">
                            <div className="modal-header gradient-header">
                                <div className="d-flex align-items-center">
                                    <div className="modal-pokemon-avatar me-3">
                                        {!modalLoading && pokemonDetails && (
                                            <img
                                                src={getBestPokemonImage(pokemonDetails)}
                                                alt={pokemonDetails.name}
                                                className="avatar-image"
                                            />
                                        )}
                                    </div>
                                    <div>
                                        <h4 className="modal-title mb-1">
                                            {modalLoading ? 'Loading Pokemon...' :
                                                `${pokemonDetails?.name?.charAt(0).toUpperCase() + pokemonDetails?.name?.slice(1)}`
                                            }
                                        </h4>
                                        {!modalLoading && pokemonDetails && (
                                            <div className="modal-subtitle">
                                                <span className="pokemon-id-large">#{pokemonDetails.id.toString().padStart(3, '0')}</span>
                                                <div className="type-badges-modal ms-2">
                                                    {pokemonDetails.types.map(type => (
                                                        <span
                                                            key={type.type.name}
                                                            className="badge type-badge me-1"
                                                            style={{
                                                                backgroundColor: getPokemonTypeColor(type.type.name),
                                                                color: 'white'
                                                            }}
                                                        >
                                                            {type.type.name.toUpperCase()}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                                <button
                                    type="button"
                                    className="btn-close btn-close-white"
                                    onClick={() => setShowPokemonModal(false)}
                                ></button>
                            </div>
                            <div className="modal-body enhanced-modal-body">
                                {modalLoading ? (
                                    <div className="text-center py-5">
                                        <div className="spinner-border text-primary mb-3" style={{ width: '3rem', height: '3rem' }} role="status">
                                            <span className="visually-hidden">Loading...</span>
                                        </div>
                                        <h5>Loading Pokemon Details...</h5>
                                    </div>
                                ) : pokemonDetails ? (
                                    <div className="row">
                                        {/* Left Column - Image and Basic Info */}
                                        <div className="col-lg-4">
                                            <div className="pokemon-showcase">
                                                <div className="showcase-background"></div>
                                                <img
                                                    src={getBestPokemonImage(pokemonDetails)}
                                                    alt={pokemonDetails.name}
                                                    className="showcase-image"
                                                />
                                            </div>

                                            <div className="basic-info-card mt-4">
                                                <h6 className="info-title">
                                                    <i className="bi bi-info-circle me-2"></i>
                                                    Basic Information
                                                </h6>
                                                <div className="info-grid">
                                                    <div className="info-item">
                                                        <span className="info-label">Height</span>
                                                        <span className="info-value">{(pokemonDetails.height / 10).toFixed(1)} m</span>
                                                    </div>
                                                    <div className="info-item">
                                                        <span className="info-label">Weight</span>
                                                        <span className="info-value">{(pokemonDetails.weight / 10).toFixed(1)} kg</span>
                                                    </div>
                                                    <div className="info-item">
                                                        <span className="info-label">BMI</span>
                                                        <span className="info-value">
                                                            {((pokemonDetails.weight / 10) / Math.pow(pokemonDetails.height / 10, 2)).toFixed(1)}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Right Column - Detailed Stats and Abilities */}
                                        <div className="col-lg-8">
                                            <div className="pokemon-description-card mb-4">
                                                <h6 className="info-title">
                                                    <i className="bi bi-book me-2"></i>
                                                    Description
                                                </h6>
                                                <p className="description-text">{pokemonDetails.description}</p>
                                            </div>

                                            <div className="row">
                                                <div className="col-md-6">
                                                    <div className="abilities-card">
                                                        <h6 className="info-title">
                                                            <i className="bi bi-star me-2"></i>
                                                            Abilities
                                                        </h6>
                                                        <div className="abilities-list">
                                                            {pokemonDetails.abilities.map((ability) => (
                                                                <div key={ability.ability.name} className="ability-item">
                                                                    <span className={`ability-badge ${ability.is_hidden ? 'hidden-ability' : 'normal-ability'}`}>
                                                                        {ability.ability.name.replace('-', ' ').toUpperCase()}
                                                                        {ability.is_hidden && <small className="ms-1">(Hidden)</small>}
                                                                    </span>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="col-md-6">
                                                    <div className="sprites-preview">
                                                        <h6 className="info-title">
                                                            <i className="bi bi-images me-2"></i>
                                                            Sprites
                                                        </h6>
                                                        <div className="sprites-grid">
                                                            {pokemonDetails.sprites.front_default && (
                                                                <img src={pokemonDetails.sprites.front_default} alt="Front" className="sprite-img" title="Front" />
                                                            )}
                                                            {pokemonDetails.sprites.back_default && (
                                                                <img src={pokemonDetails.sprites.back_default} alt="Back" className="sprite-img" title="Back" />
                                                            )}
                                                            {pokemonDetails.sprites.front_shiny && (
                                                                <img src={pokemonDetails.sprites.front_shiny} alt="Shiny Front" className="sprite-img shiny" title="Shiny Front" />
                                                            )}
                                                            {pokemonDetails.sprites.back_shiny && (
                                                                <img src={pokemonDetails.sprites.back_shiny} alt="Shiny Back" className="sprite-img shiny" title="Shiny Back" />
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="stats-section mt-4">
                                                <h6 className="info-title">
                                                    <i className="bi bi-bar-chart me-2"></i>
                                                    Base Stats
                                                    <span className="total-stats ms-2">
                                                        Total: {pokemonDetails.stats.reduce((sum, stat) => sum + stat.base_stat, 0)}
                                                    </span>
                                                </h6>
                                                <div className="stats-container">
                                                    {pokemonDetails.stats.map(stat => {
                                                        const statName = formatStatName(stat.stat.name);
                                                        const percentage = getStatPercentage(stat.base_stat);
                                                        const statColor = getPokemonStatColor(stat.stat.name);

                                                        return (
                                                            <div key={stat.stat.name} className="stat-row">
                                                                <div className="stat-info">
                                                                    <span className="stat-name">{statName}</span>
                                                                    <span className="stat-value">{stat.base_stat}</span>
                                                                </div>
                                                                <div className="stat-bar-container">
                                                                    <div
                                                                        className="stat-bar"
                                                                        style={{
                                                                            width: `${percentage}%`,
                                                                            backgroundColor: statColor
                                                                        }}
                                                                    ></div>
                                                                </div>
                                                                <div className="stat-rating">
                                                                    {getStatRating(stat.base_stat)}
                                                                </div>
                                                            </div>
                                                        );
                                                    })}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="alert alert-danger">
                                        <i className="bi bi-exclamation-triangle me-2"></i>
                                        Failed to load Pokemon details
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

// Using centralized utilities from utils folder





// Helper functions for evolution stats
const getEvolutionStages = (chain) => {
    const getMaxDepth = (node, depth = 1) => {
        if (!node.evolutions || node.evolutions.length === 0) return depth;
        return Math.max(...node.evolutions.map(evolution => getMaxDepth(evolution, depth + 1)));
    };
    return getMaxDepth(chain);
};

const getTotalForms = (chain) => {
    const countNodes = (node) => {
        let count = 1;
        if (node.evolutions) {
            count += node.evolutions.reduce((sum, evolution) => sum + countNodes(evolution), 0);
        }
        return count;
    };
    return countNodes(chain);
};

const getBranchPoints = (chain) => {
    const countBranches = (node) => {
        let branches = 0;
        if (node.evolutions && node.evolutions.length > 1) {
            branches = 1;
        }
        if (node.evolutions) {
            branches += node.evolutions.reduce((sum, evolution) => sum + countBranches(evolution), 0);
        }
        return branches;
    };
    return countBranches(chain);
};

export default PokemonEvolutionTree;