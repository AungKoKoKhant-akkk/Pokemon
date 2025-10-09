import React, { createContext, useContext, useState, useEffect } from 'react';

const FavoritesContext = createContext();

export const useFavorites = () => {
    const context = useContext(FavoritesContext);
    if (!context) {
        throw new Error('useFavorites must be used within a FavoritesProvider');
    }
    return context;
};

export const FavoritesProvider = ({ children }) => {
    const [favorites, setFavorites] = useState([]);
    const [favoritesCount, setFavoritesCount] = useState(0);

    // Load favorites from localStorage on mount
    useEffect(() => {
        const savedFavorites = localStorage.getItem('pokemonFavorites');
        if (savedFavorites) {
            try {
                const parsedFavorites = JSON.parse(savedFavorites);
                setFavorites(parsedFavorites);
                setFavoritesCount(parsedFavorites.length);
            } catch (error) {
                console.error('Error parsing saved favorites:', error);
                localStorage.removeItem('pokemonFavorites');
            }
        }
    }, []);

    // Save favorites to localStorage whenever favorites change
    useEffect(() => {
        localStorage.setItem('pokemonFavorites', JSON.stringify(favorites));
        setFavoritesCount(favorites.length);
    }, [favorites]);

    const addToFavorites = (pokemon) => {
        if (!isFavorite(pokemon.name)) {
            const favoriteData = {
                name: pokemon.name,
                image: pokemon.image,
                type: pokemon.type,
                description: pokemon.description,
                pokemonTypes: pokemon.pokemonTypes || [],
                url: pokemon.url,
                addedAt: new Date().toISOString()
            };
            setFavorites(prev => [...prev, favoriteData]);
            return true; // Added successfully
        }
        return false; // Already in favorites
    };

    const removeFromFavorites = (pokemonName) => {
        setFavorites(prev => prev.filter(fav => fav.name.toLowerCase() !== pokemonName.toLowerCase()));
        return true; // Removed successfully
    };

    const toggleFavorite = (pokemon) => {
        if (isFavorite(pokemon.name)) {
            removeFromFavorites(pokemon.name);
            return { action: 'removed', isFavorite: false };
        } else {
            addToFavorites(pokemon);
            return { action: 'added', isFavorite: true };
        }
    };

    const isFavorite = (pokemonName) => {
        return favorites.some(fav => fav.name.toLowerCase() === pokemonName.toLowerCase());
    };

    const clearAllFavorites = () => {
        setFavorites([]);
        localStorage.removeItem('pokemonFavorites');
    };

    const getFavoriteById = (pokemonName) => {
        return favorites.find(fav => fav.name.toLowerCase() === pokemonName.toLowerCase());
    };

    return (
        <FavoritesContext.Provider value={{
            favorites,
            favoritesCount,
            addToFavorites,
            removeFromFavorites,
            toggleFavorite,
            isFavorite,
            clearAllFavorites,
            getFavoriteById
        }}>
            {children}
        </FavoritesContext.Provider>
    );
};

export default FavoritesContext;