import React, { useState, useEffect } from 'react';
import { useComparison } from '../../context/ComparisonContext';
import axios from 'axios';
import { Link } from 'react-router-dom';
import '../../styles/ComparisonStyles.css';

const PokemonComparison = () => {
    const { comparisonList, removeFromComparison, clearComparison, getComparisonCount } = useComparison();
    const [pokemonDetails, setPokemonDetails] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (comparisonList.length > 0) {
            fetchPokemonDetails();
        } else {
            setPokemonDetails([]);
        }
    }, [comparisonList]);

    const fetchPokemonDetails = async () => {
        setLoading(true);
        setError(null);
        try {
            const promises = comparisonList.map(pokemon =>
                axios.get(`https://pokeapi.co/api/v2/pokemon/${pokemon.name}`)
            );
            const responses = await Promise.all(promises);
            const details = responses.map(response => response.data);
            setPokemonDetails(details);
        } catch (err) {
            setError('Failed to fetch Pokemon details');
            console.error('Error fetching Pokemon details:', err);
        } finally {
            setLoading(false);
        }
    };

    const getStatColor = (statName) => {
        const colors = {
            hp: '#FF5959',
            attack: '#F5AC78',
            defense: '#FAE078',
            'special-attack': '#9DB7F5',
            'special-defense': '#A7DB8D',
            speed: '#FA92B2'
        };
        return colors[statName] || '#999999';
    };

    const getMaxStatValue = (statName) => {
        if (pokemonDetails.length === 0) return 100;
        return Math.max(...pokemonDetails.map(pokemon =>
            pokemon.stats.find(stat => stat.stat.name === statName)?.base_stat || 0
        ));
    };

    const calculateStatPercentage = (value, statName) => {
        const maxValue = getMaxStatValue(statName);
        return Math.max((value / maxValue) * 100, 5); // Minimum 5% for visibility
    };

    const getTotalStats = (pokemon) => {
        return pokemon.stats.reduce((total, stat) => total + stat.base_stat, 0);
    };

    const getAverageStats = (pokemon) => {
        return Math.round(getTotalStats(pokemon) / pokemon.stats.length);
    };

    if (comparisonList.length === 0) {
        return (
            <div className="comparison-container">
                <div className="container py-5">
                    <div className="row justify-content-center">
                        <div className="col-lg-8">
                            <div className="empty-comparison">
                                <i className="bi bi-bar-chart" style={{ fontSize: '5rem' }}></i>
                                <h2>Pokemon Comparison Tool</h2>
                                <p>
                                    Select Pokemon from the main page to compare their stats, abilities, and characteristics side by side.
                                    You can compare up to 3 Pokemon at once!
                                </p>
                                <Link to="/" className="btn btn-pokemon-compare btn-lg mt-3">
                                    <i className="bi bi-arrow-left me-2"></i>
                                    Browse Pokemon
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (loading) {
        return (
            <div className="container py-5">
                <div className="row justify-content-center">
                    <div className="col-12 text-center">
                        <div className="spinner-border text-primary" role="status">
                            <span className="visually-hidden">Loading...</span>
                        </div>
                        <p className="mt-3">Loading Pokemon details...</p>
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="container py-5">
                <div className="row justify-content-center">
                    <div className="col-lg-8 text-center">
                        <div className="alert alert-danger" role="alert">
                            <i className="bi bi-exclamation-triangle me-2"></i>
                            {error}
                        </div>
                        <button className="btn btn-primary" onClick={fetchPokemonDetails}>
                            Try Again
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="comparison-container">
            <div className="container py-4">
                <div className="comparison-header">
                    <h1>
                        <i className="bi bi-bar-chart me-3"></i>
                        Pokemon Comparison
                    </h1>
                    <p>Analyzing {pokemonDetails.length} Pokemon side by side</p>
                    <div className="comparison-counter">
                        {getComparisonCount()}/3 Pokemon Selected
                    </div>
                </div>

                <div className="comparison-actions">
                    <Link to="/" className="btn btn-pokemon-compare">
                        <i className="bi bi-plus me-2"></i>
                        Add More Pokemon
                    </Link>
                    <button
                        className="btn btn-outline-danger"
                        onClick={clearComparison}
                    >
                        <i className="bi bi-trash me-2"></i>
                        Clear All
                    </button>
                </div>

                {/* Pokemon Overview Cards */}
                <div className="row mb-5">
                    {pokemonDetails.map((pokemon, index) => (
                        <div key={pokemon.id} className={`col-lg-${12 / pokemonDetails.length} col-md-6 mb-3`}>
                            <div className="card h-100 border-0 shadow-sm">
                                <div className="card-header bg-primary text-white text-center">
                                    <h5 className="mb-0 text-capitalize">
                                        {pokemon.name}
                                        <button
                                            className="btn btn-sm btn-outline-light ms-2"
                                            onClick={() => removeFromComparison(pokemon.name)}
                                            title="Remove from comparison"
                                        >
                                            <i className="bi bi-x"></i>
                                        </button>
                                    </h5>
                                </div>
                                <div className="card-body text-center">
                                    <img
                                        src={pokemon.sprites.front_default}
                                        alt={pokemon.name}
                                        className="img-fluid mb-3"
                                        style={{ height: '150px' }}
                                    />
                                    <div className="row">
                                        <div className="col-6">
                                            <h6 className="text-muted mb-1">Height</h6>
                                            <p className="mb-0">{pokemon.height / 10} m</p>
                                        </div>
                                        <div className="col-6">
                                            <h6 className="text-muted mb-1">Weight</h6>
                                            <p className="mb-0">{pokemon.weight / 10} kg</p>
                                        </div>
                                    </div>
                                    <div className="row mt-2">
                                        <div className="col-6">
                                            <h6 className="text-muted mb-1">Total Stats</h6>
                                            <p className="mb-0 fw-bold">{getTotalStats(pokemon)}</p>
                                        </div>
                                        <div className="col-6">
                                            <h6 className="text-muted mb-1">Average</h6>
                                            <p className="mb-0 fw-bold">{getAverageStats(pokemon)}</p>
                                        </div>
                                    </div>
                                    <div className="mt-3">
                                        <h6 className="text-muted mb-2">Types</h6>
                                        <div className="d-flex justify-content-center gap-1">
                                            {pokemon.types.map((type, typeIndex) => (
                                                <span
                                                    key={typeIndex}
                                                    className="badge bg-secondary text-capitalize"
                                                >
                                                    {type.type.name}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Stats Comparison */}
                <div className="row">
                    <div className="col-12">
                        <div className="card border-0 shadow-sm">
                            <div className="card-header bg-light">
                                <h5 className="mb-0">
                                    <i className="bi bi-graph-up me-2"></i>
                                    Base Stats Comparison
                                </h5>
                            </div>
                            <div className="card-body">
                                {pokemonDetails[0]?.stats.map((stat, statIndex) => (
                                    <div key={statIndex} className="stat-bar-container">
                                        <h6 className="stat-label mb-3">
                                            {stat.stat.name.replace('-', ' ')}
                                        </h6>
                                        {pokemonDetails.map((pokemon, pokemonIndex) => {
                                            const currentStat = pokemon.stats[statIndex];
                                            const percentage = calculateStatPercentage(currentStat.base_stat, stat.stat.name);

                                            return (
                                                <div key={pokemonIndex} className="mb-3">
                                                    <div className="d-flex justify-content-between align-items-center mb-2">
                                                        <span className="text-capitalize fw-medium">
                                                            {pokemon.name}
                                                        </span>
                                                        <span className="stat-value">
                                                            {currentStat.base_stat}
                                                        </span>
                                                    </div>
                                                    <div className="stat-progress">
                                                        <div
                                                            className={`stat-progress-bar stat-${stat.stat.name}`}
                                                            style={{
                                                                width: `${percentage}%`
                                                            }}
                                                        >
                                                        </div>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Abilities Comparison */}
                <div className="row mt-4">
                    <div className="col-12">
                        <div className="card border-0 shadow-sm">
                            <div className="card-header bg-light">
                                <h5 className="mb-0">
                                    <i className="bi bi-lightning me-2"></i>
                                    Abilities Comparison
                                </h5>
                            </div>
                            <div className="card-body">
                                <div className="row">
                                    {pokemonDetails.map((pokemon, index) => (
                                        <div key={pokemon.id} className={`col-lg-${12 / pokemonDetails.length} col-md-6 mb-3`}>
                                            <h6 className="text-capitalize mb-3">{pokemon.name}</h6>
                                            {pokemon.abilities.map((ability, abilityIndex) => (
                                                <div key={abilityIndex} className="mb-2">
                                                    <span
                                                        className={`badge ${ability.is_hidden ? 'bg-warning' : 'bg-info'} text-capitalize`}
                                                    >
                                                        {ability.ability.name.replace('-', ' ')}
                                                        {ability.is_hidden && ' (Hidden)'}
                                                    </span>
                                                </div>
                                            ))}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PokemonComparison;