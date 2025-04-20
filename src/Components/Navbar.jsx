import React, { useEffect, useState } from 'react';
import '../Styles/Navbar.css';
import { Menu, User, Search } from 'lucide-react';

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [firstName, setFirstName] = useState(null);

    useEffect(() => {
        const storedName = localStorage.getItem('firstName');
        if (storedName) setFirstName(storedName);
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('userEmail');
        localStorage.removeItem('firstName');
        setFirstName(null);
        window.location.reload(); // optional: refresh to reflect UI change
    };

    return (
        <nav className="navbar">
            <div className="nav-container">
                <div className="nav-left">
                    <h1 className="nav-logo">
                        <a href="/">DMS</a>
                    </h1>
                </div>
                <div className="nav-right">
                    {firstName ? (
                        <div className="nav-user">
                            <span>Welcome, {firstName}</span>
                            <button onClick={handleLogout} className="logout-btn">Logout</button>
                        </div>
                    ) : (
                        <a href="/login" className="nav-auth">
                            <User size={20} />
                            <span>Sign Up / Login</span>
                        </a>
                    )}
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