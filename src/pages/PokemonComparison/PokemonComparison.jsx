import React, { useState, useEffect } from 'react';
import { useComparison } from '../../context/ComparisonContext';
import { usePokemonData } from '../../context/PokemonDataContext';
import { useTheme } from '../../context/ThemeContext';
import { useLanguage } from '../../context/LanguageContext';
import { getTotalStats, getAverageStats } from '../../utils';
import { Link } from 'react-router-dom';
import '../../styles/ComparisonStyles.css';

const PokemonComparison = () => {
    const { comparisonList, removeFromComparison, clearComparison, getComparisonCount } = useComparison();
    const { getPokemonDetails, getPokemonSpecies } = usePokemonData();
    const { isDark } = useTheme();
    const { t, getTypeName, getPokemonName, language } = useLanguage();
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
            const promises = comparisonList.map(async pokemon => {
                const details = await getPokemonDetails(pokemon.name.toLowerCase());
                const species = await getPokemonSpecies(pokemon.name.toLowerCase());
                return { ...details, species };
            });
            const details = await Promise.all(promises);
            const validDetails = details.filter(detail => detail !== null);
            setPokemonDetails(validDetails);
        } catch (error) {
            setError('Failed to fetch Pokemon details');
        } finally {
            setLoading(false);
        }
    };

    if (comparisonList.length === 0) {
        return (
            <div className={`comparison-container ${isDark ? 'theme-dark' : ''}`}>
                <div className="container py-5">
                    <div className="row justify-content-center">
                        <div className="col-lg-8">
                            <div className="empty-comparison">
                                <i className="bi bi-bar-chart" style={{ fontSize: '5rem' }}></i>
                                <h2>{t('comparison_title')}</h2>
                                <p>
                                    {t('comparison_select')}
                                </p>
                                <Link to="/" className="btn btn-pokemon-compare btn-lg mt-3">
                                    <i className="bi bi-arrow-left me-2"></i>
                                    {t('nav_home')}
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
                        <p className="mt-3">{t('msg_loading')}</p>
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
                            {t('comparison_try_again') || 'Try Again'}
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className={`comparison-container ${isDark ? 'theme-dark' : ''}`}>
            <div className="container py-4">
                <div className="comparison-header">
                    <h1>
                        <i className="bi bi-bar-chart me-3"></i>
                        {t('comparison_title')}
                    </h1>
                    <p>{t('comparison_analyzing') || `Analyzing ${pokemonDetails.length} Pokemon side by side`}</p>
                    <div className="comparison-counter">
                        {getComparisonCount()}/3 {t('comparison_selected') || 'Pokemon Selected'}
                    </div>
                </div>

                <div className="comparison-actions">
                    <Link to="/" className="btn btn-pokemon-compare">
                        <i className="bi bi-plus me-2"></i>
                        {t('comparison_add_more') || 'Add More Pokemon'}
                    </Link>
                    <button
                        className="btn btn-outline-danger"
                        onClick={clearComparison}
                    >
                        <i className="bi bi-trash me-2"></i>
                        {t('action_clear_all')}
                    </button>
                </div>

                {/* Pokemon Overview Cards */}
                <div className="row mb-5">
                    {pokemonDetails.map((pokemon) => (
                        <div key={pokemon.id} className={`col-lg-${12 / pokemonDetails.length} col-md-6 mb-3`}>
                            <div className="card h-100 border-0 shadow-sm">
                                <div className="card-header bg-primary text-white text-center">
                                    <h5 className="mb-0 text-capitalize">
                                        {getPokemonName(pokemon, pokemon.species)}
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
                                            <h6 className="text-muted mb-1">{t('detail_height')}</h6>
                                            <p className="mb-0">{pokemon.height / 10} m</p>
                                        </div>
                                        <div className="col-6">
                                            <h6 className="text-muted mb-1">{t('detail_weight')}</h6>
                                            <p className="mb-0">{pokemon.weight / 10} kg</p>
                                        </div>
                                    </div>
                                    <div className="row mt-2">
                                        <div className="col-6">
                                            <h6 className="text-muted mb-1">{t('comparison_total_stats') || 'Total Stats'}</h6>
                                            <p className="mb-0 fw-bold">{getTotalStats(pokemon)}</p>
                                        </div>
                                        <div className="col-6">
                                            <h6 className="text-muted mb-1">{t('comparison_average') || 'Average'}</h6>
                                            <p className="mb-0 fw-bold">{getAverageStats(pokemon)}</p>
                                        </div>
                                    </div>
                                    <div className="mt-3">
                                        <h6 className="text-muted mb-2">{t('comparison_types') || 'Types'}</h6>
                                        <div className="d-flex justify-content-center gap-1">
                                            {pokemon.types.map((type, typeIndex) => (
                                                <span
                                                    key={typeIndex}
                                                    className="badge bg-secondary text-capitalize"
                                                >
                                                    {getTypeName(type.type.name)}
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
                                        {/* Modern Stats Comparison Cards */}
                                        <div className="stats-comparison-grid">
                                            {pokemonDetails[0]?.stats.map((stat, statIndex) => {
                                                const statValues = pokemonDetails.map(pokemon => ({
                                                    name: getPokemonName(pokemon, pokemon.species),
                                                    value: pokemon.stats[statIndex].base_stat,
                                                    pokemon: pokemon
                                                }));
                                                const maxValue = Math.max(...statValues.map(s => s.value));
                                                const winner = statValues.find(s => s.value === maxValue);

                                                return (
                                                    <div key={statIndex} className="stat-comparison-card">
                                                        <div className="stat-header">
                                                            <h6 className="stat-name">
                                                                {stat.stat.name === 'hp' && '💖'}
                                                                {stat.stat.name === 'attack' && '⚔️'}
                                                                {stat.stat.name === 'defense' && '🛡️'}
                                                                {stat.stat.name === 'special-attack' && '✨'}
                                                                {stat.stat.name === 'special-defense' && '🔮'}
                                                                {stat.stat.name === 'speed' && '💨'}
                                                                {' '}
                                                                {stat.stat.name.replace('-', ' ').toUpperCase()}
                                                            </h6>
                                                            <div className="stat-winner">
                                                                <span className="winner-badge">🏆 {winner.name}</span>
                                                            </div>
                                                        </div>
                                                        <div className="stat-bars">
                                                            {statValues.map((statData, pokemonIndex) => (
                                                                <div key={pokemonIndex} className="pokemon-stat-row">
                                                                    <div className="pokemon-info">
                                                                        <img
                                                                            src={statData.pokemon.sprites.front_default}
                                                                            alt={statData.name}
                                                                            className="pokemon-mini-avatar"
                                                                        />
                                                                        <span className="pokemon-name">{statData.name}</span>
                                                                    </div>
                                                                    <div className="stat-bar-wrapper">
                                                                        <div className="stat-bar-bg">
                                                                            <div
                                                                                className={`stat-bar-fill stat-${stat.stat.name} ${statData.value === maxValue ? 'winner' : ''}`}
                                                                                style={{ width: `${(statData.value / maxValue) * 100}%` }}
                                                                            >
                                                                            </div>
                                                                        </div>
                                                                        <span className="stat-value">{statData.value}</span>
                                                                        {statData.value === maxValue && <span className="best-indicator">🌟</span>}
                                                                    </div>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>

                                        {/* Overall Champion Card */}
                                        <div className="overall-champion-card mt-4">
                                            <div className="champion-header">
                                                <h5>🏆 Overall Stats Champion</h5>
                                            </div>
                                            <div className="champion-content">
                                                {(() => {
                                                    const maxTotal = Math.max(...pokemonDetails.map(p => getTotalStats(p)));
                                                    return pokemonDetails.map((pokemon, index) => {
                                                        const total = getTotalStats(pokemon);
                                                        const isChampion = total === maxTotal;

                                                        return (
                                                            <div key={index} className={`champion-pokemon ${isChampion ? 'champion' : ''}`}>
                                                                <div className="champion-pokemon-info">
                                                                    <img
                                                                        src={pokemon.sprites.front_default}
                                                                        alt={pokemon.name}
                                                                        className="champion-avatar"
                                                                    />
                                                                    <div className="champion-details">
                                                                        <h6 className="champion-name">{getPokemonName(pokemon, pokemon.species)}</h6>
                                                                        <div className="champion-total">
                                                                            Total: <strong>{total}</strong>
                                                                            {isChampion && <span className="crown">👑</span>}
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                                <div className="champion-bar-wrapper">
                                                                    <div className="champion-bar-bg">
                                                                        <div
                                                                            className={`champion-bar-fill ${isChampion ? 'champion-fill' : ''}`}
                                                                            style={{ width: `${(total / maxTotal) * 100}%` }}
                                                                        ></div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        );
                                                    });
                                                })()}
                                            </div>
                                        </div>

                                        {/* Battle Summary */}
                                        <div className="battle-summary mt-4">
                                            <h6 className="summary-title">⚔️ Battle Analysis</h6>
                                            <div className="summary-grid">
                                                {pokemonDetails.map((pokemon, index) => {
                                                    const wins = pokemonDetails[0]?.stats.filter((stat, statIndex) => {
                                                        const statValues = pokemonDetails.map(p => p.stats[statIndex].base_stat);
                                                        const maxValue = Math.max(...statValues);
                                                        return pokemon.stats[statIndex].base_stat === maxValue;
                                                    }).length || 0;

                                                    return (
                                                        <div key={index} className="summary-card">
                                                            <img
                                                                src={pokemon.sprites.front_default}
                                                                alt={pokemon.name}
                                                                className="summary-avatar"
                                                            />
                                                            <div className="summary-info">
                                                                <h6>{getPokemonName(pokemon, pokemon.species)}</h6>
                                                                <p>Dominates in <strong>{wins}</strong> stats</p>
                                                                <div className="win-percentage">
                                                                    Win Rate: {Math.round((wins / 6) * 100)}%
                                                                </div>
                                                            </div>
                                                        </div>
                                                    );
                                                })}
                                            </div>
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
                                    {pokemonDetails.map((pokemon) => (
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
                                    {pokemonDetails.map((pokemon) => {
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