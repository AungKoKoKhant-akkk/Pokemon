import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useFavorites } from '../../context/FavoritesContext';
import { useTheme } from '../../context/ThemeContext';
import { useLanguage } from '../../context/LanguageContext';
import { getBestPokemonImage } from '../../utils/imageUtils';
import { getPokemonTypeColor } from '../../utils/pokemonUtils';
import './Favorites.css';

const Favorites = () => {
    const { favorites, clearAllFavorites, removeFromFavorites, favoritesCount } = useFavorites();
    const { isDark } = useTheme();
    const { t, getTypeName, language } = useLanguage();
    const [sortBy, setSortBy] = useState('recent'); // recent, name, type
    const [showConfirmClear, setShowConfirmClear] = useState(false);

    // Helper function to get localized Pokemon name
    const getLocalizedPokemonName = (pokemon) => {
        if (!pokemon.names || pokemon.names.length === 0) {
            return pokemon.name; // Fallback to English name
        }

        const nameEntry = pokemon.names.find(n => n.language.name === language);
        return nameEntry ? nameEntry.name : pokemon.name;
    };

    // Sort favorites based on selected option
    const sortedFavorites = [...favorites].sort((a, b) => {
        switch (sortBy) {
            case 'name':
                return a.name.localeCompare(b.name);
            case 'type': {
                const aType = a.pokemonTypes?.[0] || 'normal';
                const bType = b.pokemonTypes?.[0] || 'normal';
                return aType.localeCompare(bType);
            }
            case 'recent':
            default:
                return new Date(b.addedAt) - new Date(a.addedAt);
        }
    });

    const handleClearAll = () => {
        clearAllFavorites();
        setShowConfirmClear(false);
    };

    const handleRemoveFavorite = (pokemonName) => {
        removeFromFavorites(pokemonName);
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        });
    };

    return (
        <div className="container favorites-page">
            <div className="row">
                <div className="col-12">
                    {/* Page Header */}
                    <div className="favorites-header text-center py-4">
                        <h1 className="favorites-title">
                            <i className="bi bi-heart-fill text-danger me-3"></i>
                            {t('favorites_title')}
                        </h1>
                        <p className="favorites-subtitle text-muted">
                            {favoritesCount === 0
                                ? t('favorites_empty')
                                : `${t('favorites_title')}: ${favoritesCount}`
                            }
                        </p>
                    </div>

                    {/* Empty State */}
                    {favorites.length === 0 ? (
                        <div className="empty-favorites text-center py-5">
                            <i className="bi bi-heart display-1 text-muted mb-4"></i>
                            <h3 className="text-muted mb-3">{t('msg_no_favorites')}</h3>
                            <p className="text-muted mb-4">
                                {t('msg_add_favorites')}
                            </p>
                            <Link to="/" className="btn btn-primary btn-lg">
                                <i className="bi bi-house-door me-2"></i>
                                {t('nav_home')}
                            </Link>
                        </div>
                    ) : (
                        <>
                            {/* Controls */}
                            <div className="favorites-controls d-flex justify-content-between align-items-center mb-4">
                                <div className="sort-controls">
                                    <label className="me-2">{t('search_type_filter')}:</label>
                                    <select
                                        className="form-select form-select-sm d-inline-block w-auto"
                                        value={sortBy}
                                        onChange={(e) => setSortBy(e.target.value)}
                                    >
                                        <option value="recent">{t('favorites_sort_recent') || 'Recently Added'}</option>
                                        <option value="name">{t('favorites_sort_name') || 'Name (A-Z)'}</option>
                                        <option value="type">{t('favorites_sort_type') || 'Type'}</option>
                                    </select>
                                </div>

                                <button
                                    className="btn btn-outline-danger btn-sm"
                                    onClick={() => setShowConfirmClear(true)}
                                >
                                    <i className="bi bi-trash me-2"></i>
                                    {t('action_clear_all')}
                                </button>
                            </div>

                            {/* Favorites Grid */}
                            <div className="row">
                                {sortedFavorites.map((pokemon) => (
                                    <div key={pokemon.name} className="col-lg-3 col-md-4 col-sm-6 col-12 mb-4">
                                        <div className={`card favorite-card h-100 ${isDark ? 'bg-dark text-light' : ''}`}>
                                            {/* Remove Button */}
                                            <button
                                                className="btn btn-sm btn-outline-danger position-absolute top-0 end-0 m-2 z-3"
                                                onClick={() => handleRemoveFavorite(pokemon.name)}
                                                title="Remove from favorites"
                                            >
                                                <i className="bi bi-x-lg"></i>
                                            </button>

                                            {/* Pokemon Image */}
                                            <div className="card-img-container text-center p-3">
                                                <img
                                                    src={getBestPokemonImage(pokemon) || pokemon.image}
                                                    alt={pokemon.name}
                                                    className="favorite-pokemon-image"
                                                    style={{
                                                        width: '120px',
                                                        height: '120px',
                                                        objectFit: 'contain'
                                                    }}
                                                    onError={(e) => {
                                                        e.target.src = 'https://via.placeholder.com/120x120?text=No+Image';
                                                    }}
                                                />
                                            </div>

                                            <div className="card-body">
                                                {/* Pokemon Name */}
                                                <h5 className="card-title text-center mb-2">
                                                    {getLocalizedPokemonName(pokemon)}
                                                </h5>

                                                {/* Pokemon Types */}
                                                <div className="pokemon-types text-center mb-2">
                                                    {pokemon.pokemonTypes?.map((type) => (
                                                        <span
                                                            key={type}
                                                            className="badge me-1 mb-1"
                                                            style={{
                                                                backgroundColor: getPokemonTypeColor(type),
                                                                color: 'white',
                                                                fontSize: '0.75em'
                                                            }}
                                                        >
                                                            {getTypeName(type)}
                                                        </span>
                                                    ))}
                                                </div>

                                                {/* Added Date */}
                                                <div className="text-center text-muted mb-3">
                                                    <small>
                                                        <i className="bi bi-calendar me-1"></i>
                                                        {t('favorites_added') || 'Added'} {formatDate(pokemon.addedAt)}
                                                    </small>
                                                </div>

                                                {/* View Details Button */}
                                                <div className="text-center">
                                                    <Link
                                                        to={`/pokemon/${pokemon.name}`}
                                                        className="btn btn-primary btn-sm"
                                                    >
                                                        <i className="bi bi-eye me-2"></i>
                                                        {t('favorites_view_details') || 'View Details'}
                                                    </Link>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </>
                    )}

                    {/* Clear All Confirmation Modal */}
                    {showConfirmClear && (
                        <div className="modal fade show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
                            <div className="modal-dialog modal-dialog-centered">
                                <div className={`modal-content ${isDark ? 'bg-dark text-light' : ''}`}>
                                    <div className="modal-header">
                                        <h5 className="modal-title">
                                            <i className="bi bi-exclamation-triangle text-warning me-2"></i>
                                            {t('action_clear_all')} {t('nav_favorites')}
                                        </h5>
                                        <button
                                            type="button"
                                            className="btn-close"
                                            onClick={() => setShowConfirmClear(false)}
                                        ></button>
                                    </div>
                                    <div className="modal-body">
                                        <p>{t('favorites_confirm_clear') || `Are you sure you want to remove all ${favoritesCount} Pokemon from your favorites?`}</p>
                                        <p className="text-muted mb-0">{t('favorites_cannot_undo') || 'This action cannot be undone.'}</p>
                                    </div>
                                    <div className="modal-footer">
                                        <button
                                            type="button"
                                            className="btn btn-secondary"
                                            onClick={() => setShowConfirmClear(false)}
                                        >
                                            {t('favorites_cancel') || 'Cancel'}
                                        </button>
                                        <button
                                            type="button"
                                            className="btn btn-danger"
                                            onClick={handleClearAll}
                                        >
                                            <i className="bi bi-trash me-2"></i>
                                            {t('action_clear_all')}
                                        </button>
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

export default Favorites;