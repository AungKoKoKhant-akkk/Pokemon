import React, { createContext, useState, useContext, useEffect } from 'react';
import { useLocalStorage } from '../hooks';

const ThemeContext = createContext();

export const useTheme = () => {
    const context = useContext(ThemeContext);
    if (!context) {
        throw new Error('useTheme must be used within a ThemeProvider');
    }
    return context;
};

export const ThemeProvider = ({ children }) => {
    // Use custom hook for theme persistence
    const [theme, setTheme] = useLocalStorage('pokemon-app-theme', 'light');

    // Update document class when theme changes
    useEffect(() => {
        // Update document body class for global theme styling
        document.body.className = document.body.className.replace(/theme-\w+/g, '');
        document.body.classList.add(`theme-${theme}`);

        // Update data attribute for CSS targeting
        document.documentElement.setAttribute('data-theme', theme);
    }, [theme]);

    // Initialize theme on mount
    useEffect(() => {
        document.body.classList.add(`theme-${theme}`);
        document.documentElement.setAttribute('data-theme', theme);
    }, []);

    const toggleTheme = () => {
        setTheme(prevTheme => prevTheme === 'light' ? 'dark' : 'light');
    };

    const isDark = theme === 'dark';

    const value = {
        theme,
        setTheme,
        toggleTheme,
        isDark,
        isLight: theme === 'light'
    };

    return (
        <ThemeContext.Provider value={value}>
            {children}
        </ThemeContext.Provider>
    );
};

export default ThemeContext;