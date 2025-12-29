import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { register, clearError } from '../store/authSlice';

const Register = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
        role: 'farmer',
        location: ''
    });
    const [showPassword, setShowPassword] = useState(false);

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { loading, error, isAuthenticated } = useSelector((state) => state.auth);

    useEffect(() => {
        if (isAuthenticated) {
            navigate('/dashboard');
        }
        return () => { dispatch(clearError()); }
    }, [isAuthenticated, navigate, dispatch]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const [successMsg, setSuccessMsg] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSuccessMsg('');
        if (formData.password !== formData.confirmPassword) {
            alert("Passwords don't match");
            return;
        }

        try {
            await dispatch(register({
                name: formData.name,
                email: formData.email,
                password: formData.password,
                role: formData.role,
                location: formData.location
            })).unwrap();

            // Success! The useEffect will now redirect to /dashboard because isAuthenticated will be true
        } catch (err) {
            console.error(err);
        }
    };

    const commonLocations = ['Village 1', 'Village 2', 'Village 3', 'City Center', 'North Fields', 'South Fields'];

    return (
        <div className="auth-container">
            <video className="bg-video" autoPlay loop muted playsInline>
                <source src="/video1.mp4" type="video/mp4" />
            </video>
            <div className="auth-card">
                <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                    <div style={{ fontSize: '4rem', marginBottom: '0.5rem' }}>🌾</div>
                    <h2 style={{ marginBottom: '0.5rem', color: 'white' }}>Join CropGuard</h2>
                    <p style={{ color: 'rgba(255, 255, 255, 0.8)', margin: 0 }}>
                        Create your account and start protecting your crops
                    </p>
                </div>
                {error && <div style={{ color: 'white', background: '#d32f2f', padding: '0.5rem', borderRadius: '4px', marginBottom: '1rem', textAlign: 'center' }}>{error}</div>}
                {successMsg && <div style={{ color: 'white', background: '#2e7d32', padding: '0.5rem', borderRadius: '4px', marginBottom: '1rem', textAlign: 'center' }}>{successMsg}</div>}

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>👤 Full Name</label>
                        <input type="text" name="name" value={formData.name} onChange={handleChange} required placeholder="John Doe" />
                    </div>
                    <div className="form-group">
                        <label>📧 Email Address</label>
                        <input type="email" name="email" value={formData.email} onChange={handleChange} required placeholder="farmer@example.com" />
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                        <div className="form-group">
                            <label>🔒 Password</label>
                            <div style={{ position: 'relative' }}>
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    required
                                    placeholder="Min. 6 chars"
                                    style={{ paddingRight: '3rem' }}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    style={{ position: 'absolute', right: '0.75rem', top: '50%', transform: 'translateY(-50%)', background: 'transparent', border: 'none', cursor: 'pointer', fontSize: '1.2rem' }}
                                >
                                    {showPassword ? '👁️' : '👁️‍🗨️'}
                                </button>
                            </div>
                        </div>
                        <div className="form-group">
                            <label>🔒 Confirm Password</label>
                            <input type={showPassword ? 'text' : 'password'} name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} required placeholder="Confirm" />
                        </div>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                        <div className="form-group">
                            <label>👔 Role</label>
                            <select name="role" value={formData.role} onChange={handleChange}>
                                <option value="farmer">👨‍🌾 Farmer</option>
                                <option value="admin">👨‍💼 Admin</option>
                            </select>
                        </div>
                        <div className="form-group">
                            <label>📍 Location</label>
                            <input type="text" name="location" value={formData.location} onChange={handleChange} required placeholder="City/Village" list="locations" />
                            <datalist id="locations">
                                {commonLocations.map(loc => <option key={loc} value={loc} />)}
                            </datalist>
                        </div>
                    </div>
                    <button type="submit" className="btn-primary" disabled={loading}>
                        {loading ? 'Creating account...' : '🚀 Create Account'}
                    </button>
                </form>
                <p className="auth-footer">
                    Already have an account? <Link to="/login">Login here</Link>
                </p>
            </div>
        </div>
    );
};

export default Register;
