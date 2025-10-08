// Enhanced Pokemon Card Design Suggestions
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useFavorites } from '../../context/FavoritesContext';
import { useComparison } from '../../context/ComparisonContext';
import { useTheme } from '../../context/ThemeContext';
import { getPokemonImageFallbacks } from '../../utils/imageUtils';
import styles from './PokemonCardEnhanced.module.css';

const PokemonCardEnhanced = ({ pokemon, index, feedback }) => {
    const navigate = useNavigate();
    const { isDark } = useTheme();
    const { isFavorite, addToFavorites, removeFromFavorites } = useFavorites();
    const {
        addToComparison,
        removeFromComparison,
        isInComparison,
        canAddMore
    } = useComparison();

    // Pokemon type colors for better visual distinction
    const getTypeColor = (type) => {
        const typeColors = {
            fire: '#FF6B6B',
            water: '#4ECDC4',
            grass: '#45B7D1',
            electric: '#F9CA24',
            psychic: '#A29BFE',
            ice: '#74B9FF',
            dragon: '#6C5CE7',
            fairy: '#FD79A8',
            poison: '#6C5CE7',
            ground: '#F39C12',
            flying: '#74B9FF',
            bug: '#26AE60',
            rock: '#95A5A6',
            ghost: '#A29BFE',
            steel: '#95A5A6',
            fighting: '#E17055',
            normal: '#DDD',
            dark: '#2D3436'
        };
        return typeColors[type?.toLowerCase()] || '#95A5A6';
    };

    const primaryType = pokemon.types?.[0] || pokemon.type;

    return (
        <div className="col-lg-3 col-md-4 col-sm-6" key={index}>
            <div
                className={`card h-100 shadow-sm ${styles.pokemonCard} ${isDark ? 'bg-dark text-light' : 'bg-white'}`}
                style={{
                    '--primary-type-color': getTypeColor(primaryType),
                    '--primary-type-color-light': getTypeColor(primaryType) + '20'
                }}
            >
                {/* Enhanced Header with Pokemon Number */}
                <div className={styles.cardHeader}>
                    <span className={styles.pokemonNumber}>
                        #{pokemon.id || pokemon.url?.split('/').slice(-2)[0]?.padStart(3, '0')}
                    </span>
                    <div className={styles.quickActions}>
                        <button
                            className={`btn btn-sm ${styles.quickFavorite} ${isFavorite(pokemon.name) ? styles.favorited : ''
                                }`}
                            onClick={(e) => handleFavoriteToggle(pokemon, e)}
                            title={isFavorite(pokemon.name) ? 'Remove from favorites' : 'Add to favorites'}
                        >
                            <i className={`bi ${isFavorite(pokemon.name) ? 'bi-heart-fill' : 'bi-heart'}`}></i>
                        </button>
                    </div>
                </div>

                {/* Enhanced Image Container with Type-based Background */}
                <div className={styles.imageContainer}>
                    <div className={styles.imageBackground}></div>
                    <img
                        src={pokemon.image}
                        className={`card-img-top ${styles.cardImage}`}
                        alt={`${pokemon.name} sprite`}
                        onError={handleImageError}
                    />
                </div>

                <div className={`card-body d-flex flex-column ${styles.cardBody}`}>
                    {/* Enhanced Name with Type Indicator */}
                    <div className={styles.nameSection}>
                        <h5 className={`card-title text-capitalize ${styles.cardName}`}>
                            {pokemon.name}
                        </h5>
                        {pokemon.types && (
                            <div className={styles.typeBadges}>
                                {pokemon.types.slice(0, 2).map(type => (
                                    <span
                                        key={type}
                                        className={`badge ${styles.typeBadge}`}
                                        style={{ backgroundColor: getTypeColor(type) }}
                                    >
                                        {type}
                                    </span>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Enhanced Description */}
                    {pokemon.description && (
                        <p className={`card-text ${styles.cardDescription}`}>
                            {pokemon.description}
                        </p>
                    )}

                    {/* Stats Preview (if available) */}
                    {pokemon.stats && (
                        <div className={styles.statsPreview}>
                            <div className={styles.statItem}>
                                <span className={styles.statLabel}>HP</span>
                                <div className={styles.statBar}>
                                    <div
                                        className={styles.statFill}
                                        style={{ width: `${(pokemon.stats.hp / 255) * 100}%` }}
                                    ></div>
                                </div>
                                <span className={styles.statValue}>{pokemon.stats.hp}</span>
                            </div>
                            <div className={styles.statItem}>
                                <span className={styles.statLabel}>ATK</span>
                                <div className={styles.statBar}>
                                    <div
                                        className={styles.statFill}
                                        style={{ width: `${(pokemon.stats.attack / 255) * 100}%` }}
                                    ></div>
                                </div>
                                <span className={styles.statValue}>{pokemon.stats.attack}</span>
                            </div>
                        </div>
                    )}

                    {/* Generation with Icon */}
                    {pokemon.generations && (
                        <div className={styles.generationInfo}>
                            <i className="bi bi-collection me-1"></i>
                            <span>Generation {pokemon.generations}</span>
                        </div>
                    )}
                </div>

                {/* Enhanced Footer with Better Button Layout */}
                <div className={`card-footer bg-transparent border-top-0 pt-0 ${styles.cardFooter}`}>
                    <div className="d-flex flex-column gap-2">
                        {/* Primary Action */}
                        <button
                            className={`btn btn-primary btn-sm w-100 ${styles.primaryButton}`}
                            onClick={() => navigate(`/pokemon/${pokemon.name.toLowerCase()}`)}
                        >
                            <i className="bi bi-eye me-2"></i>
                            View Details
                        </button>

                        {/* Secondary Action - Compare Only */}
                        <button
                            className={`btn btn-sm w-100 ${styles.compareButton} ${isInComparison(pokemon.name)
                                    ? styles.comparing
                                    : canAddMore()
                                        ? styles.canCompare
                                        : styles.compareDisabled
                                }`}
                            onClick={(e) => handleComparisonToggle(pokemon, e)}
                            title={
                                isInComparison(pokemon.name)
                                    ? 'Remove from comparison'
                                    : canAddMore()
                                        ? 'Add to comparison'
                                        : 'Comparison limit reached'
                            }
                            disabled={!isInComparison(pokemon.name) && !canAddMore()}
                        >
                            <i className={`bi ${isInComparison(pokemon.name) ? 'bi-bar-chart-fill' : 'bi-bar-chart'
                                } me-2`}></i>
                            {isInComparison(pokemon.name) ? 'Remove from Comparison' : 'Add to Comparison'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PokemonCardEnhanced;