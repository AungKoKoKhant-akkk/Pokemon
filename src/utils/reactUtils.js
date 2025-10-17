/**
 * React-related utility functions
 */

/**
 * Format component display name for better debugging
 * @param {string} componentName - Name of the component
 * @param {string} wrapperName - Name of wrapper (HOC, provider, etc.)
 * @returns {string} Formatted display name
 */
export const formatDisplayName = (componentName, wrapperName) => {
    return `${wrapperName}(${componentName})`;
};

/**
 * Debounce function for React callbacks
 * @param {Function} func - Function to debounce
 * @param {number} delay - Delay in milliseconds
 * @returns {Function} Debounced function
 */
export const debounce = (func, delay) => {
    let timeoutId;
    return (...args) => {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => func.apply(null, args), delay);
    };
};

/**
 * Check if value is valid for React component prop
 * @param {any} value - Value to check
 * @returns {boolean} Whether value is valid
 */
export const isValidProp = (value) => {
    return value !== null && value !== undefined && value !== '';
};