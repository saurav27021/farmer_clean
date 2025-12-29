import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchAlerts, addAlert, createAlert, markAllRead, deleteAlert } from "../store/alertSlice";
import io from 'socket.io-client';

const Alerts = () => {
    const dispatch = useDispatch();
    const { items: alerts, loading } = useSelector((state) => state.alerts);
    const { user } = useSelector((state) => state.auth);

    const [filter, setFilter] = useState("all");
    const [search, setSearch] = useState("");

    // Admin Form State
    const [showAdminForm, setShowAdminForm] = useState(false);
    const [newAlert, setNewAlert] = useState({
        message: '',
        severity: 'Medium',
        affectedCrop: '',
        targetLocation: 'All'
    });

    useEffect(() => {
        dispatch(fetchAlerts());
        // Mark all as read when visiting the page
        dispatch(markAllRead());

        const socket = io('http://localhost:5000');

        socket.on('newAlert', (alert) => {
            dispatch(addAlert(alert));
        });

        return () => socket.disconnect();
    }, [dispatch]);

    const handleAdminSubmit = (e) => {
        e.preventDefault();
        dispatch(createAlert(newAlert));
        setShowAdminForm(false);
        setNewAlert({ message: '', severity: 'Medium', affectedCrop: '', targetLocation: 'All' });
    };

    const handleDelete = (id) => {
        if (window.confirm('Delete this alert?')) {
            dispatch(deleteAlert(id));
        }
    };

    const filteredAlerts = alerts
        .filter((alert) => {
            if (filter === "high") return alert.severity === "High";
            return true;
        })
        .filter((alert) =>
            alert.message.toLowerCase().includes(search.toLowerCase()) ||
            alert.affectedCrop?.toLowerCase().includes(search.toLowerCase())
        );

    return (
        <div style={{ position: 'relative', minHeight: 'calc(100vh - 64px)' }}>
            <div style={{
                position: 'fixed',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                zIndex: -1,
                backgroundColor: 'rgba(0, 0, 0, 0.6)' // Darker overlay for alerts
            }}></div>
            <video
                autoPlay
                loop
                muted
                playsInline
                style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    zIndex: -2
                }}
            >
                <source src="/alert.mp4" type="video/mp4" />
            </video>

            <div className="container" style={{ paddingBottom: '4rem', position: 'relative', zIndex: 1 }}>
                <header style={{ marginBottom: '2.5rem', textAlign: 'center' }}>
                    <h1 style={{
                        color: '#ff5252',
                        textShadow: '0 0 20px rgba(255, 82, 82, 0.4)',
                        fontSize: '3rem',
                        fontWeight: '800',
                        letterSpacing: '2px',
                        marginBottom: '0.5rem'
                    }}>
                        📢 Real-Time Alerts
                    </h1>
                    <p style={{
                        color: 'rgba(255, 255, 255, 0.9)',
                        fontSize: '1.2rem',
                        background: 'rgba(255, 82, 82, 0.1)',
                        display: 'inline-block',
                        padding: '0.5rem 1.5rem',
                        borderRadius: '30px',
                        border: '1px solid rgba(255, 82, 82, 0.2)',
                        backdropFilter: 'blur(4px)'
                    }}>
                        Stay updated with the latest pest and disease warnings.
                    </p>
                </header>

                <div className="header-flex" style={{ justifyContent: 'center', marginBottom: '2rem' }}>
                    {user?.role === 'admin' && (
                        <button
                            className="btn-primary"
                            onClick={() => setShowAdminForm(!showAdminForm)}
                            style={{
                                background: showAdminForm ? '#444' : '#d32f2f',
                                border: 'none',
                                padding: '0.8rem 2rem',
                                fontSize: '1.1rem',
                                boxShadow: '0 4px 15px rgba(0,0,0,0.3)'
                            }}
                        >
                            {showAdminForm ? '✕ Cancel' : '➕ Broadcast New Alert'}
                        </button>
                    )}
                </div>

                {showAdminForm && (
                    <div className="glass-card" style={{
                        marginBottom: '3rem',
                        borderLeft: '5px solid #ff5252',
                        background: 'linear-gradient(135deg, rgba(40, 40, 40, 0.9), rgba(20, 20, 20, 0.95))',
                        animation: 'slideDown 0.3s ease'
                    }}>
                        <style>{`@keyframes slideDown { from { transform: translateY(-20px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }`}</style>
                        <h3 style={{ color: '#ff8a80', marginTop: 0 }}>Broadcast New Alert</h3>
                        <form onSubmit={handleAdminSubmit} style={{ display: 'grid', gap: '1.5rem' }}>
                            <input
                                type="text"
                                placeholder="Alert Message"
                                value={newAlert.message}
                                onChange={(e) => setNewAlert({ ...newAlert, message: e.target.value })}
                                required
                                style={{
                                    padding: '1rem',
                                    borderRadius: '8px',
                                    border: '1px solid rgba(255,255,255,0.2)',
                                    background: 'rgba(0,0,0,0.3)',
                                    color: 'white',
                                    fontSize: '1.1rem'
                                }}
                            />
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                <select
                                    value={newAlert.severity}
                                    onChange={(e) => setNewAlert({ ...newAlert, severity: e.target.value })}
                                    style={{
                                        padding: '1rem',
                                        borderRadius: '8px',
                                        border: '1px solid rgba(255,255,255,0.2)',
                                        background: 'rgba(0,0,0,0.3)',
                                        color: 'white'
                                    }}
                                >
                                    <option value="Low" style={{ color: 'black' }}>Low Severity</option>
                                    <option value="Medium" style={{ color: 'black' }}>Medium Severity</option>
                                    <option value="High" style={{ color: 'black' }}>High Severity</option>
                                </select>
                                <input
                                    type="text"
                                    placeholder="Affected Crop (Optional)"
                                    value={newAlert.affectedCrop}
                                    onChange={(e) => setNewAlert({ ...newAlert, affectedCrop: e.target.value })}
                                    style={{
                                        padding: '1rem',
                                        borderRadius: '8px',
                                        border: '1px solid rgba(255,255,255,0.2)',
                                        background: 'rgba(0,0,0,0.3)',
                                        color: 'white'
                                    }}
                                />
                            </div>
                            <button type="submit" className="btn-primary" style={{ background: '#ff5252', fontSize: '1.1rem', fontWeight: 'bold' }}>Broadcast Alert</button>
                        </form>
                    </div>
                )}

                {/* Controls */}
                <div className="glass-card" style={{
                    marginBottom: "3rem",
                    display: "flex",
                    gap: "1rem",
                    flexWrap: "wrap",
                    padding: '1rem',
                    background: 'rgba(0, 0, 0, 0.4)',
                    border: '1px solid rgba(255, 255, 255, 0.1)'
                }}>
                    <div style={{ flex: 1, position: 'relative' }}>
                        <span style={{ position: 'absolute', left: '15px', top: '50%', transform: 'translateY(-50%)', fontSize: '1.2rem' }}>🔍</span>
                        <input
                            type="text"
                            placeholder="Search alerts..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            style={{
                                width: '100%',
                                padding: "0.8rem 0.8rem 0.8rem 2.8rem",
                                borderRadius: "30px",
                                border: "1px solid rgba(255,255,255,0.2)",
                                background: 'rgba(255,255,255,0.05)',
                                color: 'white',
                                outline: 'none'
                            }}
                        />
                    </div>
                    <select
                        value={filter}
                        onChange={(e) => setFilter(e.target.value)}
                        style={{
                            padding: "0.8rem 2rem",
                            borderRadius: "30px",
                            border: "1px solid rgba(255,255,255,0.2)",
                            background: 'rgba(255,255,255,0.05)',
                            color: 'white',
                            cursor: 'pointer'
                        }}
                    >
                        <option value="all" style={{ color: 'black' }}>All Alerts</option>
                        <option value="high" style={{ color: 'black' }}>High Severity Only</option>
                    </select>
                </div>

                {loading ? <p style={{ textAlign: 'center', color: 'white' }}>Loading alerts...</p> : (
                    <div className="alerts-list">
                        {filteredAlerts.length === 0 ? <p style={{ textAlign: 'center', color: 'rgba(255,255,255,0.6)', fontSize: '1.2rem' }}>No alerts found matching your criteria.</p> : filteredAlerts.map((alert) => (
                            <div
                                key={alert._id}
                                className={`glass-card ${alert.read ? "read" : "unread"}`}
                                style={{
                                    padding: "2rem",
                                    marginBottom: "1.5rem",
                                    borderLeft: `6px solid ${alert.severity === "High" ? "#ff5252" : alert.severity === "Medium" ? "#ffa726" : "#66bb6a"
                                        }`,
                                    position: 'relative',
                                    background: 'linear-gradient(135deg, rgba(30,30,30,0.85), rgba(15,15,15,0.95))',
                                    boxShadow: "0 8px 32px 0 rgba(0, 0, 0, 0.5)",
                                    transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                                    border: '1px solid rgba(255,255,255,0.05)'
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.transform = 'translateX(10px)';
                                    e.currentTarget.style.boxShadow = `0 10px 40px ${alert.severity === "High" ? "rgba(255, 82, 82, 0.15)" : "rgba(0,0,0,0.5)"}`;
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.transform = 'translateX(0)';
                                    e.currentTarget.style.boxShadow = "0 8px 32px 0 rgba(0, 0, 0, 0.5)";
                                }}
                            >
                                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "1rem", alignItems: 'center' }}>
                                    <span
                                        style={{
                                            fontWeight: "800",
                                            color: alert.severity === "High" ? "#ff5252" : alert.severity === "Medium" ? "#ffa726" : "#66bb6a",
                                            textTransform: "uppercase",
                                            fontSize: "0.85rem",
                                            letterSpacing: '1px',
                                            background: 'rgba(255,255,255,0.05)',
                                            padding: '0.3rem 0.8rem',
                                            borderRadius: '20px',
                                            border: `1px solid ${alert.severity === "High" ? "rgba(255, 82, 82, 0.3)" : "rgba(255,255,255,0.1)"}`
                                        }}
                                    >
                                        {alert.severity === "High" && "🔥 "}
                                        {alert.severity} Severity
                                    </span>
                                    <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                                        <span style={{ fontSize: "0.9rem", color: "rgba(255,255,255,0.5)" }}>
                                            {new Date(alert.sentAt).toLocaleDateString()}
                                        </span>
                                        {user?.role === 'admin' && (
                                            <button
                                                onClick={() => handleDelete(alert._id)}
                                                style={{
                                                    background: 'rgba(255, 82, 82, 0.1)',
                                                    border: 'none',
                                                    cursor: 'pointer',
                                                    fontSize: '1.2rem',
                                                    color: '#ff5252',
                                                    padding: '0.4rem',
                                                    borderRadius: '50%',
                                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                    transition: 'all 0.2s'
                                                }}
                                                onMouseEnter={(e) => { e.target.style.background = '#ff5252'; e.target.style.color = 'white'; }}
                                                onMouseLeave={(e) => { e.target.style.background = 'rgba(255, 82, 82, 0.1)'; e.target.style.color = '#ff5252'; }}
                                                title="Delete Alert"
                                            >
                                                🗑️
                                            </button>
                                        )}
                                    </div>
                                </div>
                                <h3 style={{ margin: "0 0 0.8rem 0", fontSize: '1.4rem', color: 'white', lineHeight: '1.4' }}>{alert.message}</h3>
                                {alert.affectedCrop && (
                                    <p style={{ margin: 0, color: "rgba(255,255,255,0.7)", fontSize: "1rem", display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                        🌱 Affected Crop: <strong style={{ color: '#81c784' }}>{alert.affectedCrop}</strong>
                                    </p>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Alerts;
