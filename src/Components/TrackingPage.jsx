import React, { useState } from 'react';
import { Package, Truck, MapPin } from 'lucide-react';
import '../Styles/TrackingPage.css';

const TrackingPage = () => {
    const [activeBox, setActiveBox] = useState('track');
    const [trackingId, setTrackingId] = useState('');
    const [trackedId, setTrackedId] = useState(null);

    const services = [
        { id: 'rate', title: 'RATE & SHIP', icon: Package },
        { id: 'track', title: 'TRACK', icon: Truck },
        { id: 'locations', title: 'LOCATIONS', icon: MapPin },
    ];

    const handleTrack = () => {
        setTrackedId(trackingId.trim());
    };

    const renderContent = () => {
        switch (activeBox) {
            case 'track':
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
                                <a href="">MULTIPLE TRACKING NUMBERS?</a>
                                <a href="">NEED HELP?</a>
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
            case 'locations':
                return (
                    <div className="locations-section">
                        <ul>
                            <li><strong>Location 1:</strong> 123 Main St, Bloomington, IN</li>
                            <li><strong>Location 2:</strong> 456 Elm St, Indianapolis, IN</li>
                            <li><strong>Location 3:</strong> 789 Oak St, Evansville, IN</li>
                        </ul>
                    </div>
                );
            case 'rate':
                return <div className="rate-section">{/* Blank for now */}</div>;
            default:
                return null;
        }
    };

    return (
        <div className="app-container">
            {/* Hero Section */}
            <div className="hero">
                <div className="hero-overlay"></div>
            </div>

            <div className="content">
                <div className="content-box">
                    <div className="services-grid">
                        {services.map((service) => {
                            const Icon = service.icon;
                            return (
                                <div
                                    key={service.id}
                                    className={`service-box ${activeBox === service.id ? 'active' : ''}`}
                                    onClick={() => setActiveBox(service.id)}
                                >
                                    <div className="service-header">
                                        <Icon className="service-icon" />
                                        <h2 className="service-title">{service.title}</h2>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {renderContent()}
                </div>
            </div>
        </div>
    );
};

export default TrackingPage;