const mongoose = require('mongoose');

const WorkerSchema = new mongoose.Schema({
    name: { type: String, required: true },
    phone: { type: String, required: true },
    gender: { type: String, enum: ['Male', 'Female', 'Other'], default: 'Male' },
    skills: [String],
    location: { type: String, required: true },
    distance: { type: String }, // In a real app, calculate with geospatial queries
    rating: { type: Number, default: 0 },
    available: { type: Boolean, default: true },
    experience: { type: Number, default: 0 },
    completedJobs: { type: Number, default: 0 },
    profileImage: { type: String },
    languages: [String],
    hourlyRate: { type: Number, required: true },
    verified: { type: Boolean, default: false }
}, { timestamps: true });

module.exports = mongoose.models.Worker || mongoose.model('Worker', WorkerSchema);
