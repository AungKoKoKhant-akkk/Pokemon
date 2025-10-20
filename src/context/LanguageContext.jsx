import React, { createContext, useContext } from 'react';

// Hooks
import { useLocalStorage } from '../hooks';

// Constants  
import { STORAGE_KEYS, LANGUAGES, UI_TRANSLATIONS } from '../constants';

const LanguageContext = createContext();

export const useLanguage = () => {
    const context = useContext(LanguageContext);
    if (!context) {
        throw new Error('useLanguage must be used within a LanguageProvider');
    }
    return context;
};

export const LanguageProvider = ({ children }) => {
    // Use custom hook for language persistence
    const [language, setLanguage] = useLocalStorage(STORAGE_KEYS.LANGUAGE, LANGUAGES.EN);

    const toggleLanguage = () => {
        setLanguage(prevLang => prevLang === LANGUAGES.EN ? LANGUAGES.JA : LANGUAGES.EN);
    };

    // Get translated text for current language
    const t = (key) => {
        return UI_TRANSLATIONS[language]?.[key] || UI_TRANSLATIONS[LANGUAGES.EN]?.[key] || key;
    };

    // Get Pokémon name in current language
    const getPokemonName = (pokemon, species) => {
        if (!species?.names) return pokemon?.name || '';

        const localizedName = species.names.find(n => n.language.name === language);
        return localizedName?.name || pokemon?.name || '';
    };

    // Get Pokémon description in current language
    const getPokemonDescription = (species) => {
        if (!species?.flavor_text_entries) return '';

        const localizedDesc = species.flavor_text_entries.find(
            entry => entry.language.name === language
        );
        return localizedDesc?.flavor_text?.replace(/\f/g, ' ') || '';
    };

    // Get type name in current language
    const getTypeName = (typeName) => {
        const typeKey = `type_${typeName}`;
        return t(typeKey);
    };

    const isEnglish = language === LANGUAGES.EN;
    const isJapanese = language === LANGUAGES.JA;

    const value = {
        language,
        setLanguage,
        toggleLanguage,
        t,
        getPokemonName,
        getPokemonDescription,
        getTypeName,
        isEnglish,
        isJapanese
    };

    return (
        <LanguageContext.Provider value={value}>
            {children}
        </LanguageContext.Provider>
    );
};

export default LanguageContext;
