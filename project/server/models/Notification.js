const mongoose = require('mongoose');

const NotificationSchema = new mongoose.Schema({
    userId: { type: String, required: true }, // Recipient
    message: { type: String, required: true },
    type: { type: String, default: 'info' }, // 'info', 'success', 'warning', 'error'
    read: { type: Boolean, default: false },
    relatedId: String,
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Notification', NotificationSchema);
