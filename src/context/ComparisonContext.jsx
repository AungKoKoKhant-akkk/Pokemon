import React, { createContext, useContext, useState, useEffect } from 'react';

// Constants
import { MAX_COMPARISON_ITEMS, STORAGE_KEYS } from '../constants';

const ComparisonContext = createContext();

export const useComparison = () => {
    const context = useContext(ComparisonContext);
    if (!context) {
        throw new Error('useComparison must be used within a ComparisonProvider');
    }
    return context;
};

export const ComparisonProvider = ({ children }) => {
    const [comparisonList, setComparisonList] = useState([]);

    // Load comparison list from localStorage on mount
    useEffect(() => {
        const savedComparison = localStorage.getItem(STORAGE_KEYS.COMPARISON);
        if (savedComparison) {
            try {
                const parsed = JSON.parse(savedComparison);
                setComparisonList(parsed);
            } catch (error) {
                console.error('Error loading comparison list:', error);
            }
        }
    }, []);

    // Save comparison list to localStorage whenever it changes
    useEffect(() => {
        localStorage.setItem(STORAGE_KEYS.COMPARISON, JSON.stringify(comparisonList));
    }, [comparisonList]);

    const addToComparison = (pokemon) => {
        if (comparisonList.length >= MAX_COMPARISON_ITEMS) {
            return false; // Can't add more
        }

        if (!isInComparison(pokemon.name)) {
            setComparisonList([...comparisonList, pokemon]);
            return true;
        }
        return false; // Already in comparison
    }; const removeFromComparison = (pokemonName) => {
        setComparisonList(prev => prev.filter(pokemon => pokemon.name !== pokemonName));
        return { success: true, message: 'Pokemon removed from comparison' };
    };

    const clearComparison = () => {
        setComparisonList([]);
        return { success: true, message: 'Comparison cleared' };
    };

    const isInComparison = (pokemonName) => {
        return comparisonList.some(pokemon => pokemon.name === pokemonName);
    };

    const canAddMore = () => {
        return comparisonList.length < MAX_COMPARISON_ITEMS;
    };

    const getComparisonCount = () => {
        return comparisonList.length;
    };

    const value = {
        comparisonList,
        addToComparison,
        removeFromComparison,
        clearComparison,
        isInComparison,
        canAddMore,
        getComparisonCount,
        MAX_COMPARISON: MAX_COMPARISON_ITEMS
    };

    return (
        <ComparisonContext.Provider value={value}>
            {children}
        </ComparisonContext.Provider>
    );
};

export default ComparisonContext;