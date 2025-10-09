import React, { useState } from 'react';
import axios from 'axios';

const PokemonApiTester = () => {
    const [pokemonName, setPokemonName] = useState('pikachu');
    const [pokemonData, setPokemonData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchPokemon = async () => {
        setLoading(true);
        setError(null);

        try {
            console.log(`🔍 Fetching Pokemon: ${pokemonName}`);

            // Step 1: Get basic Pokemon data
            const pokemonResponse = await axios.get(
                `https://pokeapi.co/api/v2/pokemon/${pokemonName.toLowerCase()}`
            );
            console.log('📦 Pokemon Data:', pokemonResponse.data);

            // Step 2: Get species data
            const speciesResponse = await axios.get(pokemonResponse.data.species.url);
            console.log('🧬 Species Data:', speciesResponse.data);

            // Step 3: Get evolution chain
            const evolutionResponse = await axios.get(speciesResponse.data.evolution_chain.url);
            console.log('🔄 Evolution Data:', evolutionResponse.data);

            // Process the data like your app does
            const processedData = {
                basic: {
                    id: pokemonResponse.data.id,
                    name: pokemonResponse.data.name,
                    height: pokemonResponse.data.height,
                    weight: pokemonResponse.data.weight,
                    baseExperience: pokemonResponse.data.base_experience,
                    types: pokemonResponse.data.types.map(type => type.type.name),
                },
                images: {
                    official: pokemonResponse.data.sprites.other['official-artwork']?.front_default,
                    dreamWorld: pokemonResponse.data.sprites.other.dream_world?.front_default,
                    default: pokemonResponse.data.sprites.front_default,
                    shiny: pokemonResponse.data.sprites.front_shiny,
                },
                stats: pokemonResponse.data.stats.map(stat => ({
                    name: stat.stat.name,
                    baseStat: stat.base_stat,
                    effort: stat.effort
                })),
                species: {
                    color: speciesResponse.data.color?.name,
                    habitat: speciesResponse.data.habitat?.name,
                    generation: speciesResponse.data.generation?.name,
                    flavorText: speciesResponse.data.flavor_text_entries
                        ?.find(entry => entry.language.name === 'en')?.flavor_text
                },
                evolution: {
                    chainId: evolutionResponse.data.id,
                    baseSpecies: evolutionResponse.data.chain.species.name,
                    // Simplified evolution chain
                    evolutions: extractEvolutions(evolutionResponse.data.chain)
                }
            };

            setPokemonData(processedData);

        } catch (err) {
            console.error('❌ Error fetching Pokemon:', err);
            setError(err.response?.status === 404 ? 'Pokemon not found!' : err.message);
        } finally {
            setLoading(false);
        }
    };

    const extractEvolutions = (chain) => {
        const evolutions = [];

        const processChain = (node) => {
            evolutions.push({
                species: node.species.name,
                minLevel: node.evolution_details?.[0]?.min_level || null,
                trigger: node.evolution_details?.[0]?.trigger?.name || null
            });

            node.evolves_to?.forEach(evolution => {
                processChain(evolution);
            });
        };

        processChain(chain);
        return evolutions;
    };

    const testRandomPokemon = () => {
        const randomId = Math.floor(Math.random() * 151) + 1; // Gen 1 Pokemon
        setPokemonName(randomId.toString());
        fetchPokemon();
    };

    return (
        <div className="container mt-4">
            <div className="card">
                <div className="card-header">
                    <h5><i className="bi bi-cloud-download me-2"></i>Pokemon API Tester</h5>
                    <small className="text-muted">Test Pokemon API endpoints and see raw data</small>
                </div>
                <div className="card-body">

                    {/* Input Section */}
                    <div className="row mb-3">
                        <div className="col-md-8">
                            <div className="input-group">
                                <input
                                    type="text"
                                    className="form-control"
                                    value={pokemonName}
                                    onChange={(e) => setPokemonName(e.target.value)}
                                    placeholder="Enter Pokemon name or ID"
                                    onKeyPress={(e) => e.key === 'Enter' && fetchPokemon()}
                                />
                                <button
                                    className="btn btn-primary"
                                    onClick={fetchPokemon}
                                    disabled={loading}
                                >
                                    {loading ? (
                                        <>
                                            <span className="spinner-border spinner-border-sm me-2"></span>
                                            Fetching...
                                        </>
                                    ) : (
                                        <>
                                            <i className="bi bi-search me-2"></i>
                                            Fetch Pokemon
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>
                        <div className="col-md-4">
                            <button
                                className="btn btn-outline-secondary w-100"
                                onClick={testRandomPokemon}
                                disabled={loading}
                            >
                                <i className="bi bi-shuffle me-2"></i>
                                Random Pokemon
                            </button>
                        </div>
                    </div>

                    {/* Error Display */}
                    {error && (
                        <div className="alert alert-danger" role="alert">
                            <i className="bi bi-exclamation-triangle me-2"></i>
                            {error}
                        </div>
                    )}

                    {/* Results Display */}
                    {pokemonData && (
                        <div className="row">
                            {/* Basic Info */}
                            <div className="col-md-6">
                                <div className="card mb-3">
                                    <div className="card-header">
                                        <h6>Basic Information</h6>
                                    </div>
                                    <div className="card-body">
                                        <table className="table table-sm">
                                            <tbody>
                                                <tr><td><strong>ID:</strong></td><td>{pokemonData.basic.id}</td></tr>
                                                <tr><td><strong>Name:</strong></td><td>{pokemonData.basic.name}</td></tr>
                                                <tr><td><strong>Height:</strong></td><td>{pokemonData.basic.height / 10} m</td></tr>
                                                <tr><td><strong>Weight:</strong></td><td>{pokemonData.basic.weight / 10} kg</td></tr>
                                                <tr><td><strong>Base XP:</strong></td><td>{pokemonData.basic.baseExperience}</td></tr>
                                                <tr>
                                                    <td><strong>Types:</strong></td>
                                                    <td>
                                                        {pokemonData.basic.types.map(type => (
                                                            <span key={type} className="badge bg-primary me-1">
                                                                {type}
                                                            </span>
                                                        ))}
                                                    </td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                </div>

                                {/* Images */}
                                <div className="card mb-3">
                                    <div className="card-header">
                                        <h6>Images</h6>
                                    </div>
                                    <div className="card-body">
                                        <div className="row text-center">
                                            {pokemonData.images.official && (
                                                <div className="col-6 mb-2">
                                                    <img
                                                        src={pokemonData.images.official}
                                                        alt="Official artwork"
                                                        className="img-fluid"
                                                        style={{ maxHeight: '100px' }}
                                                    />
                                                    <br />
                                                    <small>Official</small>
                                                </div>
                                            )}
                                            {pokemonData.images.dreamWorld && (
                                                <div className="col-6 mb-2">
                                                    <img
                                                        src={pokemonData.images.dreamWorld}
                                                        alt="Dream world"
                                                        className="img-fluid"
                                                        style={{ maxHeight: '100px' }}
                                                    />
                                                    <br />
                                                    <small>Dream World</small>
                                                </div>
                                            )}
                                            {pokemonData.images.default && (
                                                <div className="col-6 mb-2">
                                                    <img
                                                        src={pokemonData.images.default}
                                                        alt="Default sprite"
                                                        className="img-fluid"
                                                        style={{ maxHeight: '100px' }}
                                                    />
                                                    <br />
                                                    <small>Default</small>
                                                </div>
                                            )}
                                            {pokemonData.images.shiny && (
                                                <div className="col-6 mb-2">
                                                    <img
                                                        src={pokemonData.images.shiny}
                                                        alt="Shiny sprite"
                                                        className="img-fluid"
                                                        style={{ maxHeight: '100px' }}
                                                    />
                                                    <br />
                                                    <small>Shiny</small>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Stats & Species */}
                            <div className="col-md-6">
                                {/* Stats */}
                                <div className="card mb-3">
                                    <div className="card-header">
                                        <h6>Base Stats</h6>
                                    </div>
                                    <div className="card-body">
                                        {pokemonData.stats.map(stat => (
                                            <div key={stat.name} className="mb-2">
                                                <div className="d-flex justify-content-between">
                                                    <small><strong>{stat.name.toUpperCase()}:</strong></small>
                                                    <small>{stat.baseStat}</small>
                                                </div>
                                                <div className="progress" style={{ height: '5px' }}>
                                                    <div
                                                        className="progress-bar"
                                                        style={{ width: `${(stat.baseStat / 200) * 100}%` }}
                                                    ></div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Species Info */}
                                <div className="card mb-3">
                                    <div className="card-header">
                                        <h6>Species Information</h6>
                                    </div>
                                    <div className="card-body">
                                        <table className="table table-sm">
                                            <tbody>
                                                <tr><td><strong>Color:</strong></td><td>{pokemonData.species.color || 'N/A'}</td></tr>
                                                <tr><td><strong>Habitat:</strong></td><td>{pokemonData.species.habitat || 'N/A'}</td></tr>
                                                <tr><td><strong>Generation:</strong></td><td>{pokemonData.species.generation || 'N/A'}</td></tr>
                                            </tbody>
                                        </table>
                                        {pokemonData.species.flavorText && (
                                            <div className="mt-2">
                                                <strong>Description:</strong>
                                                <p className="small mt-1">{pokemonData.species.flavorText}</p>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Evolution Chain */}
                                <div className="card">
                                    <div className="card-header">
                                        <h6>Evolution Chain</h6>
                                    </div>
                                    <div className="card-body">
                                        {pokemonData.evolution.evolutions.map((evo, index) => (
                                            <div key={index} className="d-flex align-items-center mb-2">
                                                <span className="badge bg-success me-2">{index + 1}</span>
                                                <strong>{evo.species}</strong>
                                                {evo.minLevel && (
                                                    <small className="ms-2 text-muted">(Level {evo.minLevel})</small>
                                                )}
                                                {evo.trigger && evo.trigger !== 'level-up' && (
                                                    <small className="ms-2 text-muted">({evo.trigger})</small>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* API URLs Info */}
                    <div className="mt-4">
                        <div className="card">
                            <div className="card-header">
                                <h6>API Endpoints Used</h6>
                            </div>
                            <div className="card-body">
                                <div className="row">
                                    <div className="col-md-4">
                                        <strong>Pokemon Data:</strong><br />
                                        <code className="small">GET /pokemon/{pokemonName}</code>
                                    </div>
                                    <div className="col-md-4">
                                        <strong>Species Data:</strong><br />
                                        <code className="small">GET /pokemon-species/{id}</code>
                                    </div>
                                    <div className="col-md-4">
                                        <strong>Evolution Chain:</strong><br />
                                        <code className="small">GET /evolution-chain/{id}</code>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PokemonApiTester;