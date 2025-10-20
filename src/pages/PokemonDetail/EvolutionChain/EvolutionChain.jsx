import React, { useEffect, useMemo, useState } from 'react';
import './EvolutionChain.css';
import { useLanguage } from '../../../context/LanguageContext';
import { usePokemonData } from '../../../context/PokemonDataContext';

const EvolutionChain = ({ evolutionChain, pokemon }) => {
    const { language, t } = useLanguage();
    const { getPokemonSpecies } = usePokemonData();

    const evolutions = useMemo(() => {
        if (!evolutionChain) return [];
        const list = [];
        let current = evolutionChain.chain;
        while (current) {
            list.push({
                name: current.species.name,
                minLevel: current.evolution_details[0]?.min_level || null,
                trigger: current.evolution_details[0]?.trigger?.name || null,
                image: `https://img.pokemondb.net/artwork/large/${current.species.name}.jpg`
            });
            current = current.evolves_to[0];
        }
        return list;
    }, [evolutionChain]);

    // Map of english species name -> localized display name
    const [nameMap, setNameMap] = useState({});

    useEffect(() => {
        let cancelled = false;
        const loadNames = async () => {
            const entries = await Promise.all(
                evolutions.map(async (evo) => {
                    try {
                        const species = await getPokemonSpecies(evo.name);
                        const jp = species?.names?.find(n => n.language?.name === language)?.name;
                        return [evo.name, jp];
                    } catch {
                        return [evo.name, null];
                    }
                })
            );
            if (!cancelled) {
                const map = Object.fromEntries(entries);
                setNameMap(map);
            }
        };
        if (evolutions.length) loadNames();
        return () => { cancelled = true; };
    }, [evolutions, language, getPokemonSpecies]);

    if (!evolutionChain) return null;

    const formatTrigger = (trigger) => {
        if (!trigger) return null;
        const normalized = trigger.replace(/-/g, ' ');
        if (language === 'ja') {
            const dict = { 'level up': 'レベルアップ', 'trade': '交換', 'use item': '道具使用' };
            return dict[normalized] || normalized;
        }
        return normalized;
    };

    const levelLabel = language === 'ja' ? 'レベル' : 'Level';

    return (
        <div className="row mb-4">
            <div className="col-12">
                <div className="card shadow-lg">
                    <div className="card-header bg-warning text-dark">
                        <h4 className="mb-0">{t('detail_evolution_chain') || 'Evolution Chain'}</h4>
                    </div>
                    <div className="card-body">
                        <div className="d-flex justify-content-center align-items-center flex-wrap evolution-chain">
                            {evolutions.map((evolution, index) => (
                                <React.Fragment key={evolution.name}>
                                    <div className="text-center mx-3 mb-3">
                                        <div className="border rounded p-3 border-secondary bg-light" style={{ minWidth: '120px' }}>
                                            <img src={evolution.image} alt={nameMap[evolution.name] || evolution.name} style={{ width: '80px', height: '80px', objectFit: 'contain' }} />
                                            <h6 className="text-capitalize mb-2 mt-2">{nameMap[evolution.name] || evolution.name}</h6>
                                            {evolution.minLevel && (
                                                <small className="text-muted">{levelLabel} {evolution.minLevel}</small>
                                            )}
                                            {evolution.trigger && evolution.trigger !== 'level-up' && (
                                                <small className="text-muted d-block">{formatTrigger(evolution.trigger)}</small>
                                            )}
                                        </div>
                                    </div>
                                    {index < evolutions.length - 1 && (
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
