
import React, { useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [devLink, setDevLink] = useState(null); // State for simulation link

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('');
        setError('');
        setDevLink(null);

        try {
            const res = await axios.post('http://localhost:5000/api/auth/forgotpassword', { email });
            setMessage(res.data.data);

            // Check for simulation link (Dev Mode)
            if (res.data.devLink) {
                setDevLink(res.data.devLink);
            }
        } catch (err) {
            setError(err.response?.data?.msg || "Something went wrong");
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-card">
                <h2 style={{ textAlign: 'center', marginBottom: '1rem' }}>Forgot Password</h2>
                <p style={{ textAlign: 'center', color: '#666', marginBottom: '2rem' }}>Enter your email to receive a reset link.</p>

                {message && <div style={{ color: '#2e7d32', background: '#e8f5e9', padding: '1rem', borderRadius: '4px', marginBottom: '1rem', textAlign: 'center' }}>{message}</div>}

                {/* Simulation Link Display */}
                {devLink && (
                    <div style={{ marginTop: '1rem', marginBottom: '1rem', padding: '1rem', border: '1px dashed #2196f3', borderRadius: '8px', background: '#e3f2fd', textAlign: 'center' }}>
                        <p style={{ marginBottom: '0.5rem', color: '#0d47a1', fontSize: '0.9rem', fontWeight: 'bold' }}>⚠️ EMAIL SIMULATION MODE (No Credentials Configured)</p>
                        <p style={{ marginBottom: '0.5rem', fontSize: '0.85rem' }}>Since no real email is configured, click the link below to simulate opening the email:</p>
                        <a href={devLink} style={{ display: 'block', padding: '0.5rem', background: '#2196f3', color: 'white', textDecoration: 'none', borderRadius: '4px', fontWeight: 'bold' }}>
                            🔗 Click Here to Reset Password
                        </a>
                    </div>
                )}

                {error && <div style={{ color: '#d32f2f', background: '#ffebee', padding: '1rem', borderRadius: '4px', marginBottom: '1rem', textAlign: 'center' }}>{error}</div>}

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Email Address</label>
                        <input
                            type="email"
                            placeholder="farmer@example.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <button type="submit" className="btn-primary" style={{ width: '100%' }}>Send Reset Link</button>
                </form>
                <div style={{ textAlign: 'center', marginTop: '1.5rem' }}>
                    <Link to="/login" style={{ color: '#667eea' }}>← Back to Login</Link>
                </div>
            </div>
        </div>
    );
};

export default ForgotPassword;
