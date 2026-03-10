const mongoose = require('mongoose');

const AgroShopSchema = new mongoose.Schema({
    name: { type: String, required: true },
    location: { type: String, required: true },
    distance: { type: String },
    phone: { type: String, required: true },
    email: { type: String },
    products: [String],
    productPrices: [{
        name: { type: String, required: true },
        price: { type: Number, required: true },
        unit: { type: String, required: true },
        lastUpdated: { type: Date, default: Date.now }
    }],
    rating: { type: Number, default: 0 },
    reviewCount: { type: Number, default: 0 },
    open: { type: Boolean, default: true },
    openingHours: {
        open: { type: String, default: '9:00 AM' },
        close: { type: String, default: '7:00 PM' }
    },
    address: { type: String },
    coordinates: {
        lat: { type: Number },
        lng: { type: Number }
    },
    verified: { type: Boolean, default: false },
    image: { type: String },
    description: { type: String }
}, { timestamps: true });

module.exports = mongoose.models.AgroShop || mongoose.model('AgroShop', AgroShopSchema);
