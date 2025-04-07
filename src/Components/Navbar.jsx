import React, { useState } from 'react';
import '../Styles/Navbar.css';
import { Menu, User, Search } from 'lucide-react';

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <nav className="navbar">
            <div className="nav-container">
                <div className="nav-left">
                    <h1 className="nav-logo">
                        <a href="/">DMS</a>
                    </h1>
                    <ul className={`nav-links ${isOpen ? 'open' : ''}`}>
                        <li>
                            <a href="/maps">Maps</a>
                        </li>
                    </ul>
                </div>
                <div className="nav-right">
                    <a href="/login" className="nav-auth">
                        <User size={20} />
                        <span>Sign Up / Login</span>
                    </a>
                    <a href="/search" className="nav-search">
                        <Search size={20} />
                    </a>
                </div>
                <div className="hamburger" onClick={() => setIsOpen(!isOpen)}>
                    <Menu size={28} />
                </div>
            </div>
        </nav>
    );
};

export default Navbar;