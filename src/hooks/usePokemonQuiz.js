import { usePokemonQuiz } from '../context/PokemonQuizContext';

/**
 * Optimized hook for Pokemon quiz data
 * Uses dedicated quiz context for faster loading
 */
export const usePokemonQuizData = () => {
    const {
        quizPokemon,
        isLoading,
        isInitialized,
        loadingProgress,
        error,
        count,
        getRandomPokemon,
        getPokemonByType,
        refreshData,
        clearCache
    } = usePokemonQuiz();

    return {
        pokemon: quizPokemon,
        isLoading,
        isInitialized,
        loadingProgress,
        error,
        count,
        // Quiz-specific methods
        getRandomPokemon,
        getPokemonByType,
        refreshData,
        clearCache
    };
};

/**
 * Hook for generating quiz questions
 * Optimized for different game modes
 */
export const useQuizQuestion = () => {
    const { getRandomPokemon, quizPokemon } = usePokemonQuiz();

    const generateQuestion = (gameMode = 'image', difficulty = 'EASY') => {
        if (quizPokemon.length === 0) return null;

        // Get a random correct answer
        const [correctPokemon] = getRandomPokemon(1);
        if (!correctPokemon) return null;

        // Generate wrong answers based on game mode
        let wrongAnswers = [];

        switch (gameMode) {
            case 'type':
                // For type questions, get Pokemon with different types
                wrongAnswers = getRandomPokemon(3, [correctPokemon.id])
                    .filter(p => !p.types.some(type => correctPokemon.types.includes(type)));
                break;

            case 'silhouette':
            case 'image':
            default:
                // For image/silhouette questions, get random different Pokemon
                wrongAnswers = getRandomPokemon(3, [correctPokemon.id]);
                break;
        }

        // Ensure we have enough wrong answers
        if (wrongAnswers.length < 3) {
            const additional = getRandomPokemon(3 - wrongAnswers.length, [
                correctPokemon.id,
                ...wrongAnswers.map(p => p.id)
            ]);
            wrongAnswers.push(...additional);
        }

        // Create options and shuffle
        const options = [correctPokemon, ...wrongAnswers.slice(0, 3)]
            .sort(() => Math.random() - 0.5);

        return {
            correctAnswer: correctPokemon,
            options,
            correctIndex: options.findIndex(option => option.id === correctPokemon.id),
            gameMode,
            difficulty
        };
    };

    return {
        generateQuestion
    };
};

/**
 * Hook for quiz statistics and scoring
 */
export const useQuizStats = () => {
    const calculateScore = (correctAnswers, totalQuestions, timeBonus = 0) => {
        const baseScore = (correctAnswers / totalQuestions) * 100;
        const finalScore = Math.round(baseScore + timeBonus);

        return {
            correctAnswers,
            totalQuestions,
            accuracy: Math.round((correctAnswers / totalQuestions) * 100),
            baseScore: Math.round(baseScore),
            timeBonus: Math.round(timeBonus),
            finalScore,
            grade: getGrade(finalScore)
        };
    };

    const getGrade = (score) => {
        if (score >= 90) return { letter: 'A+', description: 'Pokemon Master!' };
        if (score >= 80) return { letter: 'A', description: 'Excellent Trainer!' };
        if (score >= 70) return { letter: 'B', description: 'Good Trainer!' };
        if (score >= 60) return { letter: 'C', description: 'Keep Training!' };
        return { letter: 'D', description: 'Need More Practice!' };
    };

    const calculateTimeBonus = (timeLeft, maxTime) => {
        const timeRatio = timeLeft / maxTime;
        return timeRatio * 10; // Max 10 bonus points for speed
    };

    return {
        calculateScore,
        getGrade,
        calculateTimeBonus
    };
};