import React, { createContext, useContext, useState, useEffect } from 'react';
import { getBestPokemonImage } from '../utils/imageUtils';
import axios from 'axios';

const PokemonDataContext = createContext();

export const usePokemonData = () => {
    const context = useContext(PokemonDataContext);
    if (!context) {
        throw new Error('usePokemonData must be used within PokemonDataProvider');
    }
    return context;
};

export const PokemonDataProvider = ({ children }) => {
    const [pokemonList, setPokemonList] = useState([]);
    const [pokemonTypes, setPokemonTypes] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isInitialized, setIsInitialized] = useState(false);

    // Cache for detailed Pokemon data
    const pokemonCache = new Map();
    const speciesCache = new Map();
    const evolutionCache = new Map();

    // Fetch initial data only once when context is created
    useEffect(() => {
        const fetchInitialData = async () => {
            if (isInitialized) return; // Prevent duplicate fetches

            try {
                console.log('🚀 Fetching Pokemon data once...');
                setIsLoading(true);

                // Fetch Pokemon list and types in parallel
                const [pokemonResponse, typesResponse] = await Promise.all([
                    axios.get('https://pokeapi.co/api/v2/pokemon?limit=2000'), // Get all Pokemon
                    axios.get('https://pokeapi.co/api/v2/type')
                ]);

                console.log('📦 Processing Pokemon data...');
                const results = pokemonResponse.data.results;

                // Process Pokemon with basic forms only (to match your original logic)
                const detailedPokemon = await Promise.all(
                    results.map(async (p) => {
                        try {
                            const details = await axios.get(p.url);
                            const species = await axios.get(details.data.species.url);
                            const evolutionChain = await axios.get(species.data.evolution_chain.url);
                            const firstStageName = evolutionChain.data.chain.species.name;

                            // Only include base form Pokemon
                            if (details.data.name !== firstStageName) return null;

                            const attackStat = details.data.stats.find(stat => stat.stat.name === "attack");
                            const types = details.data.types.map(type => type.type.name).join(", ");
                            const typeArray = details.data.types.map(type => type.type.name);
                            const generations = details.data.forms.map(gen => gen.name).join(", ");
                            const image = getBestPokemonImage(details.data);

                            // Ensure we have valid types
                            const validTypes = typeArray.filter(type => type && type.trim().length > 0);

                            // Cache the detailed data
                            pokemonCache.set(details.data.name.toLowerCase(), details.data);
                            speciesCache.set(details.data.name.toLowerCase(), species.data);
                            evolutionCache.set(species.data.evolution_chain.url, evolutionChain.data);

                            return {
                                ...p,
                                id: details.data.id,
                                height: details.data.height,
                                weight: details.data.weight,
                                base_experience: details.data.base_experience,
                                description: `Power: ${attackStat ? attackStat.base_stat : "N/A"}`,
                                type: `Type : ${types || "N/A"}`,
                                pokemonTypes: validTypes,
                                generations: generations || "N/A",
                                image: image || "N/A"
                            };
                        } catch (err) {
                            console.warn(`Failed to fetch details for ${p.name}:`, err);
                            return null;
                        }
                    })
                );

                // Filter out nulls and set the data
                const validPokemon = detailedPokemon.filter(Boolean);

                // Extract all unique types from actual Pokemon data
                const allTypesFromPokemon = new Set();
                validPokemon.forEach(pokemon => {
                    if (pokemon.pokemonTypes) {
                        pokemon.pokemonTypes.forEach(type => {
                            allTypesFromPokemon.add(type);
                        });
                    }
                });

                // Define official Pokemon types (18 main types + newer official types)
                const officialTypes = [
                    'normal', 'fire', 'water', 'electric', 'grass', 'ice',
                    'fighting', 'poison', 'ground', 'flying', 'psychic', 'bug',
                    'rock', 'ghost', 'dragon', 'dark', 'steel', 'fairy',
                    'stellar' // New Tera type from recent games
                ];

                // Filter to only include official types that actually exist in the data
                const validTypesInData = Array.from(allTypesFromPokemon)
                    .filter(type => officialTypes.includes(type.toLowerCase()));

                // Combine API types with valid Pokemon types and remove duplicates
                const apiTypes = typesResponse.data.results.map(type => type.name);
                const allValidTypes = [...new Set([...apiTypes, ...validTypesInData])]
                    .filter(type => officialTypes.includes(type.toLowerCase()));

                // Sort types alphabetically and add 'All' at the beginning
                const sortedTypes = ['All', ...allValidTypes.sort()];

                setPokemonList(validPokemon);
                setPokemonTypes(sortedTypes);

                console.log(`✅ Loaded ${validPokemon.length} Pokemon with ${allValidTypes.length} valid types!`);
                console.log(`📋 Available types: ${allValidTypes.join(', ')}`);
                setIsInitialized(true);
                setIsLoading(false);

            } catch (error) {
                console.error('❌ Error fetching initial Pokemon data:', error);
                setIsLoading(false);
            }
        };

        fetchInitialData();
    }, []);

    // Get Pokemon details from cache or fetch if not available
    const getPokemonDetails = async (pokemonName) => {
        const key = pokemonName.toLowerCase();

        // Check cache first
        if (pokemonCache.has(key)) {
            console.log(`📋 Using cached data for ${pokemonName}`);
            return pokemonCache.get(key);
        }

        // If not in cache, fetch and cache it
        try {
            console.log(`🔍 Fetching ${pokemonName} details...`);
            const response = await axios.get(`https://pokeapi.co/api/v2/pokemon/${key}`);
            pokemonCache.set(key, response.data);
            return response.data;
        } catch (error) {
            console.error(`Error fetching ${pokemonName}:`, error);
            return null;
        }
    };

    // Get Pokemon species from cache or fetch if not available
    const getPokemonSpecies = async (pokemonName) => {
        const key = pokemonName.toLowerCase();

        // Check cache first
        if (speciesCache.has(key)) {
            console.log(`📋 Using cached species data for ${pokemonName}`);
            return speciesCache.get(key);
        }

        // If not in cache, fetch and cache it
        try {
            console.log(`🔍 Fetching ${pokemonName} species...`);
            const response = await axios.get(`https://pokeapi.co/api/v2/pokemon-species/${key}`);
            speciesCache.set(key, response.data);
            return response.data;
        } catch (error) {
            console.error(`Error fetching ${pokemonName} species:`, error);
            return null;
        }
    };

    // Get evolution chain from cache or fetch if not available
    const getEvolutionChain = async (evolutionUrl) => {
        // Check cache first
        if (evolutionCache.has(evolutionUrl)) {
            console.log(`📋 Using cached evolution data`);
            return evolutionCache.get(evolutionUrl);
        }

        // If not in cache, fetch and cache it
        try {
            console.log(`🔍 Fetching evolution chain...`);
            const response = await axios.get(evolutionUrl);
            evolutionCache.set(evolutionUrl, response.data);
            return response.data;
        } catch (error) {
            console.error(`Error fetching evolution chain:`, error);
            return null;
        }
    };

    // Get type data
    const getTypeData = async (typeName) => {
        try {
            const response = await axios.get(`https://pokeapi.co/api/v2/type/${typeName}`);
            return response.data;
        } catch (error) {
            console.error(`Error fetching type ${typeName}:`, error);
            return null;
        }
    };

    // Get cache statistics
    const getCacheStats = () => ({
        pokemonCached: pokemonCache.size,
        speciesCached: speciesCache.size,
        evolutionsCached: evolutionCache.size,
        totalPokemon: pokemonList.length
    });

    const value = {
        // Data
        pokemonList,
        pokemonTypes,
        isLoading,
        isInitialized,

        // Methods
        getPokemonDetails,
        getPokemonSpecies,
        getEvolutionChain,
        getTypeData,
        getCacheStats
    };

    return (
        <PokemonDataContext.Provider value={value}>
            {children}
        </PokemonDataContext.Provider>
    );
};