/**
 * Pokemon Utilities - Centralized helper functions
 * Eliminates duplicate code across components for Pokemon-specific operations
 */

/**
 * Pokemon Type Color Schemes
 * Different components may need different color schemes for type badges
 */
export const POKEMON_TYPE_COLORS = {
    // Standard Pokemon type colors (most commonly used)
    standard: {
        normal: '#A8A878',
        fire: '#F08030',
        water: '#6890F0',
        electric: '#F8D030',
        grass: '#78C850',
        ice: '#98D8D8',
        fighting: '#C03028',
        poison: '#A040A0',
        ground: '#E0C068',
        flying: '#A890F0',
        psychic: '#F85888',
        bug: '#A8B820',
        rock: '#B8A038',
        ghost: '#705898',
        dragon: '#7038F8',
        dark: '#705848',
        steel: '#B8B8D0',
        fairy: '#EE99AC'
    },

    // Modern/vibrant colors (for detail pages)
    modern: {
        normal: '#D2B48C',
        fire: '#FF6B6B',
        water: '#4ECDC4',
        grass: '#45B7D1',
        electric: '#FFA07A',
        psychic: '#DDA0DD',
        ice: '#87CEEB',
        dragon: '#9370DB',
        dark: '#696969',
        fighting: '#CD5C5C',
        poison: '#9932CC',
        ground: '#DAA520',
        flying: '#87CEFA',
        bug: '#32CD32',
        rock: '#A0522D',
        ghost: '#4B0082',
        steel: '#778899',
        fairy: '#FFB6C1'
    }
};

/**
 * Pokemon Stat Colors
 * Consistent coloring for Pokemon stats across all components
 */
export const POKEMON_STAT_COLORS = {
    hp: '#FF5959',
    attack: '#F5AC78',
    defense: '#FAE078',
    'special-attack': '#9DB7F5',
    'special-defense': '#A7DB8D',
    speed: '#FA92B2'
};

/**
 * Get Pokemon type color
 * @param {string} type - Pokemon type name
 * @param {string} scheme - Color scheme to use ('standard' or 'modern')
 * @returns {string} Hex color code
 */
export const getPokemonTypeColor = (type, scheme = 'standard') => {
    const colors = POKEMON_TYPE_COLORS[scheme] || POKEMON_TYPE_COLORS.standard;
    return colors[type?.toLowerCase()] || '#68A090';
};

/**
 * Get Pokemon stat color
 * @param {string} statName - Stat name (hp, attack, defense, etc.)
 * @returns {string} Hex color code
 */
export const getPokemonStatColor = (statName) => {
    return POKEMON_STAT_COLORS[statName?.toLowerCase()] || '#A8A878';
};

/**
 * Get stat rating with stars
 * @param {number} value - Stat value
 * @returns {string} Star rating string
 */
export const getStatRating = (value) => {
    if (value >= 130) return '⭐⭐⭐⭐⭐';
    if (value >= 100) return '⭐⭐⭐⭐';
    if (value >= 80) return '⭐⭐⭐';
    if (value >= 60) return '⭐⭐';
    if (value >= 40) return '⭐';
    return '☆';
};

/**
 * Calculate stat percentage for progress bars
 * @param {number} statValue - Current stat value
 * @param {number} maxValue - Maximum possible value (default 255)
 * @returns {number} Percentage (0-100)
 */
export const getStatPercentage = (statValue, maxValue = 255) => {
    return Math.min((statValue / maxValue) * 100, 100);
};

/**
 * Format stat name for display
 * @param {string} statName - Raw stat name from API
 * @returns {string} Formatted stat name
 */
export const formatStatName = (statName) => {
    return statName
        .replace('-', ' ')
        .split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
};

/**
 * Calculate total stats for a Pokemon
 * @param {Object} pokemon - Pokemon object with stats array
 * @returns {number} Total of all base stats
 */
export const getTotalStats = (pokemon) => {
    if (!pokemon?.stats) return 0;
    return pokemon.stats.reduce((total, stat) => total + stat.base_stat, 0);
};

/**
 * Calculate average stats for a Pokemon  
 * @param {Object} pokemon - Pokemon object with stats array
 * @returns {number} Average of all base stats (rounded to 1 decimal)
 */
export const getAverageStats = (pokemon) => {
    if (!pokemon?.stats || pokemon.stats.length === 0) return 0;
    const total = getTotalStats(pokemon);
    return Math.round((total / pokemon.stats.length) * 10) / 10;
};

/**
 * Format Pokemon name for display (capitalize first letter)
 * @param {string} name - Pokemon name
 * @returns {string} Formatted name
 */
export const formatPokemonName = (name) => {
    if (!name) return '';
    return name.charAt(0).toUpperCase() + name.slice(1);
};

/**
 * Format Pokemon ID with leading zeros
 * @param {number} id - Pokemon ID
 * @param {number} length - Total length with padding (default 3)
 * @returns {string} Formatted ID (e.g., "001", "025", "150")
 */
export const formatPokemonId = (id, length = 3) => {
    return id.toString().padStart(length, '0');
};

/**
 * Get Pokemon generation from ID
 * @param {number} id - Pokemon ID
 * @returns {number} Generation number
 */
export const getPokemonGeneration = (id) => {
    if (id <= 151) return 1;
    if (id <= 251) return 2;
    if (id <= 386) return 3;
    if (id <= 493) return 4;
    if (id <= 649) return 5;
    if (id <= 721) return 6;
    if (id <= 809) return 7;
    if (id <= 905) return 8;
    return 9; // Gen 9 and beyond
};