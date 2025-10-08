# Pokemon API Reference & Usage

## 🌐 API Base URL
```
https://pokeapi.co/api/v2/
```

## 📋 Main API Endpoints Used

### 1. Pokemon List
**Endpoint:** `GET /pokemon?limit=1000`
```javascript
const response = await axios.get('https://pokeapi.co/api/v2/pokemon?limit=1000');

// Response structure:
{
  "count": 1302,
  "next": "https://pokeapi.co/api/v2/pokemon?offset=1000&limit=1000",
  "previous": null,
  "results": [
    {
      "name": "bulbasaur",
      "url": "https://pokeapi.co/api/v2/pokemon/1/"
    },
    {
      "name": "ivysaur", 
      "url": "https://pokeapi.co/api/v2/pokemon/2/"
    }
    // ... more pokemon
  ]
}
```

### 2. Pokemon Details
**Endpoint:** `GET /pokemon/{id or name}`
```javascript
const response = await axios.get('https://pokeapi.co/api/v2/pokemon/1');
// or
const response = await axios.get('https://pokeapi.co/api/v2/pokemon/bulbasaur');

// Response structure (key fields):
{
  "id": 1,
  "name": "bulbasaur",
  "height": 7,
  "weight": 69,
  "base_experience": 64,
  "types": [
    {
      "slot": 1,
      "type": {
        "name": "grass",
        "url": "https://pokeapi.co/api/v2/type/12/"
      }
    },
    {
      "slot": 2,
      "type": {
        "name": "poison",
        "url": "https://pokeapi.co/api/v2/type/4/"
      }
    }
  ],
  "sprites": {
    "front_default": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/1.png",
    "front_shiny": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/shiny/1.png",
    "other": {
      "dream_world": {
        "front_default": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/dream-world/1.svg"
      },
      "official-artwork": {
        "front_default": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/1.png"
      }
    }
  },
  "stats": [
    {
      "base_stat": 45,
      "effort": 0,
      "stat": {
        "name": "hp",
        "url": "https://pokeapi.co/api/v2/stat/1/"
      }
    },
    {
      "base_stat": 49,
      "effort": 0,
      "stat": {
        "name": "attack",
        "url": "https://pokeapi.co/api/v2/stat/2/"
      }
    }
    // ... more stats
  ],
  "species": {
    "name": "bulbasaur",
    "url": "https://pokeapi.co/api/v2/pokemon-species/1/"
  }
}
```

### 3. Pokemon Species
**Endpoint:** `GET /pokemon-species/{id}`
```javascript
const response = await axios.get('https://pokeapi.co/api/v2/pokemon-species/1');

// Response structure (key fields):
{
  "id": 1,
  "name": "bulbasaur",
  "color": {
    "name": "green",
    "url": "https://pokeapi.co/api/v2/pokemon-color/5/"
  },
  "evolution_chain": {
    "url": "https://pokeapi.co/api/v2/evolution-chain/1/"
  },
  "flavor_text_entries": [
    {
      "flavor_text": "A strange seed was planted on its back at birth...",
      "language": {
        "name": "en",
        "url": "https://pokeapi.co/api/v2/language/9/"
      }
    }
  ],
  "generation": {
    "name": "generation-i",
    "url": "https://pokeapi.co/api/v2/generation/1/"
  }
}
```

### 4. Evolution Chain
**Endpoint:** `GET /evolution-chain/{id}`
```javascript
const response = await axios.get('https://pokeapi.co/api/v2/evolution-chain/1');

// Response structure:
{
  "id": 1,
  "chain": {
    "species": {
      "name": "bulbasaur",
      "url": "https://pokeapi.co/api/v2/pokemon-species/1/"
    },
    "evolves_to": [
      {
        "species": {
          "name": "ivysaur",
          "url": "https://pokeapi.co/api/v2/pokemon-species/2/"
        },
        "evolution_details": [
          {
            "min_level": 16,
            "trigger": {
              "name": "level-up"
            }
          }
        ],
        "evolves_to": [
          {
            "species": {
              "name": "venusaur",
              "url": "https://pokeapi.co/api/v2/pokemon-species/3/"
            },
            "evolution_details": [
              {
                "min_level": 32,
                "trigger": {
                  "name": "level-up"
                }
              }
            ],
            "evolves_to": []
          }
        ]
      }
    ]
  }
}
```

### 5. Pokemon Types
**Endpoint:** `GET /type`
```javascript
const response = await axios.get('https://pokeapi.co/api/v2/type');

// Response structure:
{
  "count": 20,
  "results": [
    {
      "name": "normal",
      "url": "https://pokeapi.co/api/v2/type/1/"
    },
    {
      "name": "fighting", 
      "url": "https://pokeapi.co/api/v2/type/2/"
    }
    // ... all types
  ]
}
```

