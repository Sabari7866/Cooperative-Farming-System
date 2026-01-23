const mongoose = require('mongoose');

const LandSchema = new mongoose.Schema({
    name: { type: String, required: true },
    location: { type: String, required: true },
    crop: { type: String, required: true },
    acreage: { type: Number, required: true },
    stage: { type: String, default: 'preparation' },
    plantedDate: { type: String },
    expectedHarvest: { type: String },
    soilType: { type: String },
    irrigationType: { type: String },
    status: {
        type: String,
        enum: ['preparation', 'sowing', 'growing', 'flowering', 'harvest'],
        default: 'preparation'
    },
    lastUpdated: { type: String },
    coordinates: {
        lat: Number,
        lng: Number
    },
    notes: { type: String }
}, { timestamps: true });

// Check if model already exists to prevent overwrite error during hot reloads
module.exports = mongoose.models.Land || mongoose.model('Land', LandSchema);
