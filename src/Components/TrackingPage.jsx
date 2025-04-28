import React, { useState } from 'react';
import { Package, Truck, MapPin } from 'lucide-react';
import '../Styles/TrackingPage.css';
import LocationSection from './LocationSection';
import TrackSection from './TrackSection';
import ShippingSection from './ShippingSection.jsx';

const TrackingPage = () => {
    const [activeBox, setActiveBox] = useState('track');

    const services = [
        { id: 'ship', title: 'SHIP', icon: Package },
        { id: 'track', title: 'TRACK', icon: Truck },
        { id: 'locations', title: 'LOCATIONS', icon: MapPin },
    ];


    const renderContent = () => {
        switch (activeBox) {
            case 'track':
                return <TrackSection />
            case 'locations':
                return <LocationSection />
            case 'ship':
                return <ShippingSection />
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
            <div>
                {/* INFO SECTION */}
                <div className="info-section">
                    <h2>Why Delivery Management System?</h2>
                    <p>
                        The Delivery Management System offers a comprehensive platform for customers,
                        delivery service managers, and delivery drivers. Here’s a quick overview:
                    </p>
                    <ul>
                        <li>
                            <strong>Customers:</strong> Choose from a variety of services (UPS, USPS, FedEx, etc.),
                            track orders, and review deliveries with ease.
                        </li>
                        <li>
                            <strong>Delivery Service Manager (Admin):</strong> Register new services, manage deals,
                            and oversee deliveries and delivery personnel.
                        </li>
                        <li>
                            <strong>Delivery Driver:</strong> Pick up orders and deliver them to their destinations,
                            notifying customers upon completion.
                        </li>
                        <li>
                            <strong>Public View:</strong> Browse available services, track orders, apply search & filter,
                            and view ratings & reviews.
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default TrackingPage;