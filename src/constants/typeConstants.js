/**
 * Type definitions and constants for TypeScript-like development
 * Even though we're using JavaScript, this helps with IDE intellisense
 */

/**
 * Pokemon Type Colors - organized by use case
 */
export const POKEMON_TYPES = {
    NORMAL: 'normal',
    FIRE: 'fire',
    WATER: 'water',
    ELECTRIC: 'electric',
    GRASS: 'grass',
    ICE: 'ice',
    FIGHTING: 'fighting',
    POISON: 'poison',
    GROUND: 'ground',
    FLYING: 'flying',
    PSYCHIC: 'psychic',
    BUG: 'bug',
    ROCK: 'rock',
    GHOST: 'ghost',
    DRAGON: 'dragon',
    DARK: 'dark',
    STEEL: 'steel',
    FAIRY: 'fairy'
};

/**
 * Common component prop types (for documentation)
 */
export const PROP_TYPES = {
    // Pokemon object structure
    POKEMON: {
        id: 'number',
        name: 'string',
        types: 'array',
        sprites: 'object',
        stats: 'array',
        abilities: 'array'
    },

    // Feedback object structure
    FEEDBACK: {
        message: 'string',
        type: 'string',
        timestamp: 'number'
    }
};

/**
 * Event handler naming conventions
 */
export const EVENT_HANDLERS = {
    CLICK: 'onClick',
    CHANGE: 'onChange',
    SUBMIT: 'onSubmit',
    FOCUS: 'onFocus',
    BLUR: 'onBlur'
};