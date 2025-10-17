/**
 * Application-wide constants
 */

// Cache configurations
export const CACHE_EXPIRY = 10 * 60 * 1000; // 10 minutes

// Local storage keys
export const STORAGE_KEYS = {
    THEME: 'pokemon-app-theme',
    FAVORITES: 'pokemon-favorites',
    COMPARISON: 'pokemonComparison',
    QUIZ_DATA: 'pokemon-quiz-data',
    QUIZ_TIMESTAMP: 'pokemon-quiz-timestamp',
    SETTINGS: 'pokemon-settings'
};

// Theme constants
export const THEMES = {
    LIGHT: 'light',
    DARK: 'dark'
};

// Feedback types
export const FEEDBACK_TYPES = {
    SUCCESS: 'success',
    ERROR: 'error',
    WARNING: 'warning',
    INFO: 'info',
    ADDED: 'added',
    REMOVED: 'removed'
};