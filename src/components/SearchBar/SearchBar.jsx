import React, { useState } from 'react';
import { useSearch } from '../../context/SearchContext';
import { useLanguage } from '../../context/LanguageContext';
import "./SearchBar.css"

// Updated: Fixed duplicate buttons issue - SIMPLIFIED VERSION
const SearchBar = () => {
    const { searchTerm, updateSearch, clearSearch } = useSearch();
    const { t, language } = useLanguage();
    const [localSearchTerm, setLocalSearchTerm] = useState(searchTerm);

    const handleInputChange = (e) => {
        const value = e.target.value;
        setLocalSearchTerm(value);
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
                    <div className="position-relative">
                        <input
                            className="form-control form-control-lg"
                            type="text"
                            placeholder={t('search_placeholder')}
                            aria-label="Search Pokemon"
                            value={localSearchTerm}
                            onChange={handleInputChange}
                            autoComplete="off"
                            style={{
                                borderRadius: '2rem',
                                paddingLeft: '50px',
                                paddingRight: localSearchTerm ? '50px' : '20px',
                                background: 'linear-gradient(90deg, #e0eafc 0%, #cfdef3 100%)',
                                border: 'none',
                                boxShadow: '0 4px 16px rgba(0, 0, 0, 0.08)'
                            }}
                        />
                        {/* Search Button */}
                        <button
                            className="btn"
                            type="button"
                            disabled
                            style={{
                                position: 'absolute',
                                left: '10px',
                                top: '50%',
                                transform: 'translateY(-50%)',
                                border: 'none',
                                background: 'transparent',
                                color: '#6c757d',
                                cursor: 'default'
                            }}
                        >
                            🔍
                        </button>
                        {/* Clear Button */}
                        {localSearchTerm && (
                            <button
                                className="btn btn-sm"
                                type="button"
                                onClick={handleClear}
                                title="Clear search"
                                style={{
                                    position: 'absolute',
                                    right: '10px',
                                    top: '50%',
                                    transform: 'translateY(-50%)',
                                    border: 'none',
                                    background: 'rgba(108, 117, 125, 0.2)',
                                    borderRadius: '50%',
                                    width: '30px',
                                    height: '30px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center'
                                }}
                            >
                                ✕
                            </button>
                        )}
                    </div>

                    {/* Search Results Info */}
                    {searchTerm && (
                        <div className="mt-2 text-center">
                            <small className="text-muted">
                                🔍 {language === 'en' ? 'Searching for:' : '検索中:'} <strong>"{searchTerm}"</strong>
                            </small>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default SearchBar;