import React, { useState } from 'react';
import { getPokemonTypeColor } from '../../utils/pokemonUtils';
import { useTheme } from '../../context/ThemeContext';
import { useLanguage } from '../../context/LanguageContext';
import styles from './TypeFilter.module.css';

const TypeFilter = ({
    types,
    selectedType,
    onTypeFilter,
    pokemon,
    filteredPokemon,
    searchTerm,
    favoritesCount,
    comparisonCount
}) => {
    const [isCollapsed, setIsCollapsed] = useState(false);
    const { isDark } = useTheme();
    const { t, getTypeName } = useLanguage();

    return (
        <div className="row mb-4">
            <div className="col-12">
                <div className={`card shadow-sm ${isDark ? 'bg-dark text-light' : 'bg-white'}`}>
                    <div className="card-header bg-primary text-white">
                        <div className="d-flex justify-content-between align-items-center">
                            <h5 className="mb-0">
                                <i className="bi bi-funnel me-2"></i>
                                {t('search_type_filter') || 'Filter by Type'}
                            </h5>
                            <button
                                className="btn btn-link text-white p-0 d-md-none"
                                onClick={() => setIsCollapsed(!isCollapsed)}
                                aria-expanded={!isCollapsed}
                                aria-controls="type-filter-content"
                            >
                                <i className={`bi ${isCollapsed ? 'bi-chevron-down' : 'bi-chevron-up'}`}></i>
                            </button>
                        </div>
                    </div>

                    <div className={`card-body ${isCollapsed ? 'd-none d-md-block' : ''}`} id="type-filter-content">
                        {/* Type Buttons */}
                        <div className={`${styles.typeGrid} d-flex flex-wrap gap-2`}>
                            {types.map((type) => {
                                const isSelected = selectedType === type;
                                const typeColor = type === 'All' ? '#6c757d' : getPokemonTypeColor(type, 'modern');
                                const pokemonCount = type === 'All'
                                    ? pokemon.length
                                    : pokemon.filter(p =>
                                        p.pokemonTypes && p.pokemonTypes.some(pokemonType =>
                                            pokemonType.toLowerCase() === type.toLowerCase()
                                        )
                                    ).length;

                                return (
                                    <button
                                        key={type}
                                        className={`btn btn-sm ${styles.typeButton} ${isSelected ? styles.typeButtonActive : styles.typeButtonInactive
                                            }`}
                                        style={{
                                            '--type-color': typeColor,
                                            backgroundColor: isSelected ? typeColor : 'transparent',
                                            borderColor: typeColor,
                                            color: isSelected ? 'white' : typeColor,
                                        }}
                                        onClick={() => onTypeFilter(type)}
                                    >
                                        <span className={styles.typeName}>
                                            {type === 'All' ? (t('search_all_types') || 'All') : getTypeName(type)}
                                        </span>
                                        <span className={`ms-1 badge ${styles.typeBadge}`}>
                                            {pokemonCount}
                                        </span>
                                    </button>
                                );
                            })}
                        </div>

                        {/* Filter Results Info */}
                        <div className={`mt-3 ${styles.filterInfo}`}>
                            <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center gap-2">
                                <div className="d-flex flex-wrap align-items-center gap-2">
                                    <small className="text-muted">
                                        <i className="bi bi-info-circle me-1"></i>
                                        {t('grid_showing')} <strong>{filteredPokemon.length}</strong> {t('grid_of')} <strong>{pokemon.length}</strong> {t('label_pokemon')}
                                    </small>

                                    {/* Active Filters */}
                                    <div className="d-flex flex-wrap gap-1">
                                        {searchTerm && (
                                            <span className="badge bg-info">
                                                <i className="bi bi-search me-1"></i>
                                                "{searchTerm}"
                                            </span>
                                        )}
                                        {selectedType !== 'All' && (
                                            <span className="badge bg-secondary">
                                                <i className="bi bi-funnel me-1"></i>
                                                {getTypeName(selectedType)}
                                            </span>
                                        )}
                                        {selectedType === 'All' && (
                                            <span className="badge bg-secondary">
                                                <i className="bi bi-funnel me-1"></i>
                                                {t('search_all_types') || 'All'}
                                            </span>
                                        )}
                                    </div>
                                </div>

                                {/* Counters */}
                                <div className="d-flex gap-3">
                                    <small className="text-muted">
                                        <i className="bi bi-heart-fill text-danger me-1"></i>
                                        <span className="badge bg-danger">{favoritesCount}</span>
                                        <span className="ms-1 d-none d-sm-inline">{t('nav_favorites')}</span>
                                    </small>
                                    <small className="text-muted">
                                        <i className="bi bi-bar-chart-fill text-info me-1"></i>
                                        <span className="badge bg-info">{comparisonCount}</span>
                                        <span className="ms-1 d-none d-sm-inline">{t('nav_compare')}</span>
                                    </small>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TypeFilter;