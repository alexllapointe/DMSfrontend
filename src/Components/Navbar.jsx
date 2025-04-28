import React, { useState, useEffect } from 'react';
import '../Styles/Navbar.css';
import { Menu, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [userEmail, setUserEmail] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            try {
                const decoded = jwtDecode(token); // ✅ use jwtDecode instead of jwt_decode
                setUserEmail(decoded.sub); // decoded.sub = email from Spring JWT
            } catch (err) {
                console.error('Invalid token:', err);
                localStorage.removeItem('token');
            }
        }
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('userEmail');
        setUserEmail(null);
        navigate('/login');
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
                    {userEmail ? (
                        <div className="nav-user">
                            <span>{userEmail}</span>
                            <button onClick={handleLogout} className="logout-btn">Logout</button>
                        </div>
                    ) : (
                        <a href="/login" className="nav-auth">
                            <User size={20} />
                            <span>Sign Up / Login</span>
                        </a>
                    )}
                </div>
                <div className="hamburger" onClick={() => setIsOpen(!isOpen)}>
                    <Menu size={28} />
                </div>
            </div>
        </nav>
    );
};

export default Navbar;