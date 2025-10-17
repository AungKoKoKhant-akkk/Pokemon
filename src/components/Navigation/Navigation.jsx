import React from 'react';
import { Link, useLocation } from 'react-router-dom';

// Context imports
import { useComparison } from '../../context/ComparisonContext';
import { useFavorites } from '../../context/FavoritesContext';

// Component imports
import ThemeToggle from '../ThemeToggle/ThemeToggle';

// Assets
import { assets } from '../../assets';

// Styles
import './Navigation.css';

const Navigation = () => {
    const location = useLocation();
    const { getComparisonCount } = useComparison();
    const { favoritesCount } = useFavorites();

    return (
        <div className="container nav_main">
            <div className="nav_banner d-flex justify-content-center align-items-center flex-column">
                <img className="banner" src={assets.pokemon} height="400" width="auto" />
            </div>

            {/* Navigation Links */}
            <nav className="navbar navbar-expand-lg navbar-light bg-light rounded shadow-sm mb-4">
                <div className="container-fluid">
                    <div className="navbar-nav mx-auto d-flex flex-row gap-3 align-items-center">
                        <Link
                            to="/"
                            className={`nav-link px-3 ${location.pathname === '/' ? 'active fw-bold' : ''}`}
                        >
                            <i className="bi bi-house-door me-2"></i>
                            Home
                        </Link>
                        <Link
                            to="/comparison"
                            className={`nav-link px-3 position-relative ${location.pathname === '/comparison' ? 'active fw-bold' : ''}`}
                        >
                            <i className="bi bi-bar-chart me-2"></i>
                            Compare
                            {getComparisonCount() > 0 && (
                                <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-info">
                                    {getComparisonCount()}
                                </span>
                            )}
                        </Link>
                        <Link
                            to="/quiz"
                            className={`nav-link px-3 ${location.pathname === '/quiz' ? 'active fw-bold' : ''}`}
                        >
                            <i className="bi bi-controller me-2"></i>
                            Quiz
                        </Link>
                        <Link
                            to="/favorites"
                            className={`nav-link px-3 position-relative ${location.pathname === '/favorites' ? 'active fw-bold' : ''}`}
                        >
                            <i className="bi bi-heart-fill text-danger me-2"></i>
                            Favorites
                            {favoritesCount > 0 && (
                                <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                                    {favoritesCount}
                                </span>
                            )}
                        </Link>

                        {/* Theme Toggle */}
                        <div className="ms-auto">
                            <ThemeToggle size="small" />
                        </div>
                    </div>
                </div>
            </nav>
        </div>
    );
};

export default Navigation;