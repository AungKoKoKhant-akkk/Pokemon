import React, { useState } from 'react';
import {
    cleanupLocalStorage,
    getLocalStorageStats,
    clearPokemonLocalStorage,
    validateLocalStorageValue
} from '../../utils/localStorageUtils';

const LocalStorageDebugger = () => {
    const [stats, setStats] = useState(null);
    const [cleanupResults, setCleanupResults] = useState(null);
    const [validationKey, setValidationKey] = useState('pokemon-app-theme');
    const [validationResult, setValidationResult] = useState(null);

    const handleGetStats = () => {
        const storageStats = getLocalStorageStats();
        setStats(storageStats);
    };

    const handleCleanup = () => {
        const results = cleanupLocalStorage();
        setCleanupResults(results);
        console.log('LocalStorage cleanup results:', results);
    };

    const handleClearPokemonData = () => {
        const results = clearPokemonLocalStorage();
        console.log('Cleared Pokemon localStorage:', results);
        handleGetStats(); // Refresh stats
    };

    const handleValidateKey = () => {
        const result = validateLocalStorageValue(validationKey);
        setValidationResult(result);
    };

    return (
        <div className="container mt-4">
            <div className="card">
                <div className="card-header">
                    <h5><i className="bi bi-tools me-2"></i>LocalStorage Debugger</h5>
                    <small className="text-muted">Debug and manage localStorage for Pokemon app</small>
                </div>
                <div className="card-body">

                    {/* Quick Actions */}
                    <div className="row mb-4">
                        <div className="col-md-4">
                            <button
                                className="btn btn-primary w-100"
                                onClick={handleGetStats}
                            >
                                <i className="bi bi-bar-chart me-2"></i>
                                Get Statistics
                            </button>
                        </div>
                        <div className="col-md-4">
                            <button
                                className="btn btn-warning w-100"
                                onClick={handleCleanup}
                            >
                                <i className="bi bi-arrow-clockwise me-2"></i>
                                Cleanup Storage
                            </button>
                        </div>
                        <div className="col-md-4">
                            <button
                                className="btn btn-danger w-100"
                                onClick={handleClearPokemonData}
                            >
                                <i className="bi bi-trash me-2"></i>
                                Clear Pokemon Data
                            </button>
                        </div>
                    </div>

                    {/* Key Validation */}
                    <div className="mb-4">
                        <h6>Validate Specific Key</h6>
                        <div className="input-group">
                            <input
                                type="text"
                                className="form-control"
                                value={validationKey}
                                onChange={(e) => setValidationKey(e.target.value)}
                                placeholder="Enter localStorage key"
                            />
                            <button
                                className="btn btn-outline-secondary"
                                onClick={handleValidateKey}
                            >
                                Validate
                            </button>
                        </div>
                    </div>

                    {/* Validation Results */}
                    {validationResult && (
                        <div className="mb-4">
                            <h6>Validation Result</h6>
                            <div className={`alert ${validationResult.valid ? 'alert-success' : 'alert-danger'}`}>
                                <strong>Key:</strong> {validationKey}<br />
                                <strong>Status:</strong> {validationResult.status}<br />
                                {validationResult.error && (
                                    <>
                                        <strong>Error:</strong> {validationResult.error}<br />
                                        <strong>Value:</strong> <code>{validationResult.value}</code>
                                    </>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Cleanup Results */}
                    {cleanupResults && (
                        <div className="mb-4">
                            <h6>Cleanup Results</h6>
                            <div className="alert alert-info">
                                <strong>Cleaned:</strong> {cleanupResults.cleaned} items<br />
                                <strong>Errors:</strong> {cleanupResults.errors} items
                            </div>
                            {cleanupResults.details.length > 0 && (
                                <div className="table-responsive">
                                    <table className="table table-sm">
                                        <thead>
                                            <tr>
                                                <th>Key</th>
                                                <th>Status</th>
                                                <th>Action</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {cleanupResults.details.map((detail, index) => (
                                                <tr key={index}>
                                                    <td><code>{detail.key}</code></td>
                                                    <td>
                                                        <span className={`badge bg-${detail.status === 'ok' ? 'success' :
                                                                detail.status === 'fixed' ? 'warning' : 'danger'
                                                            }`}>
                                                            {detail.status}
                                                        </span>
                                                    </td>
                                                    <td>{detail.action}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Statistics */}
                    {stats && (
                        <div className="mb-4">
                            <h6>Storage Statistics</h6>
                            <div className="row">
                                <div className="col-md-6">
                                    <div className="card bg-light">
                                        <div className="card-body">
                                            <h6 className="card-title">Overview</h6>
                                            <p className="card-text">
                                                <strong>Total Keys:</strong> {stats.totalKeys}<br />
                                                <strong>Pokemon Keys:</strong> {stats.pokemonKeys}<br />
                                                <strong>Total Size:</strong> {stats.totalSizeKB} KB
                                            </p>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-md-6">
                                    <div className="table-responsive">
                                        <table className="table table-sm">
                                            <thead>
                                                <tr>
                                                    <th>Key</th>
                                                    <th>Size (KB)</th>
                                                    <th>Type</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {stats.details.slice(0, 10).map((detail, index) => (
                                                    <tr key={index}>
                                                        <td>
                                                            <code className="small">
                                                                {detail.key.length > 20 ?
                                                                    detail.key.substring(0, 20) + '...' :
                                                                    detail.key
                                                                }
                                                            </code>
                                                        </td>
                                                        <td>{detail.sizeKB}</td>
                                                        <td>
                                                            {detail.isPokemonKey ?
                                                                <span className="badge bg-primary">Pokemon</span> :
                                                                <span className="badge bg-secondary">Other</span>
                                                            }
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                </div>
            </div>
        </div>
    );
};

export default LocalStorageDebugger;