/**
 * Pokemon Image Utilities
 * Robust image fallback system to handle missing Pokemon images
 */

/**
 * Get the best available image URL for a Pokemon with fallbacks
 * @param {Object} pokemon - Pokemon object from API
 * @returns {string} Best available image URL
 */
export const getBestPokemonImage = (pokemon) => {
    if (!pokemon) return null;

    // Priority order for image selection
    const imageSources = [
        // 1. Official artwork (highest quality)
        pokemon.sprites?.other?.['official-artwork']?.front_default,

        // 2. Dream world artwork
        pokemon.sprites?.other?.dream_world?.front_default,

        // 3. Home artwork
        pokemon.sprites?.other?.home?.front_default,

        // 4. Showdown sprites
        pokemon.sprites?.other?.showdown?.front_default,

        // 5. Regular front sprite
        pokemon.sprites?.front_default,

        // 6. Fallback to CDN using ID
        pokemon.id ? `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${pokemon.id}.png` : null,

        // 7. Another CDN fallback
        pokemon.id ? `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemon.id}.png` : null
    ];

    // Return the first non-null, non-empty image
    for (const imageUrl of imageSources) {
        if (imageUrl && imageUrl !== '' && imageUrl !== 'N/A') {
            return imageUrl;
        }
    }

    return null;
};

/**
 * Generate fallback image URLs for error handling
 * @param {Object} pokemon - Pokemon object
 * @returns {Array} Array of fallback URLs
 */
export const getPokemonImageFallbacks = (pokemon) => {
    if (!pokemon?.id) return [];

    return [
        `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${pokemon.id}.png`,
        `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemon.id}.png`,
        `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/home/${pokemon.id}.png`,
        `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/dream-world/${pokemon.id}.svg`
    ];
};

/**
 * Enhanced image validation that also checks URL validity
 * @param {Object} pokemon - Pokemon object
 * @returns {boolean} True if Pokemon has valid image
 */
export const hasValidImage = (pokemon) => {
    const imageUrl = getBestPokemonImage(pokemon);
    return imageUrl && imageUrl !== 'N/A' && imageUrl !== null && imageUrl !== undefined;
};

/**
 * Create optimized image URL with fallback handling
 * @param {Object} pokemon - Pokemon object
 * @returns {string} Optimized image URL
 */
export const getOptimizedImageUrl = (pokemon) => {
    const bestImage = getBestPokemonImage(pokemon);

    // If we have a good image, return it
    if (bestImage) {
        return bestImage;
    }

    // Ultimate fallback - use a placeholder or default Pokemon image
    return 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDIwMCAyMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxjaXJjbGUgY3g9IjEwMCIgY3k9IjEwMCIgcj0iMTAwIiBmaWxsPSIjZjBmMGYwIi8+Cjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBkb21pbmFudC1iYXNlbGluZT0ibWlkZGxlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmaWxsPSIjOTk5IiBmb250LXNpemU9IjE0Ij5Qb2tlbW9uPC90ZXh0Pgo8L3N2Zz4K';
};