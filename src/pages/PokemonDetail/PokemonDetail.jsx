import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useFavorites } from '../../context/FavoritesContext';
import { useComparison } from '../../context/ComparisonContext';
import { usePokemonData } from '../../context/PokemonDataContext';
import { useTheme } from '../../context/ThemeContext';
import { getPokemonTypeColor, formatPokemonId, getBestPokemonImage } from '../../utils';
import PokemonEvolutionTree from '../PokemonEvolutionTree/PokemonEvolutionTree';
import './PokemonDetail.css';

const PokemonDetail = () => {
    const { name } = useParams();
    const navigate = useNavigate();
    const { toggleFavorite, isFavorite } = useFavorites();
    const { addToComparison, removeFromComparison, isInComparison, canAddMore } = useComparison();
    const { getPokemonDetails, getPokemonSpecies, getEvolutionChain } = usePokemonData();
    const { isDark } = useTheme();
    const [pokemon, setPokemon] = useState(null);
    const [species, setSpecies] = useState(null);
    const [evolutionChain, setEvolutionChain] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [favoriteActionFeedback, setFavoriteActionFeedback] = useState(null);
    const [comparisonActionFeedback, setComparisonActionFeedback] = useState(null);
    const [showEvolutionTree, setShowEvolutionTree] = useState(false);

    // Handle favorite toggle with feedback
    const handleFavoriteToggle = () => {
        if (!pokemon) return;

        const pokemonData = {
            name: pokemon.name,
            image: getBestPokemonImage(pokemon),
            type: `Type : ${pokemon.types.map(type => type.type.name).join(', ')}`,
            description: `Power: ${pokemon.stats.find(stat => stat.stat.name === 'attack')?.base_stat || 'N/A'}`,
            pokemonTypes: pokemon.types.map(type => type.type.name),
            url: `https://pokeapi.co/api/v2/pokemon/${pokemon.id}/`
        };

        const result = toggleFavorite(pokemonData);

        const message = result.action === 'added'
            ? `${pokemon.name} added to favorites! ❤️`
            : `${pokemon.name} removed from favorites`;

        setFavoriteActionFeedback({
            message,
            type: result.action
        });

        setTimeout(() => {
            setFavoriteActionFeedback(null);
        }, 3000);
    };

    // Handle comparison toggle with feedback
    const handleComparisonToggle = () => {
        if (!pokemon) return;

        const pokemonData = {
            name: pokemon.name,
            image: getBestPokemonImage(pokemon),
            type: `Type : ${pokemon.types.map(type => type.type.name).join(', ')}`,
            description: `Power: ${pokemon.stats.find(stat => stat.stat.name === 'attack')?.base_stat || 'N/A'}`,
            pokemonTypes: pokemon.types.map(type => type.type.name),
            url: `https://pokeapi.co/api/v2/pokemon/${pokemon.id}/`
        };

        let result;
        if (isInComparison(pokemon.name)) {
            result = removeFromComparison(pokemon.name);
        } else if (canAddMore()) {
            result = addToComparison(pokemonData);
        } else {
            result = { success: false, message: 'Maximum 3 Pokemon can be compared at once' };
        }

        if (result) {
            setComparisonActionFeedback({
                message: result.message,
                type: result.success ? 'success' : 'error'
            });

            setTimeout(() => {
                setComparisonActionFeedback(null);
            }, 3000);
        }
    };

    // Scroll to top when component mounts
    useEffect(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, []);

    useEffect(() => {
        const fetchPokemonDetail = async () => {
            try {
                setLoading(true);
                console.log(`🔍 Loading details for ${name} from cache...`);

                // Use cached data methods
                const pokemonData = await getPokemonDetails(name.toLowerCase());
                if (!pokemonData) {
                    throw new Error('Pokemon not found');
                }

                const speciesData = await getPokemonSpecies(name.toLowerCase());
                const evolutionData = await getEvolutionChain(speciesData.evolution_chain.url);

                setPokemon(pokemonData);
                setSpecies(speciesData);
                setEvolutionChain(evolutionData);

                console.log(`✅ Loaded ${name} details from cache`);
                setLoading(false);
            } catch (err) {
                console.error('Error fetching Pokemon details:', err);
                setError('Pokemon not found');
                setLoading(false);
            }
        };

        if (name) {
            fetchPokemonDetail();
        }
    }, [name]);

    // Use centralized type color utility with modern color scheme
    const getTypeColor = (type) => getPokemonTypeColor(type, 'modern');

    const formatEvolutionChain = (chain) => {
        const evolutions = [];
        let current = chain;

        while (current) {
            evolutions.push({
                name: current.species.name,
                minLevel: current.evolution_details[0]?.min_level || null,
                trigger: current.evolution_details[0]?.trigger?.name || null
            });
            current = current.evolves_to[0];
        }

        return evolutions;
    };

    if (loading) {
        return (
            <div className="container my-5">
                <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '50vh' }}>
                    <div className="text-center">
                        <div className="spinner-border text-primary" style={{ width: '3rem', height: '3rem' }} role="status">
                            <span className="visually-hidden">Loading...</span>
                        </div>
                        <h4 className="mt-3">Loading Pokemon Details...</h4>
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="container my-5">
                <div className="alert alert-danger text-center">
                    <h4>{error}</h4>
                    <button className="btn btn-primary mt-3" onClick={() => navigate(-1)}>
                        Go Back
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className={`container my-5 ${isDark ? 'theme-dark' : ''}`}>
            {/* Favorites Action Feedback Toast */}
            {favoriteActionFeedback && (
                <div className="position-fixed top-0 start-50 translate-middle-x" style={{ zIndex: 1050, marginTop: '20px' }}>
                    <div className={`alert alert-dismissible fade show ${favoriteActionFeedback.type === 'added' ? 'alert-success' : 'alert-info'
                        }`} role="alert">
                        <i className={`bi ${favoriteActionFeedback.type === 'added' ? 'bi-heart-fill text-danger' : 'bi-heart'
                            } me-2`}></i>
                        {favoriteActionFeedback.message}
                        <button
                            type="button"
                            className="btn-close"
                            onClick={() => setFavoriteActionFeedback(null)}
                            aria-label="Close"
                        ></button>
                    </div>
                </div>
            )}

            {/* Comparison Action Feedback Toast */}
            {comparisonActionFeedback && (
                <div className="position-fixed top-0 start-50 translate-middle-x" style={{
                    zIndex: 1049,
                    marginTop: favoriteActionFeedback ? '80px' : '20px'
                }}>
                    <div className={`alert alert-dismissible fade show ${comparisonActionFeedback.type === 'success' ? 'alert-info' : 'alert-warning'
                        }`} role="alert">
                        <i className={`bi ${comparisonActionFeedback.type === 'success' ? 'bi-bar-chart-fill' : 'bi-exclamation-triangle'
                            } me-2`}></i>
                        {comparisonActionFeedback.message}
                        <button
                            type="button"
                            className="btn-close"
                            onClick={() => setComparisonActionFeedback(null)}
                            aria-label="Close"
                        ></button>
                    </div>
                </div>
            )}

            {/* Back Button and Action Buttons */}
            <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-2">
                <button className="btn btn-outline-primary" onClick={() => navigate('/')}>
                    <i className="bi bi-arrow-left me-2"></i>
                    Back to Pokemon List
                </button>

                <div className="d-flex gap-2 flex-wrap">
                    <button
                        className={`btn ${isInComparison(pokemon.name)
                            ? 'btn-warning'
                            : canAddMore()
                                ? 'btn-outline-info'
                                : 'btn-outline-secondary'
                            }`}
                        onClick={handleComparisonToggle}
                        title={
                            isInComparison(pokemon.name)
                                ? 'Remove from comparison'
                                : canAddMore()
                                    ? 'Add to comparison'
                                    : 'Comparison limit reached'
                        }
                        disabled={!isInComparison(pokemon.name) && !canAddMore()}
                    >
                        <i className={`bi ${isInComparison(pokemon.name)
                            ? 'bi-bar-chart-fill'
                            : 'bi-bar-chart'
                            } me-2`}></i>
                        {isInComparison(pokemon.name) ? 'Remove from Comparison' : 'Add to Comparison'}
                    </button>

                    <button
                        className={`btn ${isFavorite(pokemon.name)
                            ? 'btn-danger'
                            : 'btn-outline-danger'
                            }`}
                        onClick={handleFavoriteToggle}
                        title={isFavorite(pokemon.name) ? 'Remove from favorites' : 'Add to favorites'}
                    >
                        <i className={`bi ${isFavorite(pokemon.name)
                            ? 'bi-heart-fill'
                            : 'bi-heart'
                            } me-2`}></i>
                        {isFavorite(pokemon.name) ? 'Remove from Favorites' : 'Add to Favorites'}
                    </button>
                </div>
            </div>

            {/* Pokemon Header */}
            <div className="row mb-4">
                <div className="col-md-6">
                    <div className="card shadow-lg">
                        <div className="card-body text-center p-5">
                            <img
                                src={getBestPokemonImage(pokemon)}
                                alt={pokemon.name}
                                className="img-fluid mb-3"
                                style={{ maxHeight: '300px' }}
                            />
                            <h1 className="card-title text-capitalize mb-3">
                                {pokemon.name}
                                {isFavorite(pokemon.name) && (
                                    <i className="bi bi-heart-fill text-danger ms-2" title="In Favorites"></i>
                                )}
                            </h1>
                            <div className="mb-3">
                                {pokemon.types.map(type => (
                                    <span
                                        key={type.type.name}
                                        className="badge me-2 px-3 py-2"
                                        style={{
                                            backgroundColor: getTypeColor(type.type.name),
                                            color: 'white',
                                            fontSize: '0.9rem'
                                        }}
                                    >
                                        {type.type.name.toUpperCase()}
                                    </span>
                                ))}
                            </div>
                            <p className="text-muted">#{formatPokemonId(pokemon.id)}</p>
                        </div>
                    </div>
                </div>

                {/* Basic Info */}
                <div className="col-md-6">
                    <div className="card shadow-lg h-100">
                        <div className="card-header bg-primary text-white">
                            <h4 className="mb-0">Basic Information</h4>
                        </div>
                        <div className="card-body">
                            <div className="row mb-3">
                                <div className="col-6">
                                    <strong>Height:</strong>
                                    <p className="mb-0">{(pokemon.height / 10).toFixed(1)} m</p>
                                </div>
                                <div className="col-6">
                                    <strong>Weight:</strong>
                                    <p className="mb-0">{(pokemon.weight / 10).toFixed(1)} kg</p>
                                </div>
                            </div>
                            <div className="mb-3">
                                <strong>Base Experience:</strong>
                                <p className="mb-0">{pokemon.base_experience} XP</p>
                            </div>
                            <div className="mb-3">
                                <strong>Abilities:</strong>
                                <ul className="list-unstyled mb-0">
                                    {pokemon.abilities.map(ability => (
                                        <li key={ability.ability.name} className="mb-1">
                                            <span className="badge bg-secondary me-2">
                                                {ability.ability.name.replace('-', ' ')}
                                            </span>
                                            {ability.is_hidden && <small className="text-muted">(Hidden)</small>}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                            {species && species.flavor_text_entries && (
                                <div className="mb-3">
                                    <strong>Description:</strong>
                                    <p className="mb-0 small">
                                        {species.flavor_text_entries
                                            .find(entry => entry.language.name === 'en')?.flavor_text
                                            .replace(/\f/g, ' ') || 'No description available'}
                                    </p>
                                </div>
                            )}

                            {/* Evolution Information */}
                            {evolutionChain && (
                                <div className="mb-3">
                                    <strong>Evolution Chain:</strong>
                                    <div className="evolution-chain mt-2">
                                        {(() => {
                                            const evolutions = [];
                                            let current = evolutionChain.chain;

                                            // Build evolution array
                                            while (current) {
                                                evolutions.push({
                                                    name: current.species.name,
                                                    minLevel: current.evolution_details[0]?.min_level || null,
                                                    trigger: current.evolution_details[0]?.trigger?.name || null,
                                                    item: current.evolution_details[0]?.item?.name || null
                                                });
                                                current = current.evolves_to[0];
                                            }

                                            return (
                                                <div className="d-flex flex-wrap align-items-center gap-2">
                                                    {evolutions.map((evo, index) => (
                                                        <React.Fragment key={evo.name}>
                                                            <div className="text-center">
                                                                <div
                                                                    className={`badge px-3 py-2 text-capitalize ${evo.name === pokemon.name.toLowerCase()
                                                                        ? 'bg-primary text-white'
                                                                        : 'bg-light text-dark border'
                                                                        }`}
                                                                    style={{
                                                                        fontSize: '0.8rem',
                                                                        cursor: evo.name !== pokemon.name.toLowerCase() ? 'pointer' : 'default'
                                                                    }}
                                                                    onClick={async () => {
                                                                        if (evo.name !== pokemon.name.toLowerCase()) {
                                                                            // Try to get cached data first
                                                                            const cachedPokemon = await getPokemonDetails(evo.name);
                                                                            const cachedSpecies = await getPokemonSpecies(evo.name);
                                                                            const cachedEvolution = await getEvolutionChain(cachedSpecies.evolution_chain.url);
                                                                            setPokemon(cachedPokemon);
                                                                            setSpecies(cachedSpecies);
                                                                            setEvolutionChain(cachedEvolution);
                                                                            // Do NOT set loading, do NOT navigate
                                                                        }
                                                                    }}
                                                                    title={evo.name !== pokemon.name.toLowerCase() ? `Click to view ${evo.name} details` : 'Current Pokemon'}
                                                                >
                                                                    {evo.name}
                                                                    {evo.name === pokemon.name.toLowerCase() && (
                                                                        <i className="bi bi-star-fill ms-1 text-warning"></i>
                                                                    )}
                                                                </div>
                                                                {evo.minLevel && (
                                                                    <small className="text-muted d-block">Lv. {evo.minLevel}</small>
                                                                )}
                                                                {evo.item && (
                                                                    <small className="text-muted d-block">{evo.item}</small>
                                                                )}
                                                            </div>

                                                            {index < evolutions.length - 1 && (
                                                                <div className="evolution-arrow">
                                                                    <i className="bi bi-arrow-right text-primary" style={{ fontSize: '1.2rem' }}></i>
                                                                </div>
                                                            )}
                                                        </React.Fragment>
                                                    ))}
                                                </div>
                                            );
                                        })()}
                                    </div>

                                    {/* Evolution Stage Info */}
                                    <div className="mt-2">
                                        <small className="text-muted">
                                            {(() => {
                                                let current = evolutionChain.chain;
                                                let stage = 1;

                                                while (current) {
                                                    if (current.species.name === pokemon.name.toLowerCase()) {
                                                        break;
                                                    }
                                                    if (current.evolves_to.length > 0) {
                                                        stage++;
                                                        current = current.evolves_to[0];
                                                    } else {
                                                        break;
                                                    }
                                                }

                                                const totalStages = (() => {
                                                    let count = 1;
                                                    let temp = evolutionChain.chain;
                                                    while (temp.evolves_to.length > 0) {
                                                        count++;
                                                        temp = temp.evolves_to[0];
                                                    }
                                                    return count;
                                                })();

                                                return `Evolution Stage: ${stage} of ${totalStages}`;
                                            })()}
                                        </small>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Stats */}
            <div className="row mb-4">
                <div className="col-12">
                    <div className="card shadow-lg">
                        <div className="card-header bg-success text-white">
                            <h4 className="mb-0">Base Stats</h4>
                        </div>
                        <div className="card-body">
                            <div className="row">
                                {pokemon.stats.map(stat => (
                                    <div key={stat.stat.name} className="col-md-6 mb-3">
                                        <div className="d-flex justify-content-between align-items-center mb-1">
                                            <span className="fw-bold text-capitalize">
                                                {stat.stat.name.replace('-', ' ')}:
                                            </span>
                                            <span className="badge bg-primary">{stat.base_stat}</span>
                                        </div>
                                        <div className="progress" style={{ height: '10px' }}>
                                            <div
                                                className="progress-bar bg-success"
                                                style={{ width: `${(stat.base_stat / 255) * 100}%` }}
                                            ></div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <div className="mt-3 text-center">
                                <strong>Total Base Stats: </strong>
                                <span className="badge bg-warning text-dark fs-6">
                                    {pokemon.stats.reduce((total, stat) => total + stat.base_stat, 0)}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Evolution Chain */}
            {evolutionChain && (
                <div className="row mb-4">
                    <div className="col-12">
                        <div className="card shadow-lg">
                            <div className="card-header bg-warning text-dark">
                                <h4 className="mb-0">Evolution Chain</h4>
                            </div>
                            <div className="card-body">
                                <div className="d-flex justify-content-center align-items-center flex-wrap">
                                    {formatEvolutionChain(evolutionChain.chain).map((evolution, index) => (
                                        <React.Fragment key={evolution.name}>
                                            <div className="text-center mx-3 mb-3">
                                                <div
                                                    className={`border rounded p-3 ${evolution.name === pokemon.name ? 'border-primary bg-light' : 'border-secondary'}`}
                                                    style={{ minWidth: '120px' }}
                                                >
                                                    <h6 className="text-capitalize mb-2">{evolution.name}</h6>
                                                    {evolution.minLevel && (
                                                        <small className="text-muted">Level {evolution.minLevel}</small>
                                                    )}
                                                    {evolution.trigger && evolution.trigger !== 'level-up' && (
                                                        <small className="text-muted d-block">{evolution.trigger}</small>
                                                    )}
                                                </div>
                                            </div>
                                            {index < formatEvolutionChain(evolutionChain.chain).length - 1 && (
                                                <div className="text-center mx-2">
                                                    <i className="bi bi-arrow-right text-primary" style={{ fontSize: '1.5rem' }}></i>
                                                </div>
                                            )}
                                        </React.Fragment>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Evolution Tree Section */}
            <div className="row mb-4">
                <div className="col-12">
                    <div className="card shadow-lg">
                        <div className="card-header bg-gradient" style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
                            <div className="d-flex justify-content-between align-items-center">
                                <h4 className="mb-0 text-white">
                                    <i className="bi bi-diagram-3 me-2"></i>
                                    Evolution Tree
                                </h4>
                                <button
                                    className="btn btn-light btn-sm"
                                    onClick={() => setShowEvolutionTree(!showEvolutionTree)}
                                >
                                    <i className={`bi ${showEvolutionTree ? 'bi-eye-slash' : 'bi-eye'} me-2`}></i>
                                    {showEvolutionTree ? 'Hide' : 'Show'} Tree
                                </button>
                            </div>
                        </div>
                        {showEvolutionTree && (
                            <div className="card-body p-0">
                                <PokemonEvolutionTree pokemonName={pokemon.name} />
                            </div>
                        )}
                        {!showEvolutionTree && (
                            <div className="card-body text-center py-4">
                                <i className="bi bi-diagram-3" style={{ fontSize: '3rem', color: '#6c757d' }}></i>
                                <p className="text-muted mt-2 mb-0">Click "Show Tree" to explore {pokemon.name}'s evolution chain</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Sprites Gallery */}
            <div className="row">
                <div className="col-12">
                    <div className="card shadow-lg">
                        <div className="card-header bg-info text-white">
                            <h4 className="mb-0">Sprites Gallery</h4>
                        </div>
                        <div className="card-body">
                            <div className="row text-center">
                                {pokemon.sprites.front_default && (
                                    <div className="col-md-3 mb-3">
                                        <img src={pokemon.sprites.front_default} alt="Front Default" className="img-fluid border rounded" />
                                        <p className="small mt-2">Front Default</p>
                                    </div>
                                )}
                                {pokemon.sprites.back_default && (
                                    <div className="col-md-3 mb-3">
                                        <img src={pokemon.sprites.back_default} alt="Back Default" className="img-fluid border rounded" />
                                        <p className="small mt-2">Back Default</p>
                                    </div>
                                )}
                                {pokemon.sprites.front_shiny && (
                                    <div className="col-md-3 mb-3">
                                        <img src={pokemon.sprites.front_shiny} alt="Front Shiny" className="img-fluid border rounded" />
                                        <p className="small mt-2">Front Shiny ✨</p>
                                    </div>
                                )}
                                {pokemon.sprites.back_shiny && (
                                    <div className="col-md-3 mb-3">
                                        <img src={pokemon.sprites.back_shiny} alt="Back Shiny" className="img-fluid border rounded" />
                                        <p className="small mt-2">Back Shiny ✨</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PokemonDetail;
