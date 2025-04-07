import React, { useState, useEffect, useRef } from 'react';
import '../Styles/Maps.css';

const Maps = () => {
    const [address, setAddress] = useState("");
    const mapRef = useRef(null);
    const [map, setMap] = useState(null);
    const [marker, setMarker] = useState(null);

    // Load the Google Maps script if it hasn't been loaded already
    useEffect(() => {
        if (!window.google || !window.google.maps) {
            const existingScript = document.querySelector('script[src^="https://maps.googleapis.com/maps/api/js"]');
            if (!existingScript) {
                const script = document.createElement('script');
                script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyB4648Z4QhnHEkZTgButk_erzUydZtZfJM&libraries=places`;
                script.async = true;
                script.defer = true;
                script.onload = initMap;
                document.head.appendChild(script);
            } else {
                existingScript.addEventListener('load', initMap);
            }
        } else {
            initMap();
        }
    }, []);

    const initMap = () => {
        if (mapRef.current && window.google) {
            const mapInstance = new window.google.maps.Map(mapRef.current, {
                center: { lat: 40.1215, lng: -100.4504 },
                zoom: 4,
                disableDefaultUI: true
            });
            setMap(mapInstance);
        }
    };

    const handleInputChange = (e) => {
        setAddress(e.target.value);
    };

    // Geocode the address and drop a marker when the Enter key is pressed
    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && address.trim() !== "" && window.google && map) {
            const geocoder = new window.google.maps.Geocoder();
            geocoder.geocode({ address: address }, (results, status) => {
                if (status === 'OK' && results[0]) {
                    const location = results[0].geometry.location;
                    if (marker) {
                        marker.setMap(null);
                    }
                    const newMarker = new window.google.maps.Marker({
                        map: map,
                        position: location,
                        title: results[0].formatted_address
                    });
                    setMarker(newMarker);
                    map.setCenter(location);
                    map.setZoom(14);
                } else {
                    alert('Geocode was not successful for the following reason: ' + status);
                }
            });
        }
    };

    return (
        <div className="maps-container">
            <input
                type="text"
                className="address-input"
                placeholder="Enter an address"
                value={address}
                onChange={handleInputChange}
                onKeyPress={handleKeyPress}
            />
            <div ref={mapRef} className="map-box"></div>
        </div>
    );
};

export default Maps;