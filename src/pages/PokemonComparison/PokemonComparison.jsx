import React, { useState, useEffect } from 'react';
import { useComparison } from '../../context/ComparisonContext';
import { usePokemonData } from '../../context/PokemonDataContext';
import { getPokemonStatColor, getTotalStats, getAverageStats } from '../../utils';
import { Link } from 'react-router-dom';
import '../../styles/ComparisonStyles.css';

const PokemonComparison = () => {
    const { comparisonList, removeFromComparison, clearComparison, getComparisonCount } = useComparison();
    const { getPokemonDetails } = usePokemonData();
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
                getPokemonDetails(pokemon.name.toLowerCase())
            );
            const details = await Promise.all(promises);
            const validDetails = details.filter(detail => detail !== null);
            setPokemonDetails(validDetails);
        } catch (err) {
            setError('Failed to fetch Pokemon details');
        } finally {
            setLoading(false);
        }
    };

    const getStatColor = getPokemonStatColor;

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
                <div className="row mt-4">
                    <div className="col-12">
                        <div className="card border-0 shadow-sm">
                            <div className="card-header bg-primary text-white">
                                <h5 className="mb-0">
                                    <i className="bi bi-graph-up me-2"></i>
                                    📊 Base Stats Comparison
                                </h5>
                                <small>Compare individual stats across all selected Pokemon</small>
                            </div>
                            <div className="card-body p-4">
                                {pokemonDetails.length === 0 ? (
                                    <div className="text-center text-muted">
                                        <p>No Pokemon data available for comparison.</p>
                                        <p>Please add Pokemon to comparison from the main page.</p>
                                    </div>
                                ) : (
                                    <div>
                                        {/* Head-to-Head Stats Table */}
                                        <div className="table-responsive">
                                            <table className="table table-hover">
                                                <thead className="table-primary">
                                                    <tr>
                                                        <th scope="col" style={{ width: '200px' }}>Stat</th>
                                                        {pokemonDetails.map((pokemon, index) => (
                                                            <th key={index} scope="col" className="text-center text-capitalize">
                                                                <div className="d-flex flex-column align-items-center">
                                                                    <img
                                                                        src={pokemon.sprites.front_default}
                                                                        alt={pokemon.name}
                                                                        style={{ width: '40px', height: '40px' }}
                                                                    />
                                                                    <strong>{pokemon.name}</strong>
                                                                </div>
                                                            </th>
                                                        ))}
                                                        <th scope="col" className="text-center">
                                                            <div className="d-flex flex-column align-items-center">
                                                                <div className="mb-2">
                                                                    <span style={{ fontSize: '24px' }}>🏆</span>
                                                                    <span style={{ fontSize: '20px' }}>👑</span>
                                                                    <span style={{ fontSize: '24px' }}>🥇</span>
                                                                </div>
                                                                <strong>Winner</strong>
                                                            </div>
                                                        </th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {pokemonDetails[0]?.stats.map((stat, statIndex) => {
                                                        const statValues = pokemonDetails.map(pokemon => ({
                                                            name: pokemon.name,
                                                            value: pokemon.stats[statIndex].base_stat
                                                        }));
                                                        const maxValue = Math.max(...statValues.map(s => s.value));
                                                        const winner = statValues.find(s => s.value === maxValue);

                                                        return (
                                                            <tr key={statIndex}>
                                                                <td className="fw-bold text-uppercase" style={{ fontSize: '14px' }}>
                                                                    {stat.stat.name.replace('-', ' ')}
                                                                </td>
                                                                {statValues.map((statData, pokemonIndex) => (
                                                                    <td key={pokemonIndex} className="text-center">
                                                                        <div className={`p-2 rounded ${statData.value === maxValue ? 'bg-success text-white fw-bold' : 'bg-light'}`}>
                                                                            <div className="fs-5">{statData.value}</div>
                                                                            {statData.value === maxValue && (
                                                                                <small>🏆 Best</small>
                                                                            )}
                                                                        </div>
                                                                    </td>
                                                                ))}
                                                                <td className="text-center">
                                                                    <div className="d-flex flex-column align-items-center">
                                                                        <strong className="text-success text-capitalize">{winner.name}</strong>
                                                                        <small className="text-muted">({winner.value})</small>
                                                                    </div>
                                                                </td>
                                                            </tr>
                                                        );
                                                    })}
                                                    {/* Total Stats Row */}
                                                    <tr className="table-warning">
                                                        <td className="fw-bold">TOTAL STATS</td>
                                                        {pokemonDetails.map((pokemon, index) => {
                                                            const total = getTotalStats(pokemon);
                                                            const maxTotal = Math.max(...pokemonDetails.map(p => getTotalStats(p)));
                                                            return (
                                                                <td key={index} className="text-center">
                                                                    <div className={`p-2 rounded ${total === maxTotal ? 'bg-warning fw-bold' : 'bg-light'}`}>
                                                                        <div className="fs-4">{total}</div>
                                                                        {total === maxTotal && (
                                                                            <small>👑 Strongest</small>
                                                                        )}
                                                                    </div>
                                                                </td>
                                                            );
                                                        })}
                                                        <td className="text-center">
                                                            <strong className="text-warning">
                                                                {pokemonDetails.find(p => getTotalStats(p) === Math.max(...pokemonDetails.map(p => getTotalStats(p)))).name}
                                                            </strong>
                                                        </td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </div>

                                        {/* Quick Summary */}
                                        <div className="mt-4 p-3 bg-info bg-opacity-10 rounded">
                                            <h6 className="text-info">📊 Quick Summary:</h6>
                                            {pokemonDetails.map((pokemon, index) => {
                                                const wins = pokemonDetails[0]?.stats.filter((stat, statIndex) => {
                                                    const statValues = pokemonDetails.map(p => p.stats[statIndex].base_stat);
                                                    const maxValue = Math.max(...statValues);
                                                    return pokemon.stats[statIndex].base_stat === maxValue;
                                                }).length || 0;

                                                return (
                                                    <div key={index} className="mb-2">
                                                        <strong className="text-capitalize">{pokemon.name}</strong> wins in <strong>{wins}</strong> stats
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                )}
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

                {/* Type Weakness & Battle Strategy Comparison */}
                <div className="row mt-4">
                    <div className="col-12">
                        <div className="card border-0 shadow-sm">
                            <div className="card-header bg-warning text-dark">
                                <h5 className="mb-0">
                                    <i className="bi bi-shield-exclamation me-2"></i>
                                    ⚔️ Type Weakness & Battle Strategy
                                </h5>
                                <small>Know your Pokemon's strengths and vulnerabilities in battle</small>
                            </div>
                            <div className="card-body">
                                <div className="row">
                                    {pokemonDetails.map((pokemon, index) => {
                                        // Get type effectiveness (this is a simplified version)
                                        const getTypeWeaknesses = (types) => {
                                            const typeChart = {
                                                'fire': { weak: ['water', 'ground', 'rock'], strong: ['grass', 'ice', 'bug', 'steel'] },
                                                'water': { weak: ['electric', 'grass'], strong: ['fire', 'ground', 'rock'] },
                                                'grass': { weak: ['fire', 'ice', 'poison', 'flying', 'bug'], strong: ['water', 'ground', 'rock'] },
                                                'electric': { weak: ['ground'], strong: ['water', 'flying'] },
                                                'psychic': { weak: ['bug', 'ghost', 'dark'], strong: ['fighting', 'poison'] },
                                                'ice': { weak: ['fire', 'fighting', 'rock', 'steel'], strong: ['grass', 'ground', 'flying', 'dragon'] },
                                                'dragon': { weak: ['ice', 'dragon', 'fairy'], strong: ['dragon'] },
                                                'dark': { weak: ['fighting', 'bug', 'fairy'], strong: ['psychic', 'ghost'] },
                                                'fairy': { weak: ['poison', 'steel'], strong: ['fighting', 'dragon', 'dark'] },
                                                'fighting': { weak: ['flying', 'psychic', 'fairy'], strong: ['normal', 'ice', 'rock', 'dark', 'steel'] },
                                                'poison': { weak: ['ground', 'psychic'], strong: ['grass', 'fairy'] },
                                                'ground': { weak: ['water', 'grass', 'ice'], strong: ['fire', 'electric', 'poison', 'rock', 'steel'] },
                                                'flying': { weak: ['electric', 'ice', 'rock'], strong: ['grass', 'fighting', 'bug'] },
                                                'bug': { weak: ['fire', 'flying', 'rock'], strong: ['grass', 'psychic', 'dark'] },
                                                'rock': { weak: ['water', 'grass', 'fighting', 'ground', 'steel'], strong: ['fire', 'ice', 'flying', 'bug'] },
                                                'ghost': { weak: ['ghost', 'dark'], strong: ['psychic', 'ghost'] },
                                                'steel': { weak: ['fire', 'fighting', 'ground'], strong: ['ice', 'rock', 'fairy'] },
                                                'normal': { weak: ['fighting'], strong: [] }
                                            };

                                            let allWeaknesses = new Set();
                                            let allStrengths = new Set();

                                            types.forEach(typeObj => {
                                                const typeName = typeObj.type.name;
                                                if (typeChart[typeName]) {
                                                    typeChart[typeName].weak.forEach(w => allWeaknesses.add(w));
                                                    typeChart[typeName].strong.forEach(s => allStrengths.add(s));
                                                }
                                            });

                                            return {
                                                weaknesses: Array.from(allWeaknesses),
                                                strengths: Array.from(allStrengths)
                                            };
                                        };

                                        const effectiveness = getTypeWeaknesses(pokemon.types);

                                        return (
                                            <div key={pokemon.id} className={`col-lg-${12 / pokemonDetails.length} col-md-6 mb-3`}>
                                                <div className="h-100 p-3 border rounded bg-light">
                                                    <h6 className="text-capitalize mb-3 d-flex align-items-center">
                                                        <img
                                                            src={pokemon.sprites.front_default}
                                                            alt={pokemon.name}
                                                            style={{ width: '30px', height: '30px', marginRight: '8px' }}
                                                        />
                                                        <strong>{pokemon.name}</strong>
                                                    </h6>

                                                    {/* Pokemon Types */}
                                                    <div className="mb-3">
                                                        <small className="text-muted fw-bold">TYPES:</small>
                                                        <div className="d-flex gap-1 mt-1">
                                                            {pokemon.types.map((type, typeIndex) => (
                                                                <span
                                                                    key={typeIndex}
                                                                    className="badge bg-secondary text-capitalize"
                                                                    style={{ fontSize: '11px' }}
                                                                >
                                                                    {type.type.name}
                                                                </span>
                                                            ))}
                                                        </div>
                                                    </div>

                                                    {/* Weaknesses */}
                                                    <div className="mb-3">
                                                        <small className="text-danger fw-bold">⚠️ WEAK TO:</small>
                                                        <div className="d-flex flex-wrap gap-1 mt-1">
                                                            {effectiveness.weaknesses.slice(0, 6).map((weakness, wIndex) => (
                                                                <span
                                                                    key={wIndex}
                                                                    className="badge bg-danger text-capitalize"
                                                                    style={{ fontSize: '10px' }}
                                                                >
                                                                    {weakness}
                                                                </span>
                                                            ))}
                                                        </div>
                                                    </div>

                                                    {/* Strengths */}
                                                    <div className="mb-3">
                                                        <small className="text-success fw-bold">💪 STRONG VS:</small>
                                                        <div className="d-flex flex-wrap gap-1 mt-1">
                                                            {effectiveness.strengths.slice(0, 6).map((strength, sIndex) => (
                                                                <span
                                                                    key={sIndex}
                                                                    className="badge bg-success text-capitalize"
                                                                    style={{ fontSize: '10px' }}
                                                                >
                                                                    {strength}
                                                                </span>
                                                            ))}
                                                        </div>
                                                    </div>

                                                    {/* Battle Recommendation */}
                                                    <div className="mt-3 p-2 bg-info bg-opacity-10 rounded">
                                                        <small className="text-info fw-bold">🎯 BATTLE TIP:</small>
                                                        <div style={{ fontSize: '12px' }} className="mt-1">
                                                            {effectiveness.weaknesses.length > 3 ?
                                                                `⚠️ High vulnerability - use defensively` :
                                                                `🛡️ Good defensive option`
                                                            }
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>

                                {/* Battle Matchup Analysis */}
                                {pokemonDetails.length === 2 && (
                                    <div className="mt-4 p-3 bg-primary bg-opacity-10 rounded">
                                        <h6 className="text-primary">⚔️ Head-to-Head Battle Analysis:</h6>
                                        <div className="row">
                                            <div className="col-md-6">
                                                <strong className="text-capitalize">{pokemonDetails[0].name}</strong> advantages:
                                                <ul className="mt-2" style={{ fontSize: '14px' }}>
                                                    <li>Higher stats in: {pokemonDetails[0].stats.filter((stat, index) =>
                                                        stat.base_stat > pokemonDetails[1].stats[index].base_stat
                                                    ).map(s => s.stat.name.replace('-', ' ')).join(', ') || 'None'}</li>
                                                </ul>
                                            </div>
                                            <div className="col-md-6">
                                                <strong className="text-capitalize">{pokemonDetails[1].name}</strong> advantages:
                                                <ul className="mt-2" style={{ fontSize: '14px' }}>
                                                    <li>Higher stats in: {pokemonDetails[1].stats.filter((stat, index) =>
                                                        stat.base_stat > pokemonDetails[0].stats[index].base_stat
                                                    ).map(s => s.stat.name.replace('-', ' ')).join(', ') || 'None'}</li>
                                                </ul>
                                            </div>
                                        </div>
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

export default PokemonComparison;