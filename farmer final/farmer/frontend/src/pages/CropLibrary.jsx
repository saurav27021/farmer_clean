import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCrops, addCrop, addDisease, deleteCrop, deleteDisease } from '../store/cropSlice';

const CropLibrary = () => {
    const dispatch = useDispatch();
    const { items: crops, error } = useSelector((state) => state.crops);
    const { user } = useSelector((state) => state.auth);

    // Local state for UI interaction
    const [selectedCropId, setSelectedCropId] = useState(null);
    const selectedCrop = crops.find(c => c._id === selectedCropId) || null;
    const [selectedDisease, setSelectedDisease] = useState(null);

    // Search State
    const [cropSearch, setCropSearch] = useState('');
    const [diseaseSearch, setDiseaseSearch] = useState('');

    // Admin Forms State
    const [showAddCrop, setShowAddCrop] = useState(false);
    const [newCropName, setNewCropName] = useState('');
    const [newCropImage, setNewCropImage] = useState(null);

    const [showAddDisease, setShowAddDisease] = useState(false); // ID of crop to add disease to
    const [diseaseForm, setDiseaseForm] = useState({ name: '', symptoms: '', solution: '' });

    useEffect(() => {
        dispatch(fetchCrops());
    }, [dispatch]);

    const handleAddCrop = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('name', newCropName);
        formData.append('image', newCropImage);

        await dispatch(addCrop(formData));
        setShowAddCrop(false);
        setNewCropName('');
        setNewCropImage(null);
    };

    const handleAddDisease = async (e) => {
        e.preventDefault();
        if (!showAddDisease) return;

        await dispatch(addDisease({
            cropId: showAddDisease,
            diseaseData: diseaseForm
        }));

        setShowAddDisease(false);
        setDiseaseForm({ name: '', symptoms: '', solution: '' });
        setShowAddDisease(false);
        setDiseaseForm({ name: '', symptoms: '', solution: '' });
    };

    const handleDeleteCrop = async (id, e) => {
        e.stopPropagation(); // Prevent card click
        if (window.confirm('Are you sure you want to delete this crop?')) {
            await dispatch(deleteCrop(id));
            if (selectedCropId === id) setSelectedCropId(null);
        }
    };

    const handleDeleteDisease = async (diseaseId, e) => {
        e.stopPropagation();
        if (window.confirm('Remove this disease/solution?')) {
            await dispatch(deleteDisease({ cropId: selectedCrop._id, diseaseId }));
            if (selectedDisease?._id === diseaseId) setSelectedDisease(null);
        }
    };

    const isAdmin = user?.role === 'admin';

    // Filtering Logic
    const filteredCrops = crops.filter(crop =>
        crop.name.toLowerCase().includes(cropSearch.toLowerCase())
    );

    const filteredDiseases = selectedCrop ? selectedCrop.diseases.filter(d =>
        d.name.toLowerCase().includes(diseaseSearch.toLowerCase()) ||
        d.symptoms.toLowerCase().includes(diseaseSearch.toLowerCase())
    ) : [];

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
                <source src="/video4.mp4" type="video/mp4" />
            </video>
            <div className="container" style={{ paddingBottom: '4rem', position: 'relative', zIndex: 1, color: 'white' }}>
                <header style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                        <h1>🌿 Expert Solutions</h1>
                        <p style={{ color: 'rgba(255, 255, 255, 0.8)' }}>
                            Select a crop to view diseases. Search for symptoms to find the cure.
                        </p>
                    </div>
                    {isAdmin && (
                        <button
                            className="btn-primary"
                            onClick={() => setShowAddCrop(!showAddCrop)}
                        >
                            {showAddCrop ? 'Cancel' : '+ Add New Crop'}
                        </button>
                    )}
                </header>

                {/* Error Message */}
                {error && <div style={{ color: 'red', marginBottom: '1rem' }}>{error}</div>}

                {/* Admin: Add Crop Form */}
                {showAddCrop && (
                    <div className="glass-card" style={{ marginBottom: '2rem', borderLeft: '4px solid #2e7d32' }}>
                        <h3>Add New Crop</h3>
                        <form onSubmit={handleAddCrop} style={{ display: 'flex', gap: '1rem', alignItems: 'flex-end' }}>
                            <div style={{ flex: 1 }}>
                                <label>Crop Name</label>
                                <input
                                    type="text"
                                    value={newCropName}
                                    onChange={e => setNewCropName(e.target.value)}
                                    required
                                    placeholder="e.g. Tomato"
                                />
                            </div>
                            <div style={{ flex: 1 }}>
                                <label>Image</label>
                                <input
                                    type="file"
                                    onChange={e => setNewCropImage(e.target.files[0])}
                                    required
                                    accept="image/*"
                                />
                            </div>
                            <button type="submit" className="btn-primary">Upload</button>
                        </form>
                    </div>
                )}

                {/* Search Bar for Crops */}
                <div style={{ marginBottom: '2rem' }}>
                    <input
                        type="text"
                        placeholder="🔍 Search for a crop (e.g. Wheat, Tomato)..."
                        value={cropSearch}
                        onChange={(e) => setCropSearch(e.target.value)}
                        style={{
                            width: '100%',
                            padding: '1rem',
                            fontSize: '1.1rem',
                            borderRadius: '8px',
                            border: '1px solid rgba(255, 255, 255, 0.3)',
                            background: 'rgba(0, 0, 0, 0.3)',
                            color: 'white',
                            backdropFilter: 'blur(5px)'
                        }}
                    />
                </div>

                {/* Main Content Layout */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '2rem' }}>

                    {/* Crop Cards */}
                    {filteredCrops.map(crop => (
                        <div key={crop._id} className="glass-card" style={{ padding: 0, overflow: 'hidden', position: 'relative' }}>
                            <img
                                src={`http://localhost:5000${crop.image}`}
                                alt={crop.name}
                                style={{ width: '100%', height: '200px', objectFit: 'cover' }}
                                onClick={() => {
                                    setSelectedCropId(crop._id);
                                    setSelectedDisease(null);
                                    setDiseaseSearch(''); // Reset disease search
                                    // Scroll to section
                                    setTimeout(() => document.getElementById('disease-section')?.scrollIntoView({ behavior: 'smooth' }), 100);
                                }}
                            />
                            <div style={{ padding: '1rem' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <h3 style={{ margin: 0, color: 'white' }}>{crop.name}</h3>
                                    <span style={{ background: 'rgba(255, 255, 255, 0.2)', padding: '0.2rem 0.5rem', borderRadius: '4px', fontSize: '0.8rem', color: 'white' }}>
                                        {crop.diseases.length} Issues
                                    </span>
                                </div>

                                <button
                                    style={{
                                        width: '100%', marginTop: '1rem',
                                        background: selectedCrop?._id === crop._id ? 'var(--primary-color)' : 'rgba(255, 255, 255, 0.1)',
                                        color: 'white',
                                        border: '1px solid rgba(255, 255, 255, 0.2)', padding: '0.5rem', cursor: 'pointer', borderRadius: '4px'
                                    }}
                                    onClick={() => {
                                        setSelectedCropId(crop._id);
                                        setSelectedDisease(null);
                                        setDiseaseSearch('');
                                        setTimeout(() => document.getElementById('disease-section')?.scrollIntoView({ behavior: 'smooth' }), 100);
                                    }}
                                >
                                    {selectedCrop?._id === crop._id ? 'Selected' : 'View Solutions'}
                                </button>

                                {/* Admin: Add Disease Button */}
                                {isAdmin && (
                                    <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
                                        <button
                                            style={{ flex: 1, background: 'transparent', border: '1px dashed #ccc', cursor: 'pointer', color: '#666' }}
                                            onClick={() => setShowAddDisease(crop._id)}
                                        >
                                            + Add Item
                                        </button>
                                        <button
                                            style={{ background: '#ffebee', border: 'none', cursor: 'pointer', color: '#d32f2f', padding: '0 0.5rem', borderRadius: '4px' }}
                                            onClick={(e) => handleDeleteCrop(crop._id, e)}
                                            title="Delete Crop"
                                        >
                                            🗑️
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Add Disease Form Modal */}
                {showAddDisease && (
                    <div style={{
                        position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
                        background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000
                    }}>
                        <div className="glass-card" style={{ width: '400px', maxWidth: '90%' }}>
                            <h3>Add Disease/Issue</h3>
                            <form onSubmit={handleAddDisease}>
                                <div className="form-group">
                                    <label>Name</label>
                                    <input value={diseaseForm.name} onChange={e => setDiseaseForm({ ...diseaseForm, name: e.target.value })} required />
                                </div>
                                <div className="form-group">
                                    <label>Symptoms</label>
                                    <textarea value={diseaseForm.symptoms} onChange={e => setDiseaseForm({ ...diseaseForm, symptoms: e.target.value })} required />
                                </div>
                                <div className="form-group">
                                    <label>Solution</label>
                                    <textarea value={diseaseForm.solution} onChange={e => setDiseaseForm({ ...diseaseForm, solution: e.target.value })} required />
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
                                    <button type="button" onClick={() => setShowAddDisease(false)} style={{ background: '#ccc', border: 'none', padding: '0.5rem 1rem', cursor: 'pointer' }}>Cancel</button>
                                    <button type="submit" className="btn-primary">Add</button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}

                {/* Detail View Overlay / Section */}
                {selectedCrop && (
                    <div style={{
                        marginTop: '2rem', borderTop: '2px solid #eee', paddingTop: '2rem', minHeight: '500px'
                    }} id="disease-section">
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                            <h2>Diagnosing: <span style={{ color: 'var(--primary-color)' }}>{selectedCrop.name}</span></h2>
                            <button onClick={() => setSelectedCropId(null)} style={{ padding: '0.5rem', cursor: 'pointer' }}>Close</button>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(300px, 1fr) 2fr', gap: '2rem' }}>

                            {/* Disease List */}
                            <div>
                                <div style={{ marginBottom: '1rem' }}>
                                    <input
                                        type="text"
                                        placeholder="🔍 Search symptoms..."
                                        value={diseaseSearch}
                                        onChange={(e) => setDiseaseSearch(e.target.value)}
                                        style={{
                                            width: '100%', padding: '0.8rem', borderRadius: '4px', border: '1px solid rgba(255, 255, 255, 0.3)', background: 'rgba(0,0,0,0.3)', color: 'white'
                                        }}
                                    />
                                </div>

                                <h3>⚠️ Select Problem</h3>
                                {filteredDiseases.length === 0 && <p>No matching issues found.</p>}

                                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', maxHeight: '500px', overflowY: 'auto' }}>
                                    {filteredDiseases.map(disease => (
                                        <div
                                            key={disease._id}
                                            onClick={() => setSelectedDisease(disease)}
                                            style={{
                                                padding: '1rem',
                                                border: selectedDisease?._id === disease._id ? '2px solid var(--primary-color)' : '1px solid rgba(255, 255, 255, 0.2)',
                                                borderRadius: '8px',
                                                cursor: 'pointer',
                                                background: selectedDisease?._id === disease._id ? 'rgba(46, 125, 50, 0.3)' : 'rgba(255, 255, 255, 0.05)',
                                                display: 'flex',
                                                justifyContent: 'space-between',
                                                alignItems: 'center',
                                                transition: 'all 0.2s'
                                            }}
                                        >
                                            <div>
                                                <strong style={{ color: 'white' }}>{disease.name}</strong>
                                                <div style={{ fontSize: '0.8rem', color: 'rgba(255, 255, 255, 0.7)', marginTop: '0.2rem' }}>
                                                    {disease.symptoms.substring(0, 50)}...
                                                </div>
                                            </div>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                                {selectedDisease?._id === disease._id && <span>👉</span>}
                                                {isAdmin && (
                                                    <button
                                                        onClick={(e) => handleDeleteDisease(disease._id, e)}
                                                        style={{ border: 'none', background: 'transparent', cursor: 'pointer', opacity: 0.5 }}
                                                        title="Remove Issue"
                                                    >
                                                        🗑️
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Solution View */}
                            <div className="glass-card" style={{ borderTop: '4px solid var(--primary-color)', height: 'fit-content' }}>
                                {selectedDisease ? (
                                    <>
                                        <h2 style={{ color: 'var(--primary-color)', marginTop: 0 }}>✅ Solution Found</h2>
                                        <h3 style={{ textDecoration: 'underline' }}>{selectedDisease.name}</h3>

                                        <div style={{ marginBottom: '1.5rem' }}>
                                            <h4 style={{ color: 'rgba(255, 255, 255, 0.7)', marginBottom: '0.5rem' }}>Symptoms:</h4>
                                            <p style={{ background: 'rgba(255, 243, 224, 0.1)', padding: '1rem', borderRadius: '4px', color: 'rgba(255, 255, 255, 0.9)', border: '1px solid rgba(255, 255, 255, 0.1)' }}>
                                                {selectedDisease.symptoms}
                                            </p>
                                        </div>

                                        <div>
                                            <h4 style={{ color: '#81c784', marginBottom: '0.5rem' }}>Expert Treatment:</h4>
                                            <p style={{ background: 'rgba(232, 245, 233, 0.1)', padding: '1rem', borderRadius: '4px', borderLeft: '4px solid #2e7d32', whiteSpace: 'pre-wrap', color: 'white' }}>
                                                {selectedDisease.solution}
                                            </p>
                                        </div>
                                    </>
                                ) : (
                                    <div style={{ height: '300px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'rgba(255, 255, 255, 0.5)', flexDirection: 'column', textAlign: 'center' }}>
                                        <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>👨‍⚕️</div>
                                        <p>Please select a problem from the left <br /> to view the expert solution.</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div >
    );
};

export default CropLibrary;