## 🔧 How Your App Uses the API

### Main Pokemon Data Context
Located in: `src/context/PokemonDataContext.jsx`

```javascript
// Fetches all Pokemon with detailed data
const [pokemonResponse, typesResponse] = await Promise.all([
    axios.get('https://pokeapi.co/api/v2/pokemon?limit=1000'),
    axios.get('https://pokeapi.co/api/v2/type')
]);

// For each Pokemon, fetches:
const details = await axios.get(p.url);                    // Pokemon details
const species = await axios.get(details.data.species.url); // Species info  
const evolutionChain = await axios.get(species.data.evolution_chain.url); // Evolution
```

### Optimized Quiz Context
Located in: `src/context/PokemonQuizContext.jsx`

```javascript
// Fetches only first 151 Pokemon (Gen 1) for better performance
const response = await axios.get('https://pokeapi.co/api/v2/pokemon?limit=151');

// Processes with limited concurrency (5 at a time)
const results = await limitConcurrency(pokemonUrls, 5, async (url) => {
    const detailResponse = await axios.get(url);
    return processedPokemonData;
});
```

## 🖼️ Image URLs Structure

Your app uses multiple image sources with fallback strategy:

```javascript
// High quality official artwork (preferred)
https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/{id}.png

// Dream world artwork (fallback)
https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/dream-world/{id}.svg

// Default sprite (final fallback)
https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/{id}.png

// CDN fallbacks
https://assets.pokemon.com/assets/cms2/img/pokedex/detail/{id}.png
https://img.pokemondb.net/artwork/large/{name}.jpg
```

## 📊 Data Processing in Your App

### 1. Basic Pokemon Object Structure (Used in your app)
```javascript
{
    id: 1,
    name: "bulbasaur",
    displayName: "Bulbasaur",
    types: ["grass", "poison"],
    image: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/1.png",
    height: 7,
    weight: 69,
    baseExperience: 64,
    stats: [
        { name: "hp", baseStat: 45 },
        { name: "attack", baseStat: 49 },
        { name: "defense", baseStat: 49 },
        { name: "special-attack", baseStat: 65 },
        { name: "special-defense", baseStat: 65 },
        { name: "speed", baseStat: 45 }
    ]
}
```

### 2. Caching Strategy
```javascript
// Pokemon details cache
pokemonCache.set(pokemonName.toLowerCase(), detailsData);

// Species data cache  
speciesCache.set(pokemonName.toLowerCase(), speciesData);

// Evolution chain cache
evolutionCache.set(evolutionUrl, evolutionData);

// Quiz data cache (localStorage)
localStorage.setItem('pokemon-quiz-data', JSON.stringify(quizPokemon));
```

## 🚀 Performance Optimizations

### 1. Concurrent Request Limiting
```javascript
const limitConcurrency = async (items, limit, asyncFn) => {
    const results = [];
    for (let i = 0; i < items.length; i += limit) {
        const batch = items.slice(i, i + limit);
        const batchResults = await Promise.allSettled(batch.map(asyncFn));
        results.push(...batchResults);
    }
    return results;
};
```

### 2. Smart Caching
- **Memory Cache**: For session-based data
- **localStorage Cache**: For persistent data (1-hour TTL)
- **Image Validation**: Pre-filters Pokemon without valid images

### 3. Error Handling
```javascript
try {
    const response = await axios.get(url);
    return processData(response.data);
} catch (error) {
    console.warn(`Failed to fetch ${url}:`, error);
    return null; // Graceful fallback
}
```

## 🎮 API Usage Examples

### Get Random Pokemon for Quiz
```javascript
const { getRandomPokemon } = usePokemonQuiz();
const randomPokemon = getRandomPokemon(4); // Get 4 random Pokemon
```

### Get Pokemon by Type
```javascript
const { getPokemonByType } = usePokemonQuiz();
const grassPokemon = getPokemonByType('grass');
```

### Get Cached Pokemon Details
```javascript
const { getPokemonDetails } = usePokemonData();
const pikachuDetails = await getPokemonDetails('pikachu');
```

## 📈 API Rate Limits & Best Practices

- **No official rate limits**, but recommended to limit concurrent requests
- **Your app limits**: 5 concurrent requests max
- **Caching**: Essential for performance (implemented in your app)
- **Error handling**: Always include fallbacks for failed requests
- **Image validation**: Check if images exist before using

This covers the complete Pokemon API usage in your application!