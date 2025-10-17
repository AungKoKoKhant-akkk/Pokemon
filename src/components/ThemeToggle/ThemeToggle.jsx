import React from 'react';
import { useTheme } from '../../context/ThemeContext';
import './ThemeToggle.css';

const ThemeToggle = ({ className = '', size = 'normal' }) => {
    const { toggleTheme, isDark } = useTheme();

    const getSizeClass = () => {
        switch (size) {
            case 'small': return 'theme-toggle-sm';
            case 'large': return 'theme-toggle-lg';
            default: return '';
        }
    };

    return (
        <button
            className={`theme-toggle ${getSizeClass()} ${className}`}
            onClick={toggleTheme}
            title={`Switch to ${isDark ? 'light' : 'dark'} mode`}
            aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}
        >
            <div className="theme-toggle-track">
                <div className="theme-toggle-thumb">
                    {isDark ? (
                        <i className="bi bi-moon-stars-fill theme-toggle-icon moon"></i>
                    ) : (
                        <i className="bi bi-sun-fill theme-toggle-icon sun"></i>
                    )}
                </div>
            </div>
            <span className="theme-toggle-label d-none d-md-inline">
                {isDark ? 'Dark' : 'Light'}
            </span>
        </button>
    );
};

export default ThemeToggle;