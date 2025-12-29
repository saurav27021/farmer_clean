const mongoose = require('mongoose');

const ReportSchema = new mongoose.Schema({
    farmer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    cropName: { type: String, required: true },
    pestOrDiseaseName: { type: String, required: true },
    severityLevel: { type: String, enum: ['High', 'Medium', 'Low'], required: true },
    symptoms: { type: String },
    notes: { type: String },
    location: { type: String },
    status: { type: String, enum: ['Pending', 'Resolved'], default: 'Pending' },
    solution: { type: String },
    reportedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Report', ReportSchema);
