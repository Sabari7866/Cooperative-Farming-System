const mongoose = require('mongoose');

const WorkerApplicationSchema = new mongoose.Schema({
    workerId: { type: String, required: true },
    workerName: { type: String, required: true },
    workerPhone: { type: String },
    workerRating: { type: Number },
    appliedAt: { type: Date, default: Date.now },
    status: {
        type: String,
        enum: ['pending', 'accepted', 'rejected'],
        default: 'pending'
    },
    message: String
});

const JobSchema = new mongoose.Schema({
    userId: { type: String }, // To associate job with specific user
    title: { type: String, required: true },
    description: { type: String, required: true },
    farmOwner: { type: String, required: true },
    farmOwnerPhone: { type: String },
    location: { type: String, required: true },
    distance: { type: String },
    workers: { type: Number, required: true }, // Number of workers needed
    date: { type: String }, // Can be Date, but keeping string to match frontend 'YYYY-MM-DD'
    time: { type: String },
    duration: { type: String },
    payment: { type: String },
    hourlyRate: { type: Number },
    skills: [String],
    urgent: { type: Boolean, default: false },
    verified: { type: Boolean, default: false },
    rating: { type: Number, default: 0 },
    status: {
        type: String,
        enum: ['active', 'completed', 'cancelled', 'in-progress'],
        default: 'active'
    },
    applicants: [WorkerApplicationSchema],
    requirements: [String],
    benefits: [String]
}, { timestamps: true });

module.exports = mongoose.models.Job || mongoose.model('Job', JobSchema);
