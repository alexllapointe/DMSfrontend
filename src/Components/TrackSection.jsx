import React, { useState } from 'react';
import '../Styles/TrackSection.css';

const TrackSection = () => {
    const [trackingId, setTrackingId] = useState('');
    const [trackingData, setTrackingData] = useState(null);
    const [error, setError] = useState('');

    const handleTrack = async () => {
        const trimmedId = trackingId.trim();
        if (!trimmedId) {
            setError('Please enter a tracking ID');
            return;
        }

        try {
            const response = await fetch(`https://dmsservice-latest.onrender.com/track/byId?trackingId=${trimmedId}`);

            if (response.ok) {
                const data = await response.json();
                setTrackingData(data);
                setError('');
            } else {
                setTrackingData(null);
                setError('No package found with this tracking ID');
            }
        } catch (err) {
            setTrackingData(null);
            setError('Error fetching tracking information');
        }
    };

    return (
        <div className="tracking-section">
            <div className="tracking-label">TRACKING ID</div>
            <div className="tracking-input-container">
                <input
                    type="text"
                    className="tracking-input"
                    placeholder="Enter tracking number"
                    value={trackingId}
                    onChange={(e) => setTrackingId(e.target.value)}
                />
                <button className="track-button" onClick={handleTrack}>TRACK</button>
            </div>

            <div className="tracking-links-container">
                <div className="divider"></div>
                <div className="tracking-links">
                    <a href="/support">MULTIPLE TRACKING NUMBERS?</a>
                    <a href="/support">NEED HELP?</a>
                </div>
            </div>

            {error && (
                <div className="error-message">
                    {error}
                </div>
            )}

            {trackingData && (
                <>
                    <div className="status-box">
                        <h2>Last updated: <span>{trackingData.currentLocation}</span></h2>
                        <p>{trackingData.lastUpdated}</p>
                    </div>
                    <div className="progress-bar"></div>
                </>
            )}
        </div>
    );
};

export default TrackSection;