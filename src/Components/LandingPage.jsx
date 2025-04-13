import React from "react";
import { Link } from "react-router-dom";
import "../Styles/LandingPage.css";

function LandingPage() {
  return (
    <div className="landing">
      {/* HERO SECTION */}
      <div className="hero-section">
        <div className="hero-content">
          <h1 className="hero-title">
            Delivery Management System
          </h1>
          <p className="hero-subtitle">
            A one-stop-shop for customers and business owners to deliver items across the globe 
            with the best possible quotes. Choose from UPS, USPS, FedEx, and more.
          </p>
          {/* CTA area */}
          <div className="cta-container">
            <input 
              type="text" 
              className="cta-input" 
              placeholder="Enter your destination or tracking ID" 
            />
            <Link to="/tracking" className="cta-button">Get Quote</Link>
          </div>
          <div className="cta-links">
            <Link to="/login">Login</Link> or <Link to="/register">Register</Link>
          </div>
        </div>

        {/* Decorative Animated Circle */}
        <div className="animated-bg">
          <div className="moving-circle"></div>
        </div>
      </div>

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
  );
}

export default LandingPage;
