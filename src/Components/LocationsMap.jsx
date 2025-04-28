import React from 'react';
import { useParams } from 'react-router-dom';
import '../Styles/LocationsMap.css';

const locations = [
    {
        name: 'Bloomington Distribution Center',
        address: '420 S College Ave, Bloomington, IN 47403',
    },
    {
        name: 'Bloomington East Hub',
        address: '601 E 10th St, Bloomington, IN 47408',
    },
    {
        name: 'Indy North Hub',
        address: '1125 Broad Ripple Ave, Indianapolis, IN 46220',
    },
    {
        name: 'Downtown Processing Center',
        address: '50 S Meridian St, Indianapolis, IN 46204',
    },
];

const LocationsMap = () => {
    const { name } = useParams();
    const decodedName = decodeURIComponent(name);
    const selectedLocation = locations.find((loc) => loc.name === decodedName);

    if (!selectedLocation) {
        return <p style={{ padding: '2rem' }}>Location not found.</p>;
    }

    const encodedAddress = encodeURIComponent(selectedLocation.address);

    return (
        <div className="locations-map-container">
            <h2 className="location-map-title">{selectedLocation.name}</h2>
            <p className="location-map-address">{selectedLocation.address}</p>
            <iframe
                title={selectedLocation.name}
                src={`https://www.google.com/maps/embed/v1/place?key=AIzaSyB4648Z4QhnHEkZTgButk_erzUydZtZfJM&q=${encodedAddress}`}
                className="location-map-iframe"
                allowFullScreen
                loading="lazy"
            ></iframe>
        </div>
    );
};

export default LocationsMap;