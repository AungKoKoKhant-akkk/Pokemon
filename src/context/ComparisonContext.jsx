import React, { createContext, useContext, useState, useEffect } from 'react';

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
    const MAX_COMPARISON = 3; // Allow comparison of up to 3 Pokemon

    // Load comparison list from localStorage on mount
    useEffect(() => {
        const savedComparison = localStorage.getItem('pokemonComparison');
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
        localStorage.setItem('pokemonComparison', JSON.stringify(comparisonList));
    }, [comparisonList]);

    const addToComparison = (pokemon) => {
        if (comparisonList.length >= MAX_COMPARISON) {
            return { success: false, message: `Maximum ${MAX_COMPARISON} Pokemon can be compared at once` };
        }

        const isAlreadyInComparison = comparisonList.some(p => p.name === pokemon.name);
        if (isAlreadyInComparison) {
            return { success: false, message: `${pokemon.name} is already in comparison` };
        }

        setComparisonList(prev => [...prev, pokemon]);
        return { success: true, message: `${pokemon.name} added to comparison` };
    };

    const removeFromComparison = (pokemonName) => {
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
        return comparisonList.length < MAX_COMPARISON;
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
        MAX_COMPARISON
    };

    return (
        <ComparisonContext.Provider value={value}>
            {children}
        </ComparisonContext.Provider>
    );
};

export default ComparisonContext;