import React, { useState } from 'react';
import { useSearch } from '../../context/SearchContext';
import "./SearchBar.css"

const SearchBar = () => {
    const { searchTerm, updateSearch, clearSearch } = useSearch();
    const [localSearchTerm, setLocalSearchTerm] = useState(searchTerm);

    const handleSubmit = (e) => {
        e.preventDefault();
        updateSearch(localSearchTerm.trim());
    };

    const handleInputChange = (e) => {
        const value = e.target.value;
        setLocalSearchTerm(value);

        // Real-time search as user types
        updateSearch(value.trim());
    };

    const handleClear = () => {
        setLocalSearchTerm('');
        clearSearch();
    };

    return (
        <div className="container">
            <div className="row justify-content-center mb-5">
                <div className="col-md-8">
                    <form className="d-flex" onSubmit={handleSubmit}>
                        <div className="input-group rounded-3 overflow-hidden shadow">
                            <input
                                className="form-control form-control-lg"
                                type="search"
                                placeholder="Search Pokemon by name (e.g., Pikachu, Charizard...)"
                                aria-label="Search Pokemon"
                                value={localSearchTerm}
                                onChange={handleInputChange}
                            />
                            {localSearchTerm && (
                                <button
                                    className="btn btn-outline-secondary"
                                    type="button"
                                    onClick={handleClear}
                                    title="Clear search"
                                >
                                    <i className="bi bi-x-lg"></i>
                                </button>
                            )}
                            <button className="btn btn-primary px-4 button-design" type="submit">
                                <i className="bi bi-search"></i>
                            </button>
                        </div>
                    </form>

                    {/* Search Results Info */}
                    {searchTerm && (
                        <div className="mt-2 text-center">
                            <small className="text-muted">
                                <i className="bi bi-search me-1"></i>
                                Searching for: <strong>"{searchTerm}"</strong>
                                {searchTerm && (
                                    <button
                                        className="btn btn-link btn-sm text-decoration-none ms-2 p-0"
                                        onClick={handleClear}
                                    >
                                        <i className="bi bi-x-circle"></i> Clear
                                    </button>
                                )}
                            </small>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default SearchBar;