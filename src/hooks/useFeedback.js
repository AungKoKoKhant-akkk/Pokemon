import { useState, useCallback, useRef } from 'react';

/**
 * Custom hook for managing feedback/toast messages with auto-dismiss
 * @param {number} defaultDuration - default duration in milliseconds (default: 3000)
 * @returns {object} - feedback state and methods
 */
export const useFeedback = (defaultDuration = 3000) => {
    const [feedback, setFeedback] = useState(null);
    const timeoutRef = useRef(null);

    // Clear any existing timeout
    const clearTimeout = useCallback(() => {
        if (timeoutRef.current) {
            window.clearTimeout(timeoutRef.current);
            timeoutRef.current = null;
        }
    }, []);

    // Show feedback with auto-dismiss
    const showFeedback = useCallback((message, type = 'info', duration = defaultDuration) => {
        // Clear any existing timeout
        clearTimeout();

        // Set new feedback
        setFeedback({
            message,
            type,
            timestamp: Date.now()
        });

        // Set new timeout for auto-dismiss
        if (duration > 0) {
            timeoutRef.current = window.setTimeout(() => {
                setFeedback(null);
                timeoutRef.current = null;
            }, duration);
        }
    }, [defaultDuration, clearTimeout]);

    // Manually clear feedback
    const clearFeedback = useCallback(() => {
        clearTimeout();
        setFeedback(null);
    }, [clearTimeout]);

    // Helper methods for common feedback types
    const showSuccess = useCallback((message, duration) => {
        showFeedback(message, 'success', duration);
    }, [showFeedback]);

    const showError = useCallback((message, duration) => {
        showFeedback(message, 'error', duration);
    }, [showFeedback]);

    const showWarning = useCallback((message, duration) => {
        showFeedback(message, 'warning', duration);
    }, [showFeedback]);

    const showInfo = useCallback((message, duration) => {
        showFeedback(message, 'info', duration);
    }, [showFeedback]);

    return {
        feedback,
        showFeedback,
        clearFeedback,
        showSuccess,
        showError,
        showWarning,
        showInfo,
        hasFeedback: feedback !== null
    };
};

/**
 * Hook for managing multiple independent feedback states
 * @param {object} config - configuration for different feedback types
 * @returns {object} - feedback states and methods for each type
 */
export const useMultipleFeedback = (config = {}) => {
    const defaultConfig = {
        favorite: { duration: 3000 },
        comparison: { duration: 3000 },
        general: { duration: 3000 },
        ...config
    };

    const feedbackStates = {};

    Object.keys(defaultConfig).forEach(key => {
        const { duration } = defaultConfig[key];
        // eslint-disable-next-line react-hooks/rules-of-hooks
        feedbackStates[key] = useFeedback(duration);
    });

    return feedbackStates;
};