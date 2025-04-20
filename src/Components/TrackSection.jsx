import React, { useState } from 'react';

const TrackSection = () => {
    const [trackingId, setTrackingId] = useState('');
    const [trackedId, setTrackedId] = useState(null);

    const handleTrack = () => {
        setTrackedId(trackingId.trim());
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

            {trackedId === '123' && (
                <>
                    <div className="status-box">
                        <h2>Delivered</h2>
                        <p>Thursday 12/05/2019 at 1:06 pm</p>
                    </div>
                    <div className="progress-bar"></div>
                    <div className="map-container">
                        <iframe
                            title="Luddy School Map"
                            src="https://www.google.com/maps/embed/v1/place?key=AIzaSyB4648Z4QhnHEkZTgButk_erzUydZtZfJM&q=Luddy+School+of+Informatics,Bloomington,IN"
                            width="100%"
                            height="300"
                            style={{ border: 0, borderRadius: '10px', marginTop: '1rem' }}
                            allowFullScreen
                        ></iframe>
                    </div>
                </>
            )}
        </div>
    );
};

export default TrackSection;