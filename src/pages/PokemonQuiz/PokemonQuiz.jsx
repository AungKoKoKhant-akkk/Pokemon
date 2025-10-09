import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';
import { usePokemonQuizData, useQuizQuestion, useQuizStats } from '../../hooks/usePokemonQuiz';
import './PokemonQuiz.css';

const GAME_MODES = {
    IMAGE: 'image',
    DESCRIPTION: 'description',
    TYPE: 'type',
    SILHOUETTE: 'silhouette'
};

const DIFFICULTY_LEVELS = {
    EASY: { name: 'Easy', questionsCount: 5, timeLimit: 20 },
    MEDIUM: { name: 'Medium', questionsCount: 10, timeLimit: 15 },
    HARD: { name: 'Hard', questionsCount: 15, timeLimit: 10 }
};

const PokemonQuiz = () => {
    const navigate = useNavigate();
    const { isDark } = useTheme();
    const {
        pokemon: quizPokemon,
        isLoading,
        loadingProgress,
        error,
        count: pokemonCount
    } = usePokemonQuizData();

    const { generateQuestion } = useQuizQuestion();
    const { calculateScore, calculateTimeBonus } = useQuizStats();

    // Game state
    const [gameState, setGameState] = useState('menu'); // menu, playing, gameOver
    const [gameMode, setGameMode] = useState(GAME_MODES.IMAGE);
    const [difficulty, setDifficulty] = useState('EASY');
    const [currentQuestion, setCurrentQuestion] = useState(null);
    const [questionNumber, setQuestionNumber] = useState(1);
    const [score, setScore] = useState(0);
    const [timeLeft, setTimeLeft] = useState(0);
    const [selectedAnswer, setSelectedAnswer] = useState('');
    const [showResult, setShowResult] = useState(false);
    const [isCorrect, setIsCorrect] = useState(false);
    const [gameStats, setGameStats] = useState({
        totalQuestions: 0,
        correctAnswers: 0,
        timeBonus: 0,
        finalScore: 0
    });

    // Timer effect
    useEffect(() => {
        let interval;
        if (gameState === 'playing' && timeLeft > 0) {
            interval = setInterval(() => {
                setTimeLeft(prev => {
                    if (prev <= 1) {
                        handleTimeUp();
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [gameState, timeLeft]);

    // Generate question based on game mode
    const generateQuizQuestion = useCallback(() => {
        const questionData = generateQuestion(gameMode, difficulty);
        if (!questionData) return null;

        const { correctAnswer, options } = questionData;

        let prompt, visual, isSilhouette = false;

        switch (gameMode) {
            case GAME_MODES.IMAGE:
                prompt = "Which Pokemon is this?";
                visual = correctAnswer.image;
                break;
            case GAME_MODES.DESCRIPTION:
                prompt = `This Pokemon has type: ${correctAnswer.types.join(', ')}. Which Pokemon is it?`;
                visual = null;
                break;
            case GAME_MODES.TYPE:
                prompt = `Which Pokemon has the type: ${correctAnswer.types[0]}?`;
                visual = null;
                break;
            case GAME_MODES.SILHOUETTE:
                prompt = "Can you identify this Pokemon from its silhouette?";
                visual = correctAnswer.image;
                isSilhouette = true;
                break;
            default:
                prompt = "Which Pokemon is this?";
                visual = correctAnswer.image;
        }

        return {
            correct: correctAnswer,
            options,
            type: gameMode,
            prompt,
            visual,
            isSilhouette
        };
    }, [generateQuestion, gameMode, difficulty]);

    // Start game
    const startGame = () => {
        if (quizPokemon.length === 0) return;

        setGameState('playing');
        setQuestionNumber(1);
        setScore(0);
        setSelectedAnswer('');
        setShowResult(false);
        setTimeLeft(DIFFICULTY_LEVELS[difficulty].timeLimit);

        const question = generateQuizQuestion();
        setCurrentQuestion(question);
    };

    // Handle answer selection
    const handleAnswerSelect = (pokemonName) => {
        if (showResult) return;

        setSelectedAnswer(pokemonName);
        const correct = pokemonName === currentQuestion.correct.name;
        setIsCorrect(correct);
        setShowResult(true);

        if (correct) {
            const timeBonus = Math.floor(timeLeft / 2);
            setScore(prev => prev + 100 + timeBonus);
        }

        // Auto advance after 2 seconds
        setTimeout(() => {
            nextQuestion();
        }, 2000);
    };

    // Handle time up
    const handleTimeUp = () => {
        if (!showResult) {
            setIsCorrect(false);
            setShowResult(true);
            setSelectedAnswer('');

            setTimeout(() => {
                nextQuestion();
            }, 2000);
        }
    };

    // Next question
    const nextQuestion = () => {
        if (questionNumber >= DIFFICULTY_LEVELS[difficulty].questionsCount) {
            endGame();
            return;
        }

        setQuestionNumber(prev => prev + 1);
        setSelectedAnswer('');
        setShowResult(false);
        setTimeLeft(DIFFICULTY_LEVELS[difficulty].timeLimit);

        const question = generateQuizQuestion();
        setCurrentQuestion(question);
    };

    // End game
    const endGame = () => {
        const correctAnswers = Math.floor(score / 100);
        const totalQuestions = DIFFICULTY_LEVELS[difficulty].questionsCount;
        const timeBonus = calculateTimeBonus(timeLeft, DIFFICULTY_LEVELS[difficulty].timeLimit);
        const stats = calculateScore(correctAnswers, totalQuestions, timeBonus);

        setGameStats(stats);
        setGameState('gameOver');
    };

    // Reset game
    const resetGame = () => {
        setGameState('menu');
        setQuestionNumber(1);
        setScore(0);
        setSelectedAnswer('');
        setShowResult(false);
        setCurrentQuestion(null);
    };

    // Get difficulty color
    const getDifficultyColor = (level) => {
        switch (level) {
            case 'EASY': return 'success';
            case 'MEDIUM': return 'warning';
            case 'HARD': return 'danger';
            default: return 'primary';
        }
    };

    if (isLoading || quizPokemon.length === 0) {
        return (
            <div className={`container-fluid quiz-container ${isDark ? 'theme-dark' : ''}`}>
                <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '80vh' }}>
                    <div className="text-center">
                        <div className="spinner-border text-primary mb-3" style={{ width: '3rem', height: '3rem' }}>
                            <span className="visually-hidden">Loading...</span>
                        </div>
                        <h4>Loading Pokemon Quiz...</h4>
                        <p className="text-muted">Preparing your Pokemon adventure!</p>

                        {/* Loading Progress */}
                        {loadingProgress > 0 && (
                            <div className="mt-3">
                                <div className="progress mb-2" style={{ height: '20px' }}>
                                    <div
                                        className="progress-bar progress-bar-striped progress-bar-animated"
                                        role="progressbar"
                                        style={{ width: `${loadingProgress}%` }}
                                        aria-valuenow={loadingProgress}
                                        aria-valuemin="0"
                                        aria-valuemax="100"
                                    >
                                        {loadingProgress}%
                                    </div>
                                </div>
                                <small className="text-muted">
                                    Loading Pokemon data... ({loadingProgress}%)
                                </small>
                            </div>
                        )}

                        {/* Error Display */}
                        {error && (
                            <div className="alert alert-warning mt-3" role="alert">
                                <i className="bi bi-exclamation-triangle me-2"></i>
                                {error}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className={`container-fluid quiz-container ${isDark ? 'theme-dark' : ''}`}>
            {/* Header */}
            <div className="quiz-header text-center py-4">
                <h1 className="quiz-title">
                    <i className="bi bi-controller me-3"></i>
                    Pokemon Quiz Challenge
                </h1>
                <p className="quiz-subtitle">Test your Pokemon knowledge!</p>
            </div>

            {/* Menu State */}
            {gameState === 'menu' && (
                <div className="quiz-menu">
                    <div className="row justify-content-center">
                        <div className="col-lg-8">
                            <div className="card quiz-card">
                                <div className="card-body p-5">
                                    <h2 className="text-center mb-4">Choose Your Challenge</h2>

                                    {/* Game Mode Selection */}
                                    <div className="mb-4">
                                        <h4 className="mb-3">Game Mode</h4>
                                        <div className="row g-3">
                                            {Object.entries(GAME_MODES).map(([key, mode]) => (
                                                <div key={key} className="col-md-6">
                                                    <div
                                                        className={`mode-card ${gameMode === mode ? 'active' : ''}`}
                                                        onClick={() => setGameMode(mode)}
                                                    >
                                                        <div className="mode-icon">
                                                            {mode === 'image' && <i className="bi bi-image"></i>}
                                                            {mode === 'description' && <i className="bi bi-card-text"></i>}
                                                            {mode === 'type' && <i className="bi bi-tags"></i>}
                                                            {mode === 'silhouette' && <i className="bi bi-eye"></i>}
                                                        </div>
                                                        <div className="mode-name">
                                                            {mode === 'image' && 'Guess by Image'}
                                                            {mode === 'description' && 'Guess by Description'}
                                                            {mode === 'type' && 'Guess by Type'}
                                                            {mode === 'silhouette' && 'Guess Silhouette'}
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Difficulty Selection */}
                                    <div className="mb-4">
                                        <h4 className="mb-3">Difficulty Level</h4>
                                        <div className="row g-3">
                                            {Object.entries(DIFFICULTY_LEVELS).map(([key, level]) => (
                                                <div key={key} className="col-md-4">
                                                    <div
                                                        className={`difficulty-card ${difficulty === key ? 'active' : ''} difficulty-${key.toLowerCase()}`}
                                                        onClick={() => setDifficulty(key)}
                                                    >
                                                        <h5>{level.name}</h5>
                                                        <p className="mb-1">{level.questionsCount} Questions</p>
                                                        <p className="mb-0">{level.timeLimit}s per question</p>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Start Button */}
                                    <div className="text-center">
                                        <button
                                            className="btn btn-primary btn-lg start-btn"
                                            onClick={startGame}
                                            disabled={quizPokemon.length === 0}
                                        >
                                            <i className="bi bi-play-fill me-2"></i>
                                            Start Quiz
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Playing State */}
            {gameState === 'playing' && currentQuestion && (
                <div className="quiz-game">
                    {/* Game Header */}
                    <div className="game-header">
                        <div className="row align-items-center">
                            <div className="col-md-4">
                                <div className="question-info">
                                    Question {questionNumber} of {DIFFICULTY_LEVELS[difficulty].questionsCount}
                                </div>
                            </div>
                            <div className="col-md-4 text-center">
                                <div className="score">Score: {score}</div>
                            </div>
                            <div className="col-md-4 text-end">
                                <div className={`timer ${timeLeft <= 5 ? 'danger' : ''}`}>
                                    <i className="bi bi-clock me-2"></i>
                                    {timeLeft}s
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Question */}
                    <div className="question-container">
                        <div className="row justify-content-center">
                            <div className="col-lg-8">
                                <div className="card question-card">
                                    <div className="card-body text-center">
                                        <h3 className="question-prompt mb-4">{currentQuestion.prompt}</h3>

                                        {/* Visual Element */}
                                        {currentQuestion.visual && (
                                            <div className="question-visual mb-4">
                                                <img
                                                    src={currentQuestion.visual}
                                                    alt="Pokemon"
                                                    className={`pokemon-image ${currentQuestion.isSilhouette ? 'silhouette' : ''}`}
                                                />
                                            </div>
                                        )}

                                        {/* Answer Options */}
                                        <div className="answer-options">
                                            <div className="row g-3">
                                                {currentQuestion.options.map((pokemon, index) => (
                                                    <div key={index} className="col-md-6">
                                                        <button
                                                            className={`btn answer-btn w-100 ${showResult
                                                                ? selectedAnswer === pokemon.name
                                                                    ? isCorrect ? 'btn-success' : 'btn-danger'
                                                                    : pokemon.name === currentQuestion.correct.name
                                                                        ? 'btn-success'
                                                                        : 'btn-outline-secondary'
                                                                : 'btn-outline-primary'
                                                                }`}
                                                            onClick={() => handleAnswerSelect(pokemon.name)}
                                                            disabled={showResult}
                                                        >
                                                            {pokemon.name}
                                                            {showResult && pokemon.name === currentQuestion.correct.name && (
                                                                <i className="bi bi-check-circle ms-2"></i>
                                                            )}
                                                            {showResult && selectedAnswer === pokemon.name && !isCorrect && (
                                                                <i className="bi bi-x-circle ms-2"></i>
                                                            )}
                                                        </button>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Result Feedback */}
                                        {showResult && (
                                            <div className={`result-feedback mt-4 ${isCorrect ? 'correct' : 'incorrect'}`}>
                                                {isCorrect ? (
                                                    <div className="text-success">
                                                        <i className="bi bi-check-circle me-2"></i>
                                                        Correct! +{100 + Math.floor(timeLeft / 2)} points
                                                    </div>
                                                ) : (
                                                    <div className="text-danger">
                                                        <i className="bi bi-x-circle me-2"></i>
                                                        {selectedAnswer ? 'Wrong!' : 'Time\'s up!'} The answer was {currentQuestion.correct.name}
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Game Over State */}
            {gameState === 'gameOver' && (
                <div className="quiz-results">
                    <div className="row justify-content-center">
                        <div className="col-lg-6">
                            <div className="card results-card">
                                <div className="card-body text-center p-5">
                                    <div className="results-icon mb-4">
                                        {gameStats.correctAnswers >= gameStats.totalQuestions * 0.8 ? (
                                            <i className="bi bi-trophy-fill text-warning"></i>
                                        ) : gameStats.correctAnswers >= gameStats.totalQuestions * 0.6 ? (
                                            <i className="bi bi-award-fill text-success"></i>
                                        ) : (
                                            <i className="bi bi-emoji-smile text-primary"></i>
                                        )}
                                    </div>

                                    <h2 className="mb-4">Quiz Complete!</h2>

                                    <div className="results-stats mb-4">
                                        <div className="row g-3">
                                            <div className="col-6">
                                                <div className="stat-card">
                                                    <h3>{gameStats.correctAnswers}</h3>
                                                    <p>Correct Answers</p>
                                                </div>
                                            </div>
                                            <div className="col-6">
                                                <div className="stat-card">
                                                    <h3>{gameStats.totalQuestions}</h3>
                                                    <p>Total Questions</p>
                                                </div>
                                            </div>
                                            <div className="col-6">
                                                <div className="stat-card">
                                                    <h3>{Math.round((gameStats.correctAnswers / gameStats.totalQuestions) * 100)}%</h3>
                                                    <p>Accuracy</p>
                                                </div>
                                            </div>
                                            <div className="col-6">
                                                <div className="stat-card">
                                                    <h3>{gameStats.finalScore}</h3>
                                                    <p>Final Score</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="results-actions">
                                        <button
                                            className="btn btn-primary me-3"
                                            onClick={resetGame}
                                        >
                                            <i className="bi bi-arrow-repeat me-2"></i>
                                            Play Again
                                        </button>
                                        <button
                                            className="btn btn-outline-secondary"
                                            onClick={() => navigate('/')}
                                        >
                                            <i className="bi bi-house me-2"></i>
                                            Home
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Back to Home Button */}
            {gameState === 'menu' && (
                <div className="text-center mt-4">
                    <button
                        className="btn btn-outline-secondary"
                        onClick={() => navigate('/')}
                    >
                        <i className="bi bi-arrow-left me-2"></i>
                        Back to Home
                    </button>
                </div>
            )}
        </div>
    );
};

export default PokemonQuiz;