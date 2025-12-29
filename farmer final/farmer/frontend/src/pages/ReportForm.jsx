import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { submitReport } from '../store/reportSlice';

const ReportForm = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { loading, error } = useSelector((state) => state.reports);

    const [formData, setFormData] = useState({
        cropName: '',
        pestOrDiseaseName: '',
        severityLevel: 'Low',
        location: '',
        symptoms: '',
        notes: ''
    });

    const pests = ['Aphids', 'Armyworm', 'Locusts', 'Whitefly', 'Stem Borer'];
    const diseases = ['Leaf Rust', 'Blight', 'Powdery Mildew', 'Root Rot', 'Mosaic Virus'];
    const crops = ['Wheat', 'Rice', 'Maize', 'Cotton', 'Sugarcane', 'Potato', 'Tomato'];

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSuggestionClick = (field, value) => {
        setFormData({ ...formData, [field]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const result = await dispatch(submitReport(formData));
        if (submitReport.fulfilled.match(result)) {
            alert('Report Submitted Successfully! 📢');
            navigate('/dashboard');
        }
    };

    return (
        <div className="report-container" style={{ position: 'relative', minHeight: '100vh', padding: '2rem', overflowX: 'hidden' }}>
            <video className="bg-video" autoPlay loop muted playsInline >
                <source src="/video3.mp4" type="video/mp4" />
            </video>

            <div className="container" style={{ position: 'relative', zIndex: 1 }}>
                <button
                    className="btn-secondary"
                    onClick={() => navigate(-1)}
                    style={{
                        marginBottom: '1rem',
                        background: 'rgba(255,255,255,0.1)',
                        color: 'white',
                        borderColor: 'rgba(255,255,255,0.3)'
                    }}
                >
                    ⬅ Back
                </button>

                <div className="auth-card" style={{ maxWidth: '800px', margin: '0 auto', padding: '3rem' }}>
                    <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                        <div style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>📝</div>
                        <h1 style={{ color: 'var(--white)', textShadow: '0 2px 4px rgba(0,0,0,0.3)' }}>Report Pest or Disease</h1>
                        <p style={{ color: 'rgba(255, 255, 255, 0.8)' }}>Help your community by logging observations.</p>
                    </div>

                    {error && <div style={{ background: 'rgba(220, 38, 38, 0.2)', color: '#fca5a5', padding: '1rem', borderRadius: '8px', marginBottom: '1rem', border: '1px solid #ef4444' }}>{error}</div>}

                    <form onSubmit={handleSubmit} className="report-form">
                        <div className="form-section" style={{ marginBottom: '2rem' }}>
                            <h3 style={{ color: 'var(--white)', borderBottom: '1px solid rgba(255,255,255,0.2)', paddingBottom: '0.5rem', marginBottom: '1rem' }}>🌱 Crop Details</h3>
                            <div className="form-group">
                                <label>Crop Name</label>
                                <input type="text" name="cropName" value={formData.cropName} onChange={handleChange} required placeholder="e.g. Wheat" />
                                <div className="tag-container">
                                    {crops.map(c => (
                                        <span key={c} className="tag" onClick={() => handleSuggestionClick('cropName', c)}>{c}</span>
                                    ))}
                                </div>
                            </div>

                            <div className="form-group">
                                <label>Pest / Disease Name</label>
                                <input type="text" name="pestOrDiseaseName" value={formData.pestOrDiseaseName} onChange={handleChange} required placeholder="e.g. Locusts" />
                                <div className="tag-container">
                                    {pests.map(p => <span key={p} className="tag" onClick={() => handleSuggestionClick('pestOrDiseaseName', p)}>{p}</span>)}
                                    {diseases.map(d => <span key={d} className="tag" onClick={() => handleSuggestionClick('pestOrDiseaseName', d)}>{d}</span>)}
                                </div>
                            </div>
                        </div>

                        <div className="form-section" style={{ marginBottom: '2rem' }}>
                            <h3 style={{ color: 'var(--white)', borderBottom: '1px solid rgba(255,255,255,0.2)', paddingBottom: '0.5rem', marginBottom: '1rem' }}>📍 Location & Severity</h3>
                            <div className="form-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                <div className="form-group">
                                    <label>Location</label>
                                    <input type="text" name="location" value={formData.location} onChange={handleChange} placeholder="e.g. North Field" />
                                </div>
                                <div className="form-group">
                                    <label>Severity Level</label>
                                    <select
                                        name="severityLevel"
                                        value={formData.severityLevel}
                                        onChange={handleChange}
                                        style={{
                                            background: 'rgba(255,255,255,0.1)',
                                            color: 'var(--white)',
                                            borderColor: formData.severityLevel === 'High' ? 'var(--danger-color)' :
                                                formData.severityLevel === 'Medium' ? 'var(--warning-color)' : 'var(--success-color)',
                                            borderWidth: '2px'
                                        }}
                                    >
                                        <option value="Low" style={{ color: 'black' }}>🟢 Low - Minor issues</option>
                                        <option value="Medium" style={{ color: 'black' }}>🟡 Medium - Noticeable damage</option>
                                        <option value="High" style={{ color: 'black' }}>🔴 High - Severe infestation</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        <div className="form-section" style={{ marginBottom: '2rem' }}>
                            <h3 style={{ color: 'var(--white)', borderBottom: '1px solid rgba(255,255,255,0.2)', paddingBottom: '0.5rem', marginBottom: '1rem' }}>📝 Observations</h3>
                            <div className="form-group">
                                <label>Symptoms</label>
                                <textarea name="symptoms" value={formData.symptoms} onChange={handleChange} rows="3" placeholder="Describe what you see (e.g. yellow leaves, holes)..."></textarea>
                            </div>
                            <div className="form-group">
                                <label>Additional Notes</label>
                                <textarea name="notes" value={formData.notes} onChange={handleChange} rows="2"></textarea>
                            </div>
                        </div>

                        <button type="submit" className="btn-primary" disabled={loading}>
                            {loading ? 'Submitting...' : '🚀 Submit Report'}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default ReportForm;
