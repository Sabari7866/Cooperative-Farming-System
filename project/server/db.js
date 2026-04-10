const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        // Default to local MongoDB if MONGODB_URI is not defined
        const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/uzhavan_x';

        await mongoose.connect(uri);

        console.log(`✅ MongoDB Connected: ${mongoose.connection.host}`);
    } catch (error) {
        console.error(`❌ MongoDB Connection Error: ${error.message}`);
        // In serverless/production, we don't want to kill the process
        // We let the request fail naturally so we can see the error in logs
    }
};

module.exports = connectDB;
