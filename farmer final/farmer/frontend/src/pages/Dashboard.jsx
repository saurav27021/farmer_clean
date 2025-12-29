import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import StatsCard from '../components/StatsCard';
import WeatherWidget from '../components/WeatherWidget';
import QuickActions from '../components/QuickActions';
import { fetchReports, addReport } from '../store/reportSlice';
import { fetchAlerts, hideAlert } from '../store/alertSlice';
import io from 'socket.io-client';

const Dashboard = () => {
    const { user } = useSelector((state) => state.auth);
    const { items: reports } = useSelector((state) => state.reports);
    const { items: alerts } = useSelector((state) => state.alerts);
    const dispatch = useDispatch();

    useEffect(() => {
        // Fetch initial data
        dispatch(fetchReports());
        dispatch(fetchAlerts());

        // Real-time listener
        const socket = io('http://localhost:5000');
        socket.on('newReport', (newReport) => {
            dispatch(addReport(newReport));
        });

        return () => socket.disconnect();
    }, [dispatch]);

    const handleDismissAlert = (id) => {
        if (window.confirm("Remove this alert from your dashboard?")) {
            dispatch(hideAlert(id));
        }
    }

    // Calculate statistics from REAL data
    const totalReports = (reports || []).length;
    const highSeverityReports = (reports || []).filter(r => r.severityLevel === 'High').length;
    const cropsAffected = new Set((reports || []).map(r => r.cropName).filter(Boolean)).size;

    const stats = [
        { title: 'Total Reports', value: totalReports, icon: '📋', color: '#2196f3' },
        { title: 'High Severity', value: highSeverityReports, icon: '⚠️', color: '#d32f2f' },
        { title: 'Total Alerts', value: (alerts || []).length, icon: '🔔', color: '#ff9800' },
        { title: 'Crops Affected', value: cropsAffected, icon: '🌾', color: '#2e7d32' },
    ];

    const featureCards = [
        {
            title: 'Report Pest/Disease',
            path: '/report',
            color: '#4caf50',
            desc: 'Log a new observation',
            icon: '🚨'
        },
        {
            title: 'Real-Time Alerts',
            path: '/alerts',
            color: '#ff9800',
            desc: 'View warnings nearby',
            icon: '🔔'
        },
        // Removed Analytics
        {
            title: 'Expert Solutions',
            path: '/library',
            color: '#9c27b0',
            desc: 'Find solutions for diseases',
            icon: '📚'
        },
    ];

    // Determine Greeting based on time
    const hour = new Date().getHours();
    let greeting = 'Welcome back';
    if (hour < 12) greeting = 'Good Morning';
    else if (hour < 18) greeting = 'Good Afternoon';
    else greeting = 'Good Evening';

    return (
        <div className="dashboard-container" style={{ position: 'relative', minHeight: '100vh', padding: '2rem', overflowX: 'hidden' }}>
            <video className="bg-video" autoPlay loop muted playsInline >
                <source src="/video2.mp4" type="video/mp4" />
            </video>

            <div className="container" style={{ position: 'relative', zIndex: 1 }}>
                {/* Welcome Section */}
                <div className="glass-card welcome-section" style={{ marginBottom: '2rem', padding: '2rem' }}>
                    <h1 style={{ fontSize: '2.5rem', marginBottom: '0.5rem', fontWeight: 700, color: 'var(--white)' }}>
                        {greeting}, {user?.name || 'Farmer'}! 👋
                    </h1>
                    <p style={{ fontSize: '1.1rem', opacity: 0.9, margin: 0, color: 'rgba(255, 255, 255, 0.9)' }}>
                        {user?.location ? `📍 ${user.location}` : ''} • Monitor your crops and stay updated with live insights
                    </p>
                </div>

                {/* Stats Grid */}
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                    gap: '1.5rem',
                    marginBottom: '2rem'
                }}>
                    {stats.map((stat) => (
                        <div key={stat.title} className="glass-card stats-card-glass">
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                                <span style={{ fontSize: '2rem' }}>{stat.icon}</span>
                                <h3 style={{ margin: 0, fontSize: '0.9rem', color: 'rgba(255, 255, 255, 0.8)', textTransform: 'uppercase' }}>{stat.title}</h3>
                            </div>
                            <div className="value" style={{ fontSize: '2.5rem', fontWeight: 700, color: 'var(--white)' }}>
                                {stat.value}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Main Content Grid */}
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                    gap: '1.5rem',
                    marginBottom: '2rem'
                }}>
                    {/* Weather Widget */}
                    <div className="glass-card">
                        <WeatherWidget />
                    </div>

                    {/* Quick Actions */}
                    <div className="glass-card">
                        <QuickActions />
                    </div>
                </div>

                {/* Feature Cards */}
                <div style={{ marginBottom: '2rem' }}>
                    <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem', color: 'var(--white)', textShadow: '0 2px 4px rgba(0,0,0,0.3)' }}>
                        Quick Access
                    </h2>
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                        gap: '1.5rem'
                    }}>
                        {featureCards.map((card) => (
                            <Link to={card.path} key={card.title} style={{ textDecoration: 'none' }}>
                                <div className="glass-card zoom-hover" style={{
                                    borderTop: `4px solid ${card.color}`,
                                    cursor: 'pointer',
                                    padding: '1.5rem',
                                    height: '100%'
                                }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                        <div style={{ fontSize: '2.5rem' }}>{card.icon}</div>
                                        <div style={{ flex: 1 }}>
                                            <h3 style={{ color: 'var(--white)', marginTop: 0, marginBottom: '0.5rem' }}>
                                                {card.title}
                                            </h3>
                                            <p style={{ color: 'rgba(255, 255, 255, 0.8)', margin: 0, fontSize: '0.9rem' }}>
                                                {card.desc}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>

                {/* Activity Feed (Alerts only, Farmers only) */}
                {user?.role !== 'admin' && (
                    <div className="glass-card">
                        <h3 style={{ marginTop: 0, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--white)' }}>
                            📢 Recent Alerts
                        </h3>
                        {(!alerts || alerts.length === 0) ? (
                            <p style={{ color: 'rgba(255, 255, 255, 0.6)', textAlign: 'center' }}>No recent alerts.</p>
                        ) : (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                {alerts.slice(0, 5).map((alert) => (
                                    <div key={alert._id} style={{
                                        background: 'rgba(255, 255, 255, 0.1)',
                                        padding: '1rem',
                                        borderRadius: '8px',
                                        borderLeft: `4px solid ${alert.severity === 'High' ? '#ef4444' : '#ff9800'}`,
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'center',
                                        backdropFilter: 'blur(5px)',
                                        border: '1px solid rgba(255,255,255,0.1)'
                                    }}>
                                        <div>
                                            <strong style={{ display: 'block', color: 'var(--white)' }}>{alert.message}</strong>
                                            <small style={{ color: 'rgba(255, 255, 255, 0.7)' }}>{new Date(alert.sentAt).toLocaleDateString()}</small>
                                        </div>
                                        <button
                                            onClick={() => handleDismissAlert(alert._id)}
                                            title="Hide this alert"
                                            className="btn-icon"
                                            style={{
                                                background: 'rgba(255,255,255,0.2)',
                                                border: 'none',
                                                cursor: 'pointer',
                                                fontSize: '0.9rem',
                                                color: 'white',
                                                borderRadius: '50%',
                                                width: '30px',
                                                height: '30px',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                transition: 'all 0.3s ease'
                                            }}
                                            onMouseEnter={(e) => e.target.style.background = 'rgba(255,0,0,0.5)'}
                                            onMouseLeave={(e) => e.target.style.background = 'rgba(255,255,255,0.2)'}
                                        >
                                            ✕
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Dashboard;
