import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';
import axios from 'axios';
import './PokemonEvolutionTree.css';

// Enhanced cache with expiration and preloading
const evolutionCache = new Map();
const pokemonDataCache = new Map();
const speciesCache = new Map();
const CACHE_EXPIRY = 10 * 60 * 1000; // 10 minutes

// Pre-populate cache with common Pokemon evolution chains
const POPULAR_POKEMON = [
    'pikachu', 'charmander', 'squirtle', 'bulbasaur', 'eevee',
    'caterpie', 'weedle', 'pidgey', 'rattata', 'spearow'
];

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
        const pokemonId = node.species.url.split('/').slice(-2, -1)[0];
        const pokemon = createSimplifiedPokemon(node.species.name, pokemonId);
        pokemon.evolutionDetails = node.evolution_details || [];

        if (node.evolves_to && node.evolves_to.length > 0) {
            pokemon.evolutions = node.evolves_to.map(parseNode);
        }

        return pokemon;
    };

    return parseNode(chain);
};

// Preload popular Pokemon data in background (with error handling)
const preloadPopularPokemon = async () => {
    if (evolutionCache.size > 0) return; // Already preloaded

    try {
        console.log('🚀 Starting preload of popular Pokemon...');
        const preloadPromises = POPULAR_POKEMON.map(async (pokemonName) => {
            try {
                const response = await fetch(`https://pokeapi.co/api/v2/pokemon-species/${pokemonName}`);
                if (response.ok) {
                    const species = await response.json();
                    if (species.evolution_chain?.url) {
                        const evolutionResponse = await fetch(species.evolution_chain.url);
                        if (evolutionResponse.ok) {
                            const evolutionData = await evolutionResponse.json();
                            const chain = parseEvolutionChainFast(evolutionData.chain);
                            evolutionCache.set(pokemonName, {
                                data: chain,
                                timestamp: Date.now()
                            });
                        }
                    }
                }
            } catch (error) {
                // Silently handle preload errors - they shouldn't break the app
                console.debug(`Preload failed for ${pokemonName}:`, error.message);
            }
        });

        await Promise.allSettled(preloadPromises);
        console.log('✅ Preloaded popular Pokemon evolution chains');
    } catch (error) {
        // Silently handle preload errors
        console.debug('Preload error:', error.message);
    }
};

// Start preloading after the DOM is ready (safer)
if (typeof window !== 'undefined') {
    setTimeout(preloadPopularPokemon, 1000);
}

