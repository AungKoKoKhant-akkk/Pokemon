import axios from "axios";

const API_URL = 'https://pokeapi.co/api/v2/pokemon?limit=20';
const API_TYPE_URL = 'https://pokeapi.co/api/v2/type';

export const listCategories = async () => {
    try {
        const response = await axios.get(API_URL);
        const results = response.data.results;
        const detailedPokemon = await Promise.all(
            results.map(async (p) => {
                const details = await axios.get(p.url);
                const species = await axios.get(details.data.species.url);
                const evolutionChain = await axios.get(species.data.evolution_chain.url);
                const firstStageName = evolutionChain.data.chain.species.name;

                if (details.data.name !== firstStageName) return null;

                const attackStat = details.data.stats.find(stat => stat.stat.name === "attack");
                const types = details.data.types.map(type => type.type.name).join(", ");
                const generations = details.data.forms.map(gen => gen.name).join(", ");
                const image = details.data.sprites.other.dream_world.front_default;
                return {
                    ...p,
                    description: `Power: ${attackStat ? attackStat.base_stat : "N/A"}`,
                    type: `Type : ${types || "N/A"}`,
                    generations: generations || "N/A",
                    image: image || "N/A"
                };
            })
        );
        // Filter out nulls (non-basic Pokémon)
        return detailedPokemon.filter(Boolean);
    } catch (err) {
        console.error('Error fetching Pokémon data:', err);
        throw err;
    }

}

export const getPokemonTypes = async () => {
    try {
        const response = await axios.get(API_TYPE_URL);
        return response.data.results; // [{ name: "fire", url: "..."}, ...]
    } catch (err) {
        console.error("Error fetching types:", err);
        throw err;
    }
};