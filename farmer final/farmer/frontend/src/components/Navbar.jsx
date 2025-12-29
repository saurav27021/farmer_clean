import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../store/authSlice';

const Navbar = () => {
    const { isAuthenticated, user } = useSelector((state) => state.auth);
    const { items: alerts } = useSelector((state) => state.alerts);
    const dispatch = useDispatch();
    const location = useLocation();

    const handleLogout = () => {
        dispatch(logout());
    };

    const unreadAlerts = alerts.filter(a => !a.read).length;

    const isActive = (path) => location.pathname === path;

    return (
        <nav className="navbar">
            <div className="navbar-brand">
                <Link to="/dashboard" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    🌾 <span>CropGuard</span>
                </Link>
            </div>
            <div className="navbar-links">
                {isAuthenticated ? (
                    <>
                        <Link
                            to="/dashboard"
                            style={{
                                background: isActive('/dashboard') ? 'rgba(255,255,255,0.2)' : 'transparent'
                            }}
                        >
                            📊 Dashboard
                        </Link>
                        <Link
                            to="/report"
                            style={{
                                background: isActive('/report') ? 'rgba(255,255,255,0.2)' : 'transparent'
                            }}
                        >
                            🚨 Report
                        </Link>
                        <Link
                            to="/alerts"
                            className="notification-badge"
                            style={{
                                background: isActive('/alerts') ? 'rgba(255,255,255,0.2)' : 'transparent'
                            }}
                        >
                            🔔 Alerts
                            {unreadAlerts > 0 && <span className="badge">{unreadAlerts}</span>}
                        </Link>
                        <Link
                            to="/reports"
                            style={{
                                background: isActive('/reports') ? 'rgba(255,255,255,0.2)' : 'transparent'
                            }}
                        >
                            📋 Farmer Reports
                        </Link>
                        <Link
                            to="/library"
                            style={{
                                background: isActive('/library') ? 'rgba(255,255,255,0.2)' : 'transparent'
                            }}
                        >
                            📚 Expert Solutions
                        </Link>
                        <Link
                            to="/profile"
                            style={{
                                padding: '0.5rem 1rem',
                                background: isActive('/profile') ? 'rgba(255,255,255,0.2)' : 'rgba(255,255,255,0.1)',
                                borderRadius: '8px',
                                fontSize: '0.9rem',
                                textDecoration: 'none',
                                color: 'white'
                            }}
                        >
                            👤 {user?.name?.split(' ')[0] || 'Farmer'}
                        </Link>
                        <button onClick={handleLogout} className="btn-logout">Logout</button>
                    </>
                ) : (
                    <>
                        <Link to="/login">Login</Link>
                        <Link to="/register">Register</Link>
                    </>
                )}
            </div>
        </nav>
    );
};

export default Navbar;
