const mongoose = require('mongoose');

const sensorDataSchema = new mongoose.Schema({
    farmId: { type: mongoose.Schema.Types.ObjectId, ref: 'Land', index: true },
    timestamp: { type: Date, default: Date.now, index: true },
    metrics: {
        soilMoisture: Number,
        temperature: Number,
        humidity: Number,
        nitrogen: Number,
        phosphorus: Number,
        potassium: Number,
        phLevel: Number
    }
});
module.exports = mongoose.model('SensorData', sensorDataSchema);
