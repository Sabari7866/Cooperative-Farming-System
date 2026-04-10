const mongoose = require('mongoose');

// User Schema - Strictly for Login/Auth Credentials
const UserSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true }, // Hashed password
    role: {
        type: String,
        enum: ['farmer', 'worker', 'buyer', 'renter', 'admin'],
        default: 'farmer'
    },
    profileId: { type: mongoose.Schema.Types.ObjectId, ref: 'UserProfile' }
}, { timestamps: true });

module.exports = mongoose.models.User || mongoose.model('User', UserSchema);
