const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        // Default to local MongoDB if MONGODB_URI is not defined
        const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/agrismart';

        await mongoose.connect(uri);

        console.log(`✅ MongoDB Connected: ${mongoose.connection.host}`);
    } catch (error) {
        console.error(`❌ Error: ${error.message}`);
        process.exit(1);
    }
};

module.exports = connectDB;
