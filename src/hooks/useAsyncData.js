import { useState, useEffect, useCallback, useRef } from 'react';

/**
 * Custom hook for handling async operations with loading, error, and success states
 * @param {Function} asyncFunction - async function to execute
 * @param {Array} dependencies - dependency array for useEffect (default: [])
 * @param {boolean} immediate - whether to execute immediately on mount (default: true)
 * @returns {object} - state object with data, loading, error, and utility methods
 */
export const useAsyncData = (asyncFunction, dependencies = [], immediate = true) => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(immediate);
    const [error, setError] = useState(null);
    const [isExecuted, setIsExecuted] = useState(false);
    const isMountedRef = useRef(true);

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            isMountedRef.current = false;
        };
    }, []);

    // Execute the async function
    const execute = useCallback(async (...args) => {
        if (!isMountedRef.current) return;

        try {
            setLoading(true);
            setError(null);

            const result = await asyncFunction(...args);

            if (isMountedRef.current) {
                setData(result);
                setIsExecuted(true);
            }

            return result;
        } catch (err) {
            if (isMountedRef.current) {
                setError(err);
                console.error('AsyncData Error:', err);
            }
            throw err;
        } finally {
            if (isMountedRef.current) {
                setLoading(false);
            }
        }
    }, [asyncFunction]);

    // Reset state
    const reset = useCallback(() => {
        if (isMountedRef.current) {
            setData(null);
            setLoading(false);
            setError(null);
            setIsExecuted(false);
        }
    }, []);

    // Retry the last execution
    const retry = useCallback(() => {
        return execute();
    }, [execute]);

    // Execute on mount if immediate is true
    useEffect(() => {
        if (immediate && asyncFunction) {
            execute();
        }
    }, dependencies); // eslint-disable-line react-hooks/exhaustive-deps

    return {
        data,
        loading,
        error,
        isExecuted,
        execute,
        retry,
        reset,
        isSuccess: !loading && !error && isExecuted,
        isError: !loading && error !== null,
        isIdle: !loading && !isExecuted
    };
};

/**
 * Hook for managing multiple async operations
 * @param {object} asyncFunctions - object with async functions
 * @param {object} config - configuration for each function
 * @returns {object} - state and methods for each async function
 */
export const useMultipleAsyncData = (asyncFunctions, config = {}) => {
    const states = {};

    Object.keys(asyncFunctions).forEach(key => {
        const asyncFn = asyncFunctions[key];
        const fnConfig = config[key] || {};
        const { dependencies = [], immediate = false } = fnConfig;

        // eslint-disable-next-line react-hooks/rules-of-hooks
        states[key] = useAsyncData(asyncFn, dependencies, immediate);
    });

    return states;
};

/**
 * Hook for handling paginated data loading
 * @param {Function} fetchFunction - function that accepts page and limit
 * @param {object} options - configuration options
 * @returns {object} - paginated data state and methods
 */
export const usePaginatedAsyncData = (fetchFunction, options = {}) => {
    const {
        initialPage = 1,
        initialLimit = 10,
        immediate = true
    } = options;

    const [page, setPage] = useState(initialPage);
    const [limit, setLimit] = useState(initialLimit);
    const [totalItems, setTotalItems] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [allData, setAllData] = useState([]);

    const asyncState = useAsyncData(
        async () => {
            const result = await fetchFunction(page, limit);

            // Update pagination info if provided
            if (result.totalItems) setTotalItems(result.totalItems);
            if (result.totalPages) setTotalPages(result.totalPages);

            // Accumulate data or replace based on strategy
            const newData = result.data || result;
            setAllData(prev => options.accumulate ? [...prev, ...newData] : newData);

            return result;
        },
        [page, limit],
        immediate
    );

    const nextPage = useCallback(() => {
        if (page < totalPages) {
            setPage(prev => prev + 1);
        }
    }, [page, totalPages]);

    const prevPage = useCallback(() => {
        if (page > 1) {
            setPage(prev => prev - 1);
        }
    }, [page]);

    const goToPage = useCallback((pageNumber) => {
        if (pageNumber >= 1 && pageNumber <= totalPages) {
            setPage(pageNumber);
        }
    }, [totalPages]);

    const changeLimit = useCallback((newLimit) => {
        setLimit(newLimit);
        setPage(1); // Reset to first page when changing limit
        if (options.accumulate) {
            setAllData([]); // Clear accumulated data
        }
    }, [options.accumulate]);

    return {
        ...asyncState,
        data: allData,
        pagination: {
            page,
            limit,
            totalItems,
            totalPages,
            hasNext: page < totalPages,
            hasPrev: page > 1
        },
        nextPage,
        prevPage,
        goToPage,
        changeLimit,
        setPage,
        setLimit
    };
};