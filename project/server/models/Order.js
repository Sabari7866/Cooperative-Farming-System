const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema({
    orderNumber: { type: String, required: true, unique: true },
    productId: { type: String, required: true },
    productName: { type: String, required: true },
    buyerId: { type: String, required: true },
    buyerName: { type: String },
    sellerId: { type: String, required: true },
    sellerName: { type: String },
    amount: { type: Number, required: true },
    quantity: { type: String, required: true },
    status: {
        type: String,
        enum: ['pending', 'shipped', 'delivered', 'cancelled'],
        default: 'pending'
    },
    orderDate: { type: Date, default: Date.now },
    deliveryDate: { type: String, default: 'TBD' },
    trackingId: { type: String }
}, { timestamps: true });

module.exports = mongoose.models.Order || mongoose.model('Order', OrderSchema);
