const mongoose = require('mongoose');

// User Profile Schema - For Personal Information
const UserProfileSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    fullName: { type: String, required: true },
    phone: { type: String },
    address: { type: String },
    bio: { type: String },
    avatar: { type: String }, // URL or Base64

    // Specific fields based on role
    farmingDetails: {
        farmSize: Number, // in acres
        mainCrops: [String],
        experienceYears: Number
    },

    preferences: {
        language: { type: String, default: 'en' },
        notifications: { type: Boolean, default: true },
        theme: { type: String, default: 'light' }
    }
}, { timestamps: true });

module.exports = mongoose.models.UserProfile || mongoose.model('UserProfile', UserProfileSchema);
