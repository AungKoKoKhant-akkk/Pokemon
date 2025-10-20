import React from 'react';
import { useNavigate } from 'react-router-dom';

// Context imports
import { useFavorites } from '../../context/FavoritesContext';
import { useComparison } from '../../context/ComparisonContext';
import { useTheme } from '../../context/ThemeContext';
import { useLanguage } from '../../context/LanguageContext';

// Utils
import { getPokemonImageFallbacks } from '../../utils';

// Styles
import styles from './PokemonCard.module.css';

const PokemonCard = ({ pokemon, index, feedback }) => {
    const navigate = useNavigate();
    const { isDark } = useTheme();
    const { language, t, getPokemonName, getTypeName } = useLanguage();
    const { isFavorite, addToFavorites, removeFromFavorites } = useFavorites();
    const {
        addToComparison,
        removeFromComparison,
        isInComparison,
        canAddMore
    } = useComparison();

    // Helper function to get localized Pokemon name
    const getLocalizedPokemonName = (pokemon) => {
        if (!pokemon.names || pokemon.names.length === 0) {
            return pokemon.name; // Fallback to English name
        }

        const nameEntry = pokemon.names.find(n => n.language.name === language);
        return nameEntry ? nameEntry.name : pokemon.name;
    };

    const handleFavoriteToggle = (pokemon, e) => {
        e.preventDefault();
        e.stopPropagation();

        if (isFavorite(pokemon.name)) {
            removeFromFavorites(pokemon.name);
            feedback?.favorite?.showFeedback(`${getLocalizedPokemonName(pokemon)} ${t('msg_removed_from_favorites')}`, 'removed');
        } else {
            addToFavorites(pokemon);
            feedback?.favorite?.showFeedback(`${getLocalizedPokemonName(pokemon)} ${t('msg_added_to_favorites')} ❤️`, 'added');
        }
    };

    const handleComparisonToggle = (pokemon, e) => {
        e.preventDefault();
        e.stopPropagation();

        let result;
        if (isInComparison(pokemon.name)) {
            result = removeFromComparison(pokemon.name);
        } else if (canAddMore()) {
            result = addToComparison(pokemon);
        }

        // Show feedback message using the feedback system
        if (result) {
            const feedbackType = result.success ? 'success' : 'error';
            feedback?.comparison?.showFeedback(result.message, feedbackType);
        }
    };

    const handleImageError = (e) => {
        const fallbacks = getPokemonImageFallbacks({ id: pokemon.url.split('/').slice(-2)[0] });
        const currentSrc = e.target.src;
        const nextFallback = fallbacks.find(url => url !== currentSrc);

        if (nextFallback) {
            e.target.src = nextFallback;
        } else {
            e.target.style.display = 'none';
        }
    };

    return (
        <div className="col-lg-3 col-md-4 col-sm-6" key={index}>
            <div className={`card h-100 shadow-sm ${styles.pokemonCard} ${isDark ? 'bg-dark text-light' : 'bg-white'}`}>
                <div className={styles.imageContainer}>
                    <img
                        src={pokemon.image}
                        className={`card-img-top ${styles.cardImage}`}
                        alt={`${pokemon.name} sprite`}
                        onError={handleImageError}
                    />
                </div>

                <div className={`card-body d-flex flex-column ${styles.cardBody}`}>
                    {/* Pokemon Number & Name */}
                    <div className={styles.headerInfo}>
                        {pokemon.id && (
                            <span className={styles.pokemonNumber}>
                                #{String(pokemon.id).padStart(3, '0')}
                            </span>
                        )}
                        <h5 className={`card-title text-capitalize ${styles.cardName}`}>
                            {getLocalizedPokemonName(pokemon)}
                        </h5>
                    </div>

                    {/* Type Badges */}
                    {(pokemon.pokemonTypes || pokemon.type) && (
                        <div className={styles.typeBadges}>
                            {pokemon.pokemonTypes ? (
                                pokemon.pokemonTypes.map(type => (
                                    <span key={type} className={`badge ${styles.typeBadge} ${styles[`type${type.charAt(0).toUpperCase() + type.slice(1)}`]}`}>
                                        {getTypeName(type)}
                                    </span>
                                ))
                            ) : (
                                <span className={`badge ${styles.typeBadge}`}>
                                    {pokemon.type.replace('Type: ', '')}
                                </span>
                            )}
                        </div>
                    )}

                    {/* Description */}
                    {pokemon.description && (
                        <p className={`card-text ${styles.cardDescription}`}>
                            {pokemon.description}
                        </p>
                    )}

                    {/* Quick Stats Preview */}
                    {(pokemon.height || pokemon.weight) && (
                        <div className={styles.quickStats}>
                            {pokemon.height && (
                                <div className={styles.statItem}>
                                    <i className="bi bi-arrows-vertical me-1"></i>
                                    <span>{(pokemon.height / 10).toFixed(1)}m</span>
                                </div>
                            )}
                            {pokemon.weight && (
                                <div className={styles.statItem}>
                                    <i className="bi bi-speedometer me-1"></i>
                                    <span>{(pokemon.weight / 10).toFixed(1)}kg</span>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Base Experience */}
                    {pokemon.base_experience && (
                        <div className={styles.abilityInfo}>
                            <small className="text-muted">
                                <i className="bi bi-star me-1"></i>
                                {pokemon.base_experience} XP
                            </small>
                        </div>
                    )}
                </div>

                <div className={`card-footer bg-transparent border-top-0 pt-0 ${styles.cardFooter}`}>
                    <div className="d-flex flex-column gap-2">
                        {/* Primary Action */}
                        <button
                            className={`btn btn-primary btn-sm w-100 mt-2 ${styles.primaryButton}`}
                            onClick={() => navigate(`/pokemon/${pokemon.name.toLowerCase()}`)}
                        >
                            <i className="bi bi-eye me-2"></i>
                            {t('favorites_view_details')}
                        </button>

                        {/* Secondary Actions */}
                        <div className="d-flex gap-2">
                            <button
                                className={`btn btn-sm flex-fill ${styles.secondaryButton} ${isInComparison(pokemon.name)
                                    ? 'btn-warning'
                                    : canAddMore()
                                        ? 'btn-outline-info'
                                        : 'btn-outline-secondary'
                                    }`}
                                onClick={(e) => handleComparisonToggle(pokemon, e)}
                                title={
                                    isInComparison(pokemon.name)
                                        ? t('action_remove_from_comparison')
                                        : canAddMore()
                                            ? t('action_add_to_comparison')
                                            : t('msg_comparison_limit_reached')
                                }
                                disabled={!isInComparison(pokemon.name) && !canAddMore()}
                            >
                                <i className={`bi ${isInComparison(pokemon.name)
                                    ? 'bi-bar-chart-fill'
                                    : 'bi-bar-chart'
                                    }`}></i>
                                <span className={`d-none d-md-inline ms-1 ${styles.buttonText}`}>
                                    {t('nav_compare')}
                                </span>
                            </button>

                            <button
                                className={`btn btn-sm flex-fill ${styles.secondaryButton} ${isFavorite(pokemon.name)
                                    ? 'btn-danger'
                                    : 'btn-outline-secondary'
                                    }`}
                                onClick={(e) => handleFavoriteToggle(pokemon, e)}
                                title={isFavorite(pokemon.name) ? t('action_remove_from_favorites') : t('action_add_to_favorites')}
                            >
                                <i className={`bi ${isFavorite(pokemon.name)
                                    ? 'bi-heart-fill'
                                    : 'bi-heart'
                                    }`}></i>
                                <span className={`d-none d-md-inline ms-1 ${styles.buttonText}`}>
                                    {t('nav_favorites')}
                                </span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PokemonCard;