const PokemonEvolutionTree = ({ pokemonName, isStandalone = false }) => {
    const navigate = useNavigate();
    const { isDark } = useTheme();
    const [evolutionChain, setEvolutionChain] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchPokemon, setSearchPokemon] = useState(pokemonName || '');
    const [loadingStage, setLoadingStage] = useState('');
    const [showInstantPreview, setShowInstantPreview] = useState(false);

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

            setLoadingStage('🔍 Finding Pokemon...');

            // Use direct species API call (faster than pokemon -> species)
            let speciesUrl;
            try {
                // Try species endpoint first (faster)
                const speciesResponse = await fetch(`https://pokeapi.co/api/v2/pokemon-species/${pokemonKey}`);
                if (speciesResponse.ok) {
                    const speciesData = await speciesResponse.json();
                    speciesUrl = speciesData.evolution_chain.url;
                } else {
                    // Fallback to pokemon endpoint
                    setLoadingStage('🔄 Getting species data...');
                    const pokemonResponse = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonKey}`);
                    if (!pokemonResponse.ok) throw new Error('Pokemon not found');

                    const pokemonData = await pokemonResponse.json();
                    const speciesResponse2 = await fetch(pokemonData.species.url);
                    if (!speciesResponse2.ok) throw new Error('Species data not found');

                    const speciesData = await speciesResponse2.json();
                    speciesUrl = speciesData.evolution_chain.url;
                }
            } catch (err) {
                throw new Error('Pokemon not found');
            }

            setLoadingStage('⚡ Building evolution tree...');

            // Get evolution chain (this is usually fast)
            const evolutionResponse = await fetch(speciesUrl);
            if (!evolutionResponse.ok) throw new Error('Evolution data not found');

            const evolutionData = await evolutionResponse.json();

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
            setLoadingStage('');
        }
    }, []);

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

    // Render evolution tree with optimized image loading
    const renderEvolutionNode = useCallback((pokemon, level = 0, isLast = false) => {
        return (
            <div key={pokemon.name} className={`evolution-node level-${level}`}>
                <div className="pokemon-card" onClick={() => navigate(`/pokemon/${pokemon.name}`)}>
                    <div className="pokemon-image-container">
                        <img
                            src={getOptimizedImageUrl(pokemon)}
                            alt={pokemon.name}
                            className="pokemon-image"
                            loading="lazy"
                            onError={(e) => {
                                // Fast fallback chain
                                const fallbacks = [
                                    `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemon.id}.png`,
                                    `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/home/${pokemon.id}.png`,
                                    'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgZmlsbD0iI2Y4ZjlmYSIvPjx0ZXh0IHg9IjUwIiB5PSI1MCIgZm9udC1zaXplPSIxMiIgZmlsbD0iIzZjNzU3ZCIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPk5vIEltYWdlPC90ZXh0Pjwvc3ZnPg=='
                                ];

                                const currentSrc = e.target.src;
                                const nextFallback = fallbacks.find(url => url !== currentSrc);

                                if (nextFallback) {
                                    e.target.src = nextFallback;
                                }
                            }}
                        />
                    </div>
                    <h5 className="pokemon-name">{pokemon.name}</h5>
                    <small className="evolution-trigger">
                        {getEvolutionTrigger(pokemon.evolutionDetails)}
                    </small>
                </div>

                {pokemon.evolutions && pokemon.evolutions.length > 0 && (
                    <div className="evolution-children">
                        {pokemon.evolutions.map((evolution, index) => (
                            <div key={evolution.name} className="evolution-branch">
                                <div className="evolution-line"></div>
                                {renderEvolutionNode(evolution, level + 1, index === pokemon.evolutions.length - 1)}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        );
    }, [navigate, getOptimizedImageUrl]);

    // Debounced search with instant preview
    const [searchTimeout, setSearchTimeout] = useState(null);

    const debouncedSearch = useCallback((searchTerm) => {
        if (searchTimeout) {
            clearTimeout(searchTimeout);
        }

        // Show instant preview for popular Pokemon
        const lowerTerm = searchTerm.toLowerCase();
        if (POPULAR_POKEMON.includes(lowerTerm)) {
            const cached = evolutionCache.get(lowerTerm);
            if (cached) {
                setEvolutionChain(cached.data);
                setShowInstantPreview(true);
                setLoading(false);
            }
        }

        const timeout = setTimeout(() => {
            if (searchTerm.trim()) {
                setShowInstantPreview(false);
                fetchEvolutionChain(searchTerm.trim());
            }
        }, 300); // Reduced delay for faster response

        setSearchTimeout(timeout);
    }, [fetchEvolutionChain, searchTimeout]);

    // Handle search submission (immediate, no debounce)
    const handleSearch = (e) => {
        e.preventDefault();
        if (searchPokemon.trim()) {
            if (searchTimeout) {
                clearTimeout(searchTimeout);
            }
            setShowInstantPreview(false);
            fetchEvolutionChain(searchPokemon.trim());
        }
    };

    // Handle input change with instant preview
    const handleSearchInputChange = (e) => {
        const value = e.target.value;
        setSearchPokemon(value);

        // Show instant results for popular Pokemon (no delay)
        const lowerValue = value.toLowerCase();
        if (POPULAR_POKEMON.includes(lowerValue)) {
            const cached = evolutionCache.get(lowerValue);
            if (cached) {
                setEvolutionChain(cached.data);
                setShowInstantPreview(true);
                setLoading(false);
                setError(null);
                return;
            }
        }

        // Auto-search for other Pokemon (with shorter delay)
        if (value.length >= 3) {
            setLoading(true);
            debouncedSearch(value);
        }
    };

    // Initialize component
    useEffect(() => {
        if (pokemonName) {
            fetchEvolutionChain(pokemonName);
        }
    }, [pokemonName, fetchEvolutionChain]);

    // Cleanup timeout on unmount
    useEffect(() => {
        return () => {
            if (searchTimeout) {
                clearTimeout(searchTimeout);
            }
        };
    }, [searchTimeout]);

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
                    {loadingStage && (
                        <p className="text-muted mt-2">{loadingStage}</p>
                    )}
                    <div className="progress mt-3" style={{ width: '300px', margin: '0 auto' }}>
                        <div
                            className="progress-bar progress-bar-striped progress-bar-animated"
                            role="progressbar"
                            style={{ width: loadingStage.includes('Fetching') ? '33%' : loadingStage.includes('Loading') ? '66%' : '100%' }}
                        ></div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="evolution-tree-container">
            {isStandalone && (
                <div className="evolution-header">
                    <div className="container">
                        <div className="row">
                            <div className="col-md-8 mx-auto">
                                <h2 className="text-center mb-4">
                                    <i className="bi bi-diagram-3 me-2"></i>
                                    Pokemon Evolution Tree
                                </h2>

                                {/* Search Form */}
                                <form onSubmit={handleSearch} className="search-form mb-4">
                                    <div className="input-group">
                                        <input
                                            type="text"
                                            className="form-control"
                                            placeholder="Enter Pokemon name (e.g., Charmander, Pikachu)"
                                            value={searchPokemon}
                                            onChange={handleSearchInputChange}
                                            disabled={loading}
                                        />
                                        <button className="btn btn-primary" type="submit" disabled={loading || !searchPokemon.trim()}>
                                            <i className="bi bi-search me-2"></i>
                                            {loading ? 'Loading...' : 'View Evolution Tree'}
                                        </button>
                                    </div>
                                    {searchPokemon.length >= 3 && searchPokemon.length < 30 && (
                                        <small className="text-muted mt-2 d-block">
                                            <i className="bi bi-info-circle me-1"></i>
                                            Auto-searching as you type...
                                        </small>
                                    )}
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {error && (
                <div className="alert alert-warning text-center">
                    <i className="bi bi-exclamation-triangle me-2"></i>
                    {error}
                </div>
            )}

            {evolutionChain && (
                <div className="evolution-tree">
                    {showInstantPreview && (
                        <div className="alert alert-info alert-dismissible fade show mb-3" role="alert">
                            <i className="bi bi-lightning-fill me-2"></i>
                            <strong>Instant Preview!</strong> This evolution tree was loaded from cache for super-fast viewing.
                            <button type="button" className="btn-close" onClick={() => setShowInstantPreview(false)}></button>
                        </div>
                    )}

                    <div className="evolution-tree-title">
                        <h4>
                            <i className="bi bi-arrow-up-right me-2"></i>
                            Evolution Chain for {evolutionChain.name}
                            {showInstantPreview && <span className="badge bg-success ms-2">⚡ Instant</span>}
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

            {!evolutionChain && !loading && !error && isStandalone && (
                <div className="text-center py-5">
                    <i className="bi bi-diagram-3" style={{ fontSize: '4rem', color: '#6c757d' }}></i>
                    <h4 className="text-muted mt-3">Search for a Pokemon to view its evolution tree</h4>
                    <p className="text-muted">Enter any Pokemon name above to explore its evolutionary journey</p>

                    <div className="row mt-4">
                        <div className="col-md-8 offset-md-2">
                            <div className="card bg-light">
                                <div className="card-body">
                                    <h6 className="card-title">⚡ Instant Loading Available!</h6>
                                    <p className="card-text small mb-2">Try these popular Pokemon for super-fast results:</p>
                                    <div className="d-flex flex-wrap justify-content-center gap-2">
                                        {POPULAR_POKEMON.slice(0, 5).map(pokemon => (
                                            <button
                                                key={pokemon}
                                                className="btn btn-outline-primary btn-sm"
                                                onClick={() => {
                                                    setSearchPokemon(pokemon);
                                                    handleSearchInputChange({ target: { value: pokemon } });
                                                }}
                                            >
                                                {pokemon}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

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