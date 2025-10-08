import React, { useState, useEffect } from 'react';
import { usePokemonData } from '../../context/PokemonDataContext';

const TypeDebugger = () => {
    const { pokemonList, pokemonTypes, isLoading } = usePokemonData();
    const [typeAnalysis, setTypeAnalysis] = useState(null);

    useEffect(() => {
        if (pokemonList.length > 0) {
            analyzeTypes();
        }
    }, [pokemonList]);

    const analyzeTypes = () => {
        // Define official Pokemon types
        const officialTypes = [
            'normal', 'fire', 'water', 'electric', 'grass', 'ice',
            'fighting', 'poison', 'ground', 'flying', 'psychic', 'bug',
            'rock', 'ghost', 'dragon', 'dark', 'steel', 'fairy',
            'stellar' // New Tera type from recent games
        ];

        // Extract all types from Pokemon data
        const typesInData = new Set();
        const typeCount = {};
        const pokemonWithUnknownTypes = [];
        const nonOfficialTypes = new Set();

        pokemonList.forEach(pokemon => {
            if (pokemon.pokemonTypes) {
                pokemon.pokemonTypes.forEach(type => {
                    typesInData.add(type);
                    typeCount[type] = (typeCount[type] || 0) + 1;

                    // Check if type is not official
                    if (!officialTypes.includes(type.toLowerCase())) {
                        nonOfficialTypes.add(type);
                    }
                });
            } else {
                pokemonWithUnknownTypes.push(pokemon.name);
            }
        });

        // Check for types in data but not in pokemonTypes filter
        const typesInDataArray = Array.from(typesInData);
        const missingFromFilter = typesInDataArray.filter(type =>
            !pokemonTypes.includes(type)
        );

        // Check for types in filter but not in data
        const extraInFilter = pokemonTypes.filter(type =>
            type !== 'All' && !typesInDataArray.includes(type)
        );

        setTypeAnalysis({
            totalPokemon: pokemonList.length,
            totalTypesInData: typesInDataArray.length,
            totalTypesInFilter: pokemonTypes.length - 1, // -1 for "All"
            typesInData: typesInDataArray.sort(),
            typeCount,
            missingFromFilter,
            extraInFilter,
            pokemonWithUnknownTypes,
            nonOfficialTypes: Array.from(nonOfficialTypes).sort(),
            pokemonTypes: pokemonTypes.filter(t => t !== 'All').sort(),
            officialTypes
        });
    };

    if (isLoading) {
        return (
            <div className="container mt-4">
                <div className="alert alert-info">
                    <i className="bi bi-hourglass-split me-2"></i>
                    Loading Pokemon data for type analysis...
                </div>
            </div>
        );
    }

    if (!typeAnalysis) {
        return (
            <div className="container mt-4">
                <div className="alert alert-warning">
                    No type analysis available. Make sure Pokemon data is loaded.
                </div>
            </div>
        );
    }

    return (
        <div className="container mt-4">
            <div className="card">
                <div className="card-header">
                    <h5><i className="bi bi-bar-chart me-2"></i>Pokemon Type Analysis</h5>
                    <small className="text-muted">Debug type filtering issues</small>
                </div>
                <div className="card-body">

                    {/* Summary */}
                    <div className="row mb-4">
                        <div className="col-md-3">
                            <div className="card bg-primary text-white">
                                <div className="card-body text-center">
                                    <h4>{typeAnalysis.totalPokemon}</h4>
                                    <small>Total Pokemon</small>
                                </div>
                            </div>
                        </div>
                        <div className="col-md-3">
                            <div className="card bg-success text-white">
                                <div className="card-body text-center">
                                    <h4>{typeAnalysis.totalTypesInData}</h4>
                                    <small>Types in Data</small>
                                </div>
                            </div>
                        </div>
                        <div className="col-md-3">
                            <div className="card bg-info text-white">
                                <div className="card-body text-center">
                                    <h4>{typeAnalysis.totalTypesInFilter}</h4>
                                    <small>Types in Filter</small>
                                </div>
                            </div>
                        </div>
                        <div className="col-md-3">
                            <div className="card bg-warning text-white">
                                <div className="card-body text-center">
                                    <h4>{typeAnalysis.missingFromFilter.length}</h4>
                                    <small>Missing Types</small>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Missing Types Alert */}
                    {typeAnalysis.missingFromFilter.length > 0 && (
                        <div className="alert alert-warning mb-4">
                            <h6><i className="bi bi-exclamation-triangle me-2"></i>Types Missing from Filter:</h6>
                            <div>
                                {typeAnalysis.missingFromFilter.map(type => (
                                    <span key={type} className="badge bg-warning text-dark me-2 mb-1">
                                        {type} ({typeAnalysis.typeCount[type]} Pokemon)
                                    </span>
                                ))}
                            </div>
                            <small className="mt-2 d-block">
                                These types exist in Pokemon data but are not available in the type filter dropdown.
                            </small>
                        </div>
                    )}

                    {/* Non-Official Types Alert */}
                    {typeAnalysis.nonOfficialTypes.length > 0 && (
                        <div className="alert alert-secondary mb-4">
                            <h6><i className="bi bi-info-circle me-2"></i>Non-Official Types Found (Excluded from Filter):</h6>
                            <div>
                                {typeAnalysis.nonOfficialTypes.map(type => (
                                    <span key={type} className="badge bg-secondary me-2 mb-1">
                                        {type} ({typeAnalysis.typeCount[type]} Pokemon)
                                    </span>
                                ))}
                            </div>
                            <small className="mt-2 d-block">
                                These types exist in Pokemon data but are not official Pokemon types (likely data errors, placeholder values, or special states).
                            </small>
                        </div>
                    )}

                    {/* Extra Types Alert */}
                    {typeAnalysis.extraInFilter.length > 0 && (
                        <div className="alert alert-info mb-4">
                            <h6><i className="bi bi-info-circle me-2"></i>Extra Types in Filter:</h6>
                            <div>
                                {typeAnalysis.extraInFilter.map(type => (
                                    <span key={type} className="badge bg-secondary me-2 mb-1">
                                        {type}
                                    </span>
                                ))}
                            </div>
                            <small className="mt-2 d-block">
                                These types are in the filter but no Pokemon actually have them.
                            </small>
                        </div>
                    )}

                    {/* Type Count Table */}
                    <div className="row">
                        <div className="col-md-6">
                            <h6>Type Distribution (Top 10)</h6>
                            <div className="table-responsive">
                                <table className="table table-sm">
                                    <thead>
                                        <tr>
                                            <th>Type</th>
                                            <th>Pokemon Count</th>
                                            <th>Status</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {Object.entries(typeAnalysis.typeCount)
                                            .sort(([, a], [, b]) => b - a)
                                            .slice(0, 10)
                                            .map(([type, count]) => (
                                                <tr key={type}>
                                                    <td>
                                                        <span className={`badge bg-${typeAnalysis.officialTypes.includes(type.toLowerCase())
                                                                ? (typeAnalysis.pokemonTypes.includes(type) ? 'success' : 'warning')
                                                                : 'secondary'
                                                            }`}>
                                                            {type}
                                                        </span>
                                                    </td>
                                                    <td>{count}</td>
                                                    <td>
                                                        {typeAnalysis.officialTypes.includes(type.toLowerCase()) ? (
                                                            typeAnalysis.pokemonTypes.includes(type) ? (
                                                                <span className="badge bg-success">In Filter</span>
                                                            ) : (
                                                                <span className="badge bg-warning">Official (Missing)</span>
                                                            )
                                                        ) : (
                                                            <span className="badge bg-secondary">Non-Official</span>
                                                        )}
                                                    </td>
                                                </tr>
                                            ))
                                        }
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        <div className="col-md-6">
                            <h6>All Types Found in Data</h6>
                            <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
                                {typeAnalysis.typesInData.map(type => (
                                    <span
                                        key={type}
                                        className={`badge me-2 mb-2 ${typeAnalysis.pokemonTypes.includes(type)
                                                ? 'bg-success'
                                                : 'bg-danger'
                                            }`}
                                    >
                                        {type} ({typeAnalysis.typeCount[type]})
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Pokemon without types */}
                    {typeAnalysis.pokemonWithUnknownTypes.length > 0 && (
                        <div className="mt-4">
                            <div className="alert alert-danger">
                                <h6><i className="bi bi-exclamation-triangle me-2"></i>Pokemon without types:</h6>
                                <small>{typeAnalysis.pokemonWithUnknownTypes.join(', ')}</small>
                            </div>
                        </div>
                    )}

                </div>
            </div>
        </div>
    );
};

export default TypeDebugger;