import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../Styles/LocationSection.css';

const LocationSection = () => {
    const navigate = useNavigate();
    const locations = [
        {
            city: 'Bloomington',
            name: 'Bloomington Distribution Center',
            address: '420 S College Ave, Bloomington, IN 47403',
        },
        {
            city: 'Bloomington',
            name: 'Bloomington East Hub',
            address: '601 E 10th St, Bloomington, IN 47408',
        },
        {
            city: 'Indianapolis',
            name: 'Indy North Hub',
            address: '1125 Broad Ripple Ave, Indianapolis, IN 46220',
        },
        {
            city: 'Indianapolis',
            name: 'Downtown Processing Center',
            address: '50 S Meridian St, Indianapolis, IN 46204',
        },
    ];

    const handleClick = (name) => {
        navigate(`/locations/${encodeURIComponent(name)}`);
    };

    return (
        <div className="location-section">
            <h2 className="location-header">Available Locations</h2>
            <div className="location-list">
                {locations.map((loc, index) => (
                    <div className="location-card" key={index} onClick={() => handleClick(loc.name)}>
                        <h3 className="location-name">{loc.name}</h3>
                        <p className="location-address">{loc.address}</p>
                        <p className="location-city">{loc.city}, IN</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default LocationSection;
