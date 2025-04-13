import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '../Styles/Navbar.css';
import { Menu } from 'lucide-react';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="navbar">
      <div className="nav-container">
        <h1 className="nav-logo">Delivery Management System</h1>
        <ul className={`nav-links ${isOpen ? 'open' : ''}`}>
          <li><Link to="/tracking">Tracking</Link></li>
          <li><Link to="/login">Login</Link></li>
          <li><Link to="/register">Register</Link></li>
          {/* Removed the Landing link as requested */}
        </ul>
        <div className="hamburger" onClick={() => setIsOpen(!isOpen)}>
          <Menu size={28} />
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
