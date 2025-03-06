import React, { useState } from 'react';
import '../Styles/Navbar.css';
import { Menu } from 'lucide-react';

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <nav className="navbar">
            <div className="nav-container">
                <h1 className="nav-logo">Delivery Management System</h1>

                <ul className={`nav-links ${isOpen ? 'open' : ''}`}>
                    <li><a href="/tracking">Tracking</a></li>
                    <li><a href="/landing">Landing</a></li>
                    <li><a href="/random">Page 3</a></li>
                </ul>

                <div className="hamburger" onClick={() => setIsOpen(!isOpen)}>
                    <Menu size={28} />
                </div>
            </div>
        </nav>
    );
};

export default Navbar;