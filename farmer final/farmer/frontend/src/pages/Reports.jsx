import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchReports, deleteReport, resolveReport } from '../store/reportSlice';

const Reports = () => {
    const dispatch = useDispatch();
    const { items: reports, loading, error } = useSelector((state) => state.reports);
    const { user } = useSelector((state) => state.auth);

    // Search State
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedReport, setSelectedReport] = useState(null);
    const [solutionText, setSolutionText] = useState('');

    useEffect(() => {
        dispatch(fetchReports());
    }, [dispatch]);

    const handleDelete = async (id, e) => {
        e.stopPropagation();
        if (window.confirm('Are you sure you want to delete this report?')) {
            await dispatch(deleteReport(id));
            if (selectedReport?._id === id) {
                setSelectedReport(null);
            }
        }
    };

    const handleResolve = async (e) => {
        e.preventDefault();
        if (!solutionText.trim()) return;

        await dispatch(resolveReport({ id: selectedReport._id, solution: solutionText }));
        setSolutionText('');
        // Close modal after brief delay or keep open to show updated status?
        // Let's keep it open but user will see update potentially if we check selectedReport
        // Best to just close or re-fetch/update local state if needed.
        // Since we update store, selectedReport needs to be updated or we close it.
        // Let's close for now for simplicity.
        setSelectedReport(null);
    };

    // Filtering Logic
    const filteredReports = reports.filter(report => {
        const term = searchTerm.toLowerCase();
        return (
            report.cropName?.toLowerCase().includes(term) ||
            report.pestOrDiseaseName?.toLowerCase().includes(term) ||
            report.location?.toLowerCase().includes(term) ||
            report.farmer?.name?.toLowerCase().includes(term) ||
            report.notes?.toLowerCase().includes(term)
        );
    });

    const isAdmin = user?.role === 'admin';

    return (
        <div style={{ position: 'relative', minHeight: 'calc(100vh - 64px)' }}>
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
                    zIndex: -1
                }}
            >
                <source src="/video5.mp4" type="video/mp4" />
            </video>
            <div className="container" style={{ paddingBottom: '4rem', position: 'relative', zIndex: 1 }}>
                <header style={{ marginBottom: '2rem' }}>
                    <h1 style={{ color: 'white' }}>📢 Farmer Reports {isAdmin ? '(Admin View)' : '(My Reports)'}</h1>
                    <p style={{ color: 'rgba(255, 255, 255, 0.8)' }}>
                        {isAdmin ? 'Manage and resolve farmer issues.' : 'Track the status of your submitted reports.'}
                    </p>
                </header>

                {/* Search Bar */}
                <div style={{ marginBottom: '2rem' }}>
                    <input
                        type="text"
                        placeholder="🔍 Search reports..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}

                        style={{ width: '100%', padding: '1rem', fontSize: '1.1rem', borderRadius: '8px', border: '1px solid rgba(255, 255, 255, 0.3)', background: 'rgba(0, 0, 0, 0.3)', color: 'white', backdropFilter: 'blur(5px)' }}
                    />
                </div>

                {loading && <p>Loading reports...</p>}
                {error && <p style={{ color: 'red' }}>Error: {error}</p>}

                {/* Reports Grid */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '2rem' }}>
                    {filteredReports.map(report => (
                        <div
                            key={report._id}
                            className="glass-card"
                            style={{ padding: 0, overflow: 'hidden', display: 'flex', flexDirection: 'column', cursor: 'pointer', transition: 'transform 0.2s' }}
                            onClick={() => setSelectedReport(report)}
                        >
                            {report.image && (
                                <img src={`http://localhost:5000${report.image}`} alt={report.pestOrDiseaseName} style={{ width: '100%', height: '200px', objectFit: 'cover' }} />
                            )}
                            <div style={{ padding: '1.5rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                                    <h3 style={{ margin: 0, color: 'var(--secondary-color)' }}>{report.pestOrDiseaseName}</h3>
                                    <span style={{
                                        background: report.status === 'Resolved' ? 'rgba(46, 125, 50, 0.3)' : 'rgba(255, 152, 0, 0.3)',
                                        color: report.status === 'Resolved' ? '#81c784' : '#ffb74d',
                                        padding: '0.2rem 0.6rem', borderRadius: '4px', fontSize: '0.8rem', fontWeight: 'bold',
                                        border: '1px solid rgba(255, 255, 255, 0.1)'
                                    }}>
                                        {report.status || 'Pending'}
                                    </span>
                                </div>
                                <small style={{ color: 'rgba(255, 255, 255, 0.6)', fontWeight: 'bold', marginBottom: '1rem' }}>on {report.cropName}</small>

                                <p style={{ color: 'rgba(255, 255, 255, 0.8)', marginBottom: '1rem', flex: 1, overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical' }}>
                                    {report.notes}
                                </p>

                                <div style={{ borderTop: '1px solid rgba(255, 255, 255, 0.1)', paddingTop: '1rem', display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', color: 'rgba(255, 255, 255, 0.7)' }}>
                                    <span>📍 {report.location}</span>
                                    <div>
                                        <span style={{ marginRight: '1rem' }}>👤 {report.farmer?.name || 'Anonymous'}</span>
                                        {isAdmin && (
                                            <button
                                                onClick={(e) => handleDelete(report._id, e)}
                                                style={{ background: '#ffebee', border: 'none', cursor: 'pointer', color: '#d32f2f', padding: '0.2rem 0.5rem', borderRadius: '4px' }}
                                            >
                                                🗑️
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Detail Modal */}
                {selectedReport && (
                    <div
                        style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.8)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}
                        onClick={() => setSelectedReport(null)}
                    >
                        <div
                            className="glass-card"
                            style={{ width: '100%', maxWidth: '600px', maxHeight: '90vh', overflowY: 'auto', padding: 0, position: 'relative' }}
                            onClick={(e) => e.stopPropagation()}
                        >
                            <button
                                onClick={() => setSelectedReport(null)}
                                style={{ position: 'absolute', top: '10px', right: '10px', background: 'rgba(255,255,255,0.1)', color: 'white', border: 'none', borderRadius: '50%', width: '30px', height: '30px', cursor: 'pointer', fontSize: '1.2rem', zIndex: 10 }}
                            >
                                ✕
                            </button>

                            {selectedReport.image && <img src={`http://localhost:5000${selectedReport.image}`} alt="Report" style={{ width: '100%', height: '300px', objectFit: 'cover' }} />}

                            <div style={{ padding: '2rem' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                                    <div>
                                        <h2 style={{ margin: 0, color: 'var(--secondary-color)' }}>{selectedReport.pestOrDiseaseName}</h2>
                                        <h3 style={{ margin: 0, color: 'rgba(255, 255, 255, 0.7)' }}>Crop: {selectedReport.cropName}</h3>
                                    </div>
                                    <div style={{
                                        background: selectedReport.status === 'Resolved' ? 'rgba(46, 125, 50, 0.3)' : 'rgba(255, 152, 0, 0.3)',
                                        color: selectedReport.status === 'Resolved' ? '#81c784' : '#ffb74d',
                                        padding: '0.5rem 1rem', borderRadius: '4px', fontWeight: 'bold'
                                    }}>
                                        {selectedReport.status || 'Pending'}
                                    </div>
                                </div>

                                <div style={{ marginBottom: '1.5rem' }}>
                                    <h4>Symptoms</h4>
                                    <p style={{ whiteSpace: 'pre-wrap' }}>{selectedReport.symptoms || 'N/A'}</p>
                                </div>

                                {/* Solution Section */}
                                {selectedReport.status === 'Resolved' ? (
                                    <div style={{ background: 'rgba(46, 125, 50, 0.2)', padding: '1rem', borderRadius: '8px', borderLeft: '4px solid #2e7d32', marginBottom: '1rem' }}>
                                        <h4 style={{ color: '#81c784', marginTop: 0 }}>✅ Expert Solution</h4>
                                        <p style={{ whiteSpace: 'pre-wrap', color: 'rgba(255, 255, 255, 0.9)' }}>{selectedReport.solution}</p>
                                    </div>
                                ) : (
                                    <div style={{ background: 'rgba(255, 255, 255, 0.05)', padding: '1rem', borderRadius: '8px', marginBottom: '1rem', textAlign: 'center', color: 'rgba(255, 255, 255, 0.6)' }}>
                                        ⏳ Waiting for expert review...
                                    </div>
                                )}

                                {/* Admin Resolve Form */}
                                {isAdmin && selectedReport.status !== 'Resolved' && (
                                    <div style={{ marginTop: '2rem', borderTop: '2px solid #eee', paddingTop: '1rem' }}>
                                        <h4>👨‍⚕️ Provide Solution</h4>
                                        <form onSubmit={handleResolve}>
                                            <textarea
                                                value={solutionText}
                                                onChange={(e) => setSolutionText(e.target.value)}
                                                placeholder="Type the recommended solution here..."
                                                style={{ width: '100%', padding: '0.5rem', minHeight: '100px', marginBottom: '1rem', background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.3)', color: 'white' }}
                                                required
                                            ></textarea>
                                            <button type="submit" className="btn-primary" style={{ width: '100%' }}>Mark as Resolved</button>
                                        </form>
                                    </div>
                                )}

                                {isAdmin && (
                                    <button
                                        onClick={(e) => handleDelete(selectedReport._id, e)}
                                        className="btn-primary"
                                        style={{ marginTop: '1rem', width: '100%', background: '#d32f2f' }}
                                    >
                                        Delete Report
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Reports;
