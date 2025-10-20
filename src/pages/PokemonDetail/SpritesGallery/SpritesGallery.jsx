import React from 'react';
import './SpritesGallery.css';

const SpritesGallery = ({ sprites, name }) => {
    if (!sprites) return null;
    const spriteEntries = Object.entries(sprites).filter(([key, value]) => typeof value === 'string' && value);
    return (
        <div className="sprites-gallery card mt-4">
            <div className="card-header bg-info text-white">
                <h5 className="mb-0">Sprites Gallery</h5>
            </div>
            <div className="card-body d-flex flex-wrap justify-content-center align-items-center">
                {spriteEntries.map(([key, url]) => (
                    <div className="sprite-item text-center m-2" key={key}>
                        <img src={url} alt={`${name} ${key}`} className="sprite-img" />
                        <div className="sprite-label text-muted small mt-1">{key.replace(/_/g, ' ')}</div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default SpritesGallery;
