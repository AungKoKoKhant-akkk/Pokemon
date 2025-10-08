// Services Export Index
// Centralized exports for Pokemon service layer

export {
    usePokemonQuizData,
    usePokemonGridData,
    PokemonService
} from './pokemonService';

// Re-export optimized quiz hooks
export {
    usePokemonQuizData as useOptimizedPokemonQuizData,
    useQuizQuestion,
    useQuizStats
} from '../hooks/usePokemonQuiz';