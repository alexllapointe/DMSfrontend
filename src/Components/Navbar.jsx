import React, { useState } from 'react';
import '../Styles/Navbar.css';
import { Menu, User } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';

const Navbar = ({ userRole, setUserRole }) => {  // ✅ receive from props
    const [isOpen, setIsOpen] = useState(false);
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('userEmail');
        setUserRole(null); // ✅ clear global state
        navigate('/login');
    };

    return (
        <nav className="navbar">
            <div className="nav-container">
                <div className="nav-left">
                    <h1 className="nav-logo">
                        <Link to="/">DMS</Link>
                    </h1>

                    {/* Show dashboard links ONLY for Manager and Driver */}
                    {userRole === 'ROLE_MANAGER' && (
                        <Link to="/manager-dashboard" className="manager-dashboard-link">Manager Dashboard</Link>
                    )}
                    {userRole === 'ROLE_DRIVER' && (
                        <Link to="/driver-dashboard" className="driver-dashboard-link">Driver Dashboard</Link>
                    )}
                    {/* No dashboard link for ROLE_USER */}
                </div>

                <div className="nav-right">
                    {userRole ? (
                        <span onClick={handleLogout} className="logout-link" role="link" tabIndex={0}>Logout</span>
                    ) : (
                        <Link to="/login" className="nav-auth">
                            <User size={20} />
                            <span>Sign Up / Login</span>
                        </Link>
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