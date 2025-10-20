import { useState } from 'react';

/**
 * Custom hook for managing localStorage with React state
 * @param {string} key - localStorage key
 * @param {any} initialValue - default value if nothing in localStorage
 * @returns {[value, setValue]} - state value and setter function
 */
export const useLocalStorage = (key, initialValue) => {
    // State to store our value
    // Pass initial state function to useState so logic is only executed once
    const [storedValue, setStoredValue] = useState(() => {
        try {
            const item = localStorage.getItem(key);
            if (!item) return initialValue;

            // Try to parse as JSON first
            try {
                return JSON.parse(item);
            } catch (parseError) {
                // If JSON parsing fails, check if it's a plain string value
                // This handles cases where values were stored as raw strings
                if (typeof item === 'string') {
                    console.warn(`Converting plain string localStorage value for key "${key}" to JSON format`);
                    // Store the corrected value back as JSON
                    localStorage.setItem(key, JSON.stringify(item));
                    return item;
                }
                throw parseError;
            }
        } catch (error) {
            console.error(`Error reading localStorage key "${key}":`, error);
            // Clear the corrupted value and return initial value
            localStorage.removeItem(key);
            return initialValue;
        }
    });

    // Return a wrapped version of useState's setter function that ...
    // ... persists the new value to localStorage.
    const setValue = (value) => {
        try {
            // Allow value to be a function so we have the same API as useState
            const valueToStore = value instanceof Function ? value(storedValue) : value;

            // Save state
            setStoredValue(valueToStore);

            // Save to localStorage
            localStorage.setItem(key, JSON.stringify(valueToStore));
        } catch (error) {
            console.error(`Error setting localStorage key "${key}":`, error);
        }
    };

    return [storedValue, setValue];
};

/**
 * Hook for managing multiple localStorage values as an object
 * @param {string} prefix - prefix for localStorage keys
 * @param {object} initialValues - object with initial values
 * @returns {[values, setValues, setValue]} - values object, bulk setter, individual setter
 */
export const useLocalStorageObject = (prefix, initialValues) => {
    const [values, setValues] = useState(() => {
        const result = {};

        Object.keys(initialValues).forEach(key => {
            try {
                const item = localStorage.getItem(`${prefix}${key}`);
                if (!item) {
                    result[key] = initialValues[key];
                    return;
                }

                // Try to parse as JSON first
                try {
                    result[key] = JSON.parse(item);
                } catch (parseError) {
                    // If JSON parsing fails, check if it's a plain string value
                    if (typeof item === 'string') {
                        console.warn(`Converting plain string localStorage value for key "${prefix}${key}" to JSON format`);
                        // Store the corrected value back as JSON
                        localStorage.setItem(`${prefix}${key}`, JSON.stringify(item));
                        result[key] = item;
                    } else {
                        throw parseError;
                    }
                }
            } catch (error) {
                console.error(`Error reading localStorage key "${prefix}${key}":`, error);
                localStorage.removeItem(`${prefix}${key}`);
                result[key] = initialValues[key];
            }
        });

        return result;
    });

    const setValue = (key, value) => {
        try {
            const valueToStore = value instanceof Function ? value(values[key]) : value;

            setValues(prev => ({
                ...prev,
                [key]: valueToStore
            }));

            localStorage.setItem(`${prefix}${key}`, JSON.stringify(valueToStore));
        } catch (error) {
            console.error(`Error setting localStorage key "${prefix}${key}":`, error);
        }
    };

    const setMultipleValues = (newValues) => {
        try {
            const updatedValues = { ...values, ...newValues };
            setValues(updatedValues);

            Object.keys(newValues).forEach(key => {
                localStorage.setItem(`${prefix}${key}`, JSON.stringify(newValues[key]));
            });
        } catch (error) {
            console.error(`Error setting multiple localStorage values with prefix "${prefix}":`, error);
        }
    };

    return [values, setMultipleValues, setValue];
};