import React from 'react';
import './EvolutionChain.css';

const EvolutionChain = ({ evolutionChain, pokemon }) => {
    const formatEvolutionChain = (chain) => {
        const evolutions = [];
        let current = chain;
        while (current) {
            evolutions.push({
                name: current.species.name,
                minLevel: current.evolution_details[0]?.min_level || null,
                trigger: current.evolution_details[0]?.trigger?.name || null,
                image: `https://img.pokemondb.net/artwork/large/${current.species.name}.jpg`
            });
            current = current.evolves_to[0];
        }
        return evolutions;
    };

    if (!evolutionChain) return null;

    return (
        <div className="row mb-4">
            <div className="col-12">
                <div className="card shadow-lg">
                    <div className="card-header bg-warning text-dark">
                        <h4 className="mb-0">Evolution Chain</h4>
                    </div>
                    <div className="card-body">
                        <div className="d-flex justify-content-center align-items-center flex-wrap evolution-chain">
                            {formatEvolutionChain(evolutionChain.chain).map((evolution, index) => (
                                <React.Fragment key={evolution.name}>
                                    <div className="text-center mx-3 mb-3">
                                        <div className="border rounded p-3 border-secondary bg-light" style={{ minWidth: '120px' }}>
                                            <img src={evolution.image} alt={evolution.name} style={{ width: '80px', height: '80px', objectFit: 'contain' }} />
                                            <h6 className="text-capitalize mb-2 mt-2">{evolution.name}</h6>
                                            {evolution.minLevel && (
                                                <small className="text-muted">Level {evolution.minLevel}</small>
                                            )}
                                            {evolution.trigger && evolution.trigger !== 'level-up' && (
                                                <small className="text-muted d-block">{evolution.trigger}</small>
                                            )}
                                        </div>
                                    </div>
                                    {index < formatEvolutionChain(evolutionChain.chain).length - 1 && (
                                        <div className="text-center mx-2 evolution-arrow">
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
    );
};

export default EvolutionChain;
