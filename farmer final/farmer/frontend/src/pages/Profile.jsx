import React from 'react';
import { useSelector } from 'react-redux';

const Profile = () => {
    const { user } = useSelector((state) => state.auth);

    if (!user) {
        return <div style={{ color: 'white', textAlign: 'center', marginTop: '2rem' }}>Loading profile...</div>;
    }

    return (
        <div className="dashboard-container" style={{ paddingTop: '2rem' }}>
            <div className="glass-card" style={{ maxWidth: '600px', margin: '0 auto', padding: '2rem' }}>
                <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                    <div style={{
                        fontSize: '5rem',
                        marginBottom: '1rem',
                        background: 'rgba(255, 255, 255, 0.1)',
                        width: '120px',
                        height: '120px',
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        margin: '0 auto 1rem'
                    }}>
                        👨‍🌾
                    </div>
                    <h2 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>{user.name}</h2>
                    <span style={{
                        background: 'rgba(46, 125, 50, 0.2)',
                        color: '#4caf50',
                        padding: '0.25rem 0.75rem',
                        borderRadius: '15px',
                        fontSize: '0.9rem',
                        border: '1px solid rgba(46, 125, 50, 0.4)'
                    }}>
                        {user.role === 'admin' ? '👨‍💼 Admin' : '👨‍🌾 Farmer'}
                    </span>
                </div>

                <div style={{ display: 'grid', gap: '1.5rem' }}>
                    <div style={{ background: 'rgba(0,0,0,0.2)', padding: '1rem', borderRadius: '8px' }}>
                        <label style={{ display: 'block', color: 'rgba(255,255,255,0.6)', fontSize: '0.9rem', marginBottom: '0.25rem' }}>Email Address</label>
                        <div style={{ fontSize: '1.1rem' }}>{user.email}</div>
                    </div>

                    <div style={{ background: 'rgba(0,0,0,0.2)', padding: '1rem', borderRadius: '8px' }}>
                        <label style={{ display: 'block', color: 'rgba(255,255,255,0.6)', fontSize: '0.9rem', marginBottom: '0.25rem' }}>Location</label>
                        <div style={{ fontSize: '1.1rem' }}>📍 {user.location}</div>
                    </div>

                    <div style={{ background: 'rgba(0,0,0,0.2)', padding: '1rem', borderRadius: '8px' }}>
                        <label style={{ display: 'block', color: 'rgba(255,255,255,0.6)', fontSize: '0.9rem', marginBottom: '0.25rem' }}>Account ID</label>
                        <div style={{ fontSize: '0.9rem', fontFamily: 'monospace' }}>{user.id || user._id}</div>
                    </div>

                    <div style={{ background: 'rgba(0,0,0,0.2)', padding: '1rem', borderRadius: '8px' }}>
                        <label style={{ display: 'block', color: 'rgba(255,255,255,0.6)', fontSize: '0.9rem', marginBottom: '0.25rem' }}>Member Since</label>
                        <div style={{ fontSize: '1.1rem' }}>📅 {new Date().getFullYear()}</div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;
