/**
 * Error handling utilities
 */

/**
 * Standard error types for the application
 */
export const ERROR_TYPES = {
    NETWORK: 'NETWORK_ERROR',
    API: 'API_ERROR',
    VALIDATION: 'VALIDATION_ERROR',
    NOT_FOUND: 'NOT_FOUND',
    UNKNOWN: 'UNKNOWN_ERROR'
};

/**
 * Create standardized error object
 * @param {string} type - Error type from ERROR_TYPES
 * @param {string} message - Human readable error message
 * @param {any} originalError - Original error object
 * @returns {Object} Standardized error object
 */
export const createError = (type, message, originalError = null) => ({
    type,
    message,
    originalError,
    timestamp: new Date().toISOString()
});

/**
 * Handle API errors consistently
 * @param {Error} error - Error object from API call
 * @returns {Object} Standardized error object
 */
export const handleApiError = (error) => {
    if (!error.response) {
        return createError(ERROR_TYPES.NETWORK, 'Network error occurred', error);
    }

    const { status, statusText } = error.response;

    switch (status) {
        case 404:
            return createError(ERROR_TYPES.NOT_FOUND, 'Resource not found', error);
        case 400:
            return createError(ERROR_TYPES.VALIDATION, 'Invalid request', error);
        case 500:
            return createError(ERROR_TYPES.API, 'Server error occurred', error);
        default:
            return createError(ERROR_TYPES.API, statusText || 'API error occurred', error);
    }
};

/**
 * Log error consistently
 * @param {Object} error - Standardized error object
 * @param {string} context - Context where error occurred
 */
export const logError = (error, context = 'Unknown') => {
    console.error(`[${context}] ${error.type}: ${error.message}`, error.originalError);
};