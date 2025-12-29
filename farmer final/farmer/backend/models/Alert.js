const mongoose = require('mongoose');

const AlertSchema = new mongoose.Schema({
    message: { type: String, required: true },
    severity: { type: String, enum: ['High', 'Medium', 'Low'], required: true },
    affectedCrop: { type: String },
    targetLocation: { type: String }, 
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // Admin who created it
    readBy: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }], // Track users who saw this
    hiddenBy: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }], // Track users who hid this from dashboard
    sentAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Alert', AlertSchema);
