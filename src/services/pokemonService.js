// Pokemon Service Layer
// This service provides higher-level abstractions over the Pokemon data context
// and uses our custom hooks for consistent error handling and caching

import { usePokemonData } from '../context/PokemonDataContext';
import { getPokemonTypeColor, formatPokemonName, hasValidImage } from '../utils';

/**
 * Custom hook for Pokemon quiz data
 * Filters Pokemon data suitable for quiz games with proper images
 */
export const usePokemonQuizData = () => {
    const { pokemonList, pokemonTypes, isLoading, isInitialized } = usePokemonData();

    // Filter Pokemon suitable for quiz (with valid images)
    const quizPokemon = pokemonList.filter(hasValidImage);

    return {
        pokemon: quizPokemon,
        types: pokemonTypes,
        isLoading,
        isInitialized,
        count: quizPokemon.length
    };
};

/**
 * Custom hook for Pokemon grid data
 * Provides filtered and paginated Pokemon data for grid displays
 */
export const usePokemonGridData = (filters = {}) => {
    const { pokemonList, pokemonTypes, isLoading } = usePokemonData();
    const { type, search } = filters;

    // Apply filters
    let filteredPokemon = pokemonList;

    if (type && type !== 'All') {
        filteredPokemon = filteredPokemon.filter(pokemon =>
            pokemon.pokemonTypes && pokemon.pokemonTypes.includes(type.toLowerCase())
        );
    }

    if (search) {
        filteredPokemon = filteredPokemon.filter(pokemon =>
            pokemon.name.toLowerCase().includes(search.toLowerCase())
        );
    }

    return {
        pokemon: filteredPokemon,
        types: pokemonTypes,
        isLoading,
        count: filteredPokemon.length,
        totalCount: pokemonList.length
    };
};

/**
 * Service functions for Pokemon data utilities
 * These are pure functions that don't require React hooks
 */
export const PokemonService = {
    /**
     * Get Pokemon type color mapping
     */
    getTypeColor: getPokemonTypeColor,

    /**
     * Format Pokemon data for display
     */
    formatPokemonForDisplay: (pokemon) => {
        if (!pokemon) return null;

        return {
            id: pokemon.id,
            name: pokemon.name,
            displayName: formatPokemonName(pokemon.name),
            image: pokemon.image,
            types: pokemon.pokemonTypes || [],
            description: pokemon.description || '',
            url: pokemon.url,
            // Add formatted type string for compatibility
            type: pokemon.pokemonTypes ?
                `Type: ${pokemon.pokemonTypes.join(', ')}` :
                pokemon.type || 'Type: Unknown'
        };
    },

    /**
     * Get random Pokemon for quiz questions
     */
    getRandomPokemon: (pokemonList, count = 4, exclude = []) => {
        const available = pokemonList.filter(p =>
            !exclude.includes(p.name) && hasValidImage(p)
        );

        const shuffled = [...available].sort(() => 0.5 - Math.random());
        return shuffled.slice(0, count);
    },

    /**
     * Validate Pokemon data completeness
     */
    isValidPokemon: hasValidImage
};