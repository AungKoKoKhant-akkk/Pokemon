import React from 'react';
import './SpritesGallery.css';
import { useLanguage } from '../../../context/LanguageContext';

const SpritesGallery = ({ sprites, name }) => {
    const { language, t } = useLanguage();

    const formatSpriteLabel = (key) => {
        const map = {
            front_default: { en: 'Front (default)', ja: '前（通常）' },
            back_default: { en: 'Back (default)', ja: '後ろ（通常）' },
            front_shiny: { en: 'Front (shiny)', ja: '前（色違い）' },
            back_shiny: { en: 'Back (shiny)', ja: '後ろ（色違い）' },
            front_female: { en: 'Front (female)', ja: '前（メス）' },
            back_female: { en: 'Back (female)', ja: '後ろ（メス）' },
            front_shiny_female: { en: 'Front shiny (female)', ja: '前 色違い（メス）' },
            back_shiny_female: { en: 'Back shiny (female)', ja: '後ろ 色違い（メス）' },
        };
        const entry = map[key];
        if (entry) return entry[language] || entry.en;
        // Fallback: prettify key
        return key.replace(/_/g, ' ');
    };

    if (!sprites) return null;
    const spriteEntries = Object.entries(sprites).filter(([key, value]) => typeof value === 'string' && value);
    return (
        <div className="sprites-gallery card mt-4">
            <div className="card-header bg-info text-white">
                <h5 className="mb-0">{t('detail_sprites_gallery') || 'Sprites Gallery'}</h5>
            </div>
            <div className="card-body d-flex flex-wrap justify-content-center align-items-center">
                {spriteEntries.map(([key, url]) => (
                    <div className="sprite-item text-center m-2" key={key}>
                        <img src={url} alt={`${name} ${formatSpriteLabel(key)}`} className="sprite-img" />
                        <div className="sprite-label text-muted small mt-1">{formatSpriteLabel(key)}</div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default SpritesGallery;
