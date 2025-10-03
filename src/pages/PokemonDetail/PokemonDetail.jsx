import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useFavorites } from '../../context/FavoritesContext';
import axios from 'axios';

const PokemonDetail = () => {
    const { name } = useParams();
    const navigate = useNavigate();
    const { toggleFavorite, isFavorite } = useFavorites();
    const [pokemon, setPokemon] = useState(null);
    const [species, setSpecies] = useState(null);
    const [evolutionChain, setEvolutionChain] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [favoriteActionFeedback, setFavoriteActionFeedback] = useState(null);

    // Handle favorite toggle with feedback
    const handleFavoriteToggle = () => {
        if (!pokemon) return;

        const pokemonData = {
            name: pokemon.name,
            image: pokemon.sprites.other['official-artwork'].front_default || pokemon.sprites.front_default,
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

    useEffect(() => {
        const fetchPokemonDetail = async () => {
            try {
                setLoading(true);

                // Fetch basic Pokemon data
                const pokemonResponse = await axios.get(`https://pokeapi.co/api/v2/pokemon/${name.toLowerCase()}`);
                const pokemonData = pokemonResponse.data;

                // Fetch species data for additional info
                const speciesResponse = await axios.get(pokemonData.species.url);
                const speciesData = speciesResponse.data;

                // Fetch evolution chain
                const evolutionResponse = await axios.get(speciesData.evolution_chain.url);
                const evolutionData = evolutionResponse.data;

                setPokemon(pokemonData);
                setSpecies(speciesData);
                setEvolutionChain(evolutionData);
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

    const getTypeColor = (type) => {
        const colors = {
            fire: '#FF6B6B',
            water: '#4ECDC4',
            grass: '#45B7D1',
            electric: '#FFA07A',
            psychic: '#DDA0DD',
            ice: '#87CEEB',
            dragon: '#9370DB',
            dark: '#696969',
            fighting: '#CD5C5C',
            poison: '#9932CC',
            ground: '#DAA520',
            flying: '#87CEFA',
            bug: '#32CD32',
            rock: '#A0522D',
            ghost: '#4B0082',
            steel: '#778899',
            fairy: '#FFB6C1',
            normal: '#D2B48C'
        };
        return colors[type] || '#A8A8A8';
    };

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
        <div className="container my-5">
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

            {/* Back Button and Favorite Button */}
            <div className="d-flex justify-content-between align-items-center mb-4">
                <button className="btn btn-outline-primary" onClick={() => navigate(-1)}>
                    <i className="bi bi-arrow-left me-2"></i>
                    Back to Pokemon List
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

            {/* Pokemon Header */}
            <div className="row mb-4">
                <div className="col-md-6">
                    <div className="card shadow-lg">
                        <div className="card-body text-center p-5">
                            <img
                                src={pokemon.sprites.other['official-artwork'].front_default || pokemon.sprites.front_default}
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
                            <p className="text-muted">#{pokemon.id.toString().padStart(3, '0')}</p>
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
                                <div>
                                    <strong>Description:</strong>
                                    <p className="mb-0 small">
                                        {species.flavor_text_entries
                                            .find(entry => entry.language.name === 'en')?.flavor_text
                                            .replace(/\f/g, ' ') || 'No description available'}
                                    </p>
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
