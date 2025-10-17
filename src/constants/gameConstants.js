/**
 * Game-related constants
 */

export const GAME_MODES = {
    IMAGE: 'image',
    DESCRIPTION: 'description',
    TYPE: 'type',
    SILHOUETTE: 'silhouette'
};

export const DIFFICULTY_LEVELS = {
    EASY: {
        name: 'Easy',
        questionsCount: 5,
        timeLimit: 20
    },
    MEDIUM: {
        name: 'Medium',
        questionsCount: 10,
        timeLimit: 15
    },
    HARD: {
        name: 'Hard',
        questionsCount: 15,
        timeLimit: 10
    }
};

export const MAX_COMPARISON_ITEMS = 3;