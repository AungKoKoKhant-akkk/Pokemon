/**
 * Utility functions for localStorage management and cleanup
 */

/**
 * Clean up corrupted localStorage values
 * This function identifies and fixes localStorage values that were stored as plain strings
 * instead of JSON-encoded strings
 */
export const cleanupLocalStorage = () => {
    const keysToCheck = [
        'pokemon-app-theme',
        'pokemon-favorites',
        'pokemon-settings',
        'pokemon-quiz-data',
        'pokemon-quiz-timestamp'
    ];

    const results = {
        cleaned: 0,
        errors: 0,
        details: []
    };

    keysToCheck.forEach(key => {
        try {
            const item = localStorage.getItem(key);
            if (!item) return;

            // Try to parse as JSON
            try {
                JSON.parse(item);
                // If successful, it's already properly formatted
                results.details.push({ key, status: 'ok', action: 'none' });
            } catch (parseError) {
                // If parsing fails, check if it's a plain string that needs conversion
                if (typeof item === 'string') {
                    // Convert to proper JSON format
                    localStorage.setItem(key, JSON.stringify(item));
                    results.cleaned++;
                    results.details.push({
                        key,
                        status: 'fixed',
                        action: 'converted plain string to JSON',
                        oldValue: item,
                        newValue: JSON.stringify(item)
                    });
                } else {
                    // If it's not a string, remove the corrupted value
                    localStorage.removeItem(key);
                    results.errors++;
                    results.details.push({
                        key,
                        status: 'removed',
                        action: 'removed corrupted value',
                        error: parseError.message
                    });
                }
            }
        } catch (error) {
            results.errors++;
            results.details.push({
                key,
                status: 'error',
                action: 'failed to process',
                error: error.message
            });
        }
    });

    return results;
};

/**
 * Get localStorage statistics
 */
export const getLocalStorageStats = () => {
    const stats = {
        totalKeys: 0,
        pokemonKeys: 0,
        totalSize: 0,
        details: []
    };

    for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        const value = localStorage.getItem(key);
        const size = new Blob([value]).size;

        stats.totalKeys++;
        stats.totalSize += size;

        if (key.startsWith('pokemon-')) {
            stats.pokemonKeys++;
        }

        stats.details.push({
            key,
            size,
            sizeKB: Math.round(size / 1024 * 100) / 100,
            isPokemonKey: key.startsWith('pokemon-')
        });
    }

    stats.totalSizeKB = Math.round(stats.totalSize / 1024 * 100) / 100;
    stats.totalSizeMB = Math.round(stats.totalSize / (1024 * 1024) * 100) / 100;

    return stats;
};

/**
 * Clear all Pokemon-related localStorage data
 */
export const clearPokemonLocalStorage = () => {
    const keysToRemove = [];

    for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key.startsWith('pokemon-')) {
            keysToRemove.push(key);
        }
    }

    keysToRemove.forEach(key => {
        localStorage.removeItem(key);
    });

    return {
        removed: keysToRemove.length,
        keys: keysToRemove
    };
};

/**
 * Validate localStorage value format
 */
export const validateLocalStorageValue = (key) => {
    try {
        const item = localStorage.getItem(key);
        if (!item) return { status: 'missing', valid: false };

        JSON.parse(item);
        return { status: 'valid', valid: true };
    } catch (error) {
        return {
            status: 'invalid',
            valid: false,
            error: error.message,
            value: localStorage.getItem(key)
        };
    }
};