const mongoose = require('mongoose');

const CropSchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true },
    image: { type: String, required: true }, // Path to uploaded image
    diseases: [{
        name: { type: String, required: true },
        symptoms: { type: String, required: true },
        solution: { type: String, required: true }
    }],
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Crop', CropSchema);
