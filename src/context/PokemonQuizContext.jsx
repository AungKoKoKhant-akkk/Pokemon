import React, { createContext, useContext, useState, useEffect } from 'react';
import { getBestPokemonImage } from '../utils/imageUtils';
import axios from 'axios';

const PokemonQuizContext = createContext();

export const usePokemonQuiz = () => {
    const context = useContext(PokemonQuizContext);
    if (!context) {
        throw new Error('usePokemonQuiz must be used within PokemonQuizProvider');
    }
    return context;
};

// Utility to limit concurrent requests
const limitConcurrency = async (items, limit, asyncFn) => {
    const results = [];
    for (let i = 0; i < items.length; i += limit) {
        const batch = items.slice(i, i + limit);
        const batchResults = await Promise.allSettled(
            batch.map(asyncFn)
        );
        results.push(...batchResults);
    }
    return results;
};

// Cache keys for localStorage
const CACHE_KEYS = {
    QUIZ_POKEMON: 'pokemon-quiz-data',
    TIMESTAMP: 'pokemon-quiz-timestamp'
};

// Cache duration: 1 hour
const CACHE_DURATION = 60 * 60 * 1000;

export const PokemonQuizProvider = ({ children }) => {
    const [quizPokemon, setQuizPokemon] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isInitialized, setIsInitialized] = useState(false);
    const [loadingProgress, setLoadingProgress] = useState(0);
    const [error, setError] = useState(null);

    // Check if cached data is still valid
    const isCacheValid = () => {
        try {
            const timestamp = localStorage.getItem(CACHE_KEYS.TIMESTAMP);
            if (!timestamp) return false;

            const cacheAge = Date.now() - parseInt(timestamp);
            return cacheAge < CACHE_DURATION;
        } catch {
            return false;
        }
    };

    // Load from cache
    const loadFromCache = () => {
        try {
            const cached = localStorage.getItem(CACHE_KEYS.QUIZ_POKEMON);
            if (cached && isCacheValid()) {
                const data = JSON.parse(cached);
                console.log(`📋 Loaded ${data.length} Pokemon from cache`);
                return data;
            }
        } catch (error) {
            console.warn('Failed to load from cache:', error);
        }
        return null;
    };

    // Save to cache
    const saveToCache = (data) => {
        try {
            localStorage.setItem(CACHE_KEYS.QUIZ_POKEMON, JSON.stringify(data));
            localStorage.setItem(CACHE_KEYS.TIMESTAMP, Date.now().toString());
            console.log(`💾 Saved ${data.length} Pokemon to cache`);
        } catch (error) {
            console.warn('Failed to save to cache:', error);
        }
    };

    // Optimized Pokemon fetching for quiz
    const fetchQuizPokemon = async () => {
        try {
            setIsLoading(true);
            setError(null);
            setLoadingProgress(0);

            // Check cache first
            const cachedData = loadFromCache();
            if (cachedData) {
                setQuizPokemon(cachedData);
                setIsLoading(false);
                setIsInitialized(true);
                setLoadingProgress(100);
                return;
            }

            console.log('🚀 Fetching optimized quiz Pokemon data...');

            // Step 1: Get first 500 Pokemon for quiz - better variety while maintaining performance
            const response = await axios.get('https://pokeapi.co/api/v2/pokemon?limit=500');
            const pokemonUrls = response.data.results.map(p => p.url);

            console.log('📦 Processing Pokemon with optimized strategy...');

            // Step 2: Fetch Pokemon details with limited concurrency (5 at a time)
            const processedPokemon = [];
            const batchSize = 5;

            const results = await limitConcurrency(
                pokemonUrls,
                batchSize,
                async (url, index) => {
                    try {
                        const detailResponse = await axios.get(url);
                        const pokemon = detailResponse.data;

                        // Only get essential data for quiz
                        const pokemonData = {
                            id: pokemon.id,
                            name: pokemon.name,
                            displayName: pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1),
                            types: pokemon.types.map(t => t.type.name),
                            image: getBestPokemonImage(pokemon),
                            height: pokemon.height,
                            weight: pokemon.weight,
                            baseExperience: pokemon.base_experience,
                            stats: pokemon.stats.map(stat => ({
                                name: stat.stat.name,
                                baseStat: stat.base_stat
                            }))
                        };

                        // Update progress
                        const progress = Math.round(((index + 1) / pokemonUrls.length) * 100);
                        setLoadingProgress(progress);

                        return pokemonData;
                    } catch (error) {
                        console.warn(`Failed to fetch Pokemon at ${url}:`, error);
                        return null;
                    }
                }
            );

            // Filter successful results and those with valid images
            const validPokemon = results
                .filter(result => result.status === 'fulfilled' && result.value)
                .map(result => result.value)
                .filter(pokemon => pokemon.image && pokemon.image !== 'N/A');

            console.log(`✅ Successfully loaded ${validPokemon.length} quiz-ready Pokemon!`);

            setQuizPokemon(validPokemon);
            saveToCache(validPokemon);
            setIsLoading(false);
            setIsInitialized(true);
            setLoadingProgress(100);

        } catch (error) {
            console.error('❌ Error fetching quiz Pokemon:', error);
            setError(error.message);
            setIsLoading(false);
        }
    };

    // Initialize data on mount
    useEffect(() => {
        if (!isInitialized) {
            fetchQuizPokemon();
        }
    }, [isInitialized]);

    // Get random Pokemon for quiz questions
    const getRandomPokemon = (count = 1, exclude = []) => {
        const available = quizPokemon.filter(p => !exclude.includes(p.id));
        const shuffled = [...available].sort(() => Math.random() - 0.5);
        return shuffled.slice(0, count);
    };

    // Get Pokemon by type
    const getPokemonByType = (type) => {
        return quizPokemon.filter(pokemon =>
            pokemon.types.includes(type.toLowerCase())
        );
    };

    // Clear cache (for testing/debugging)
    const clearCache = () => {
        localStorage.removeItem(CACHE_KEYS.QUIZ_POKEMON);
        localStorage.removeItem(CACHE_KEYS.TIMESTAMP);
        console.log('🧹 Cache cleared');
    };

    // Refresh data
    const refreshData = async () => {
        clearCache();
        setIsInitialized(false);
        await fetchQuizPokemon();
    };

    const value = {
        // Data
        quizPokemon,
        isLoading,
        isInitialized,
        loadingProgress,
        error,

        // Computed
        count: quizPokemon.length,

        // Methods
        getRandomPokemon,
        getPokemonByType,
        refreshData,
        clearCache
    };

    return (
        <PokemonQuizContext.Provider value={value}>
            {children}
        </PokemonQuizContext.Provider>
    );
};