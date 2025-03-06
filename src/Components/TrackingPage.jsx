import React, { useState } from 'react';
import { Package, Truck, MapPin } from 'lucide-react';
import '../Styles/TrackingPage.css';

const TrackingPage = () => {
    const [activeBox, setActiveBox] = useState(null);
    const [trackingId, setTrackingId] = useState('');

    const services = [
        {
            id: 'rate',
            title: 'RATE & SHIP',
            icon: Package,
        },
        {
            id: 'track',
            title: 'TRACK',
            icon: Truck,
        },
        {
            id: 'locations',
            title: 'LOCATIONS',
            icon: MapPin,
        }
    ];

    return (
        <div className="app-container">
            {/* Hero Section */}
            <div className="hero">
                <div className="hero-overlay">
                </div>
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
                                    onClick={() => setActiveBox(activeBox === service.id ? null : service.id)}
                                >
                                    <div className="service-header">
                                        <Icon className="service-icon" />
                                        <h2 className="service-title">{service.title}</h2>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

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
                            <button className="track-button">TRACK</button>
                        </div>

                        <div className="tracking-links-container">
                            <div className="divider"></div>
                            <div className="tracking-links">
                                <a href="#">MULTIPLE TRACKING NUMBERS?</a>
                                <a href="#">NEED HELP?</a>
                            </div>
                        </div>

                        <div className="status-box">
                            <h2>Delivered</h2>
                            <p>Thursday 12/05/2019 at 1:06 pm</p>
                        </div>
                        <div className="progress-bar"></div>
                    </div>
                </div>
            </div>
        </div>
    );
};


export default TrackingPage;