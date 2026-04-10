const mongoose = require('mongoose');

const connectDB = async () => {
    const uri = process.env.MONGODB_URI;

    if (!uri && process.env.VERCEL) {
        throw new Error('Deployment Error: MONGODB_URI is not defined. Please add your MongoDB Atlas connection string to Vercel Environment Variables.');
    }

    const finalUri = uri || 'mongodb://127.0.0.1:27017/uzhavan_x';
    await mongoose.connect(finalUri, {
        serverSelectionTimeoutMS: 5000, // Timeout faster if DB unreachable
    });

    console.log(`✅ MongoDB Connected: ${mongoose.connection.host}`);
  } catch (error) {
    console.error(`❌ MongoDB Connection Error: ${error.message}`);
    throw error; // Rethrow to let the caller/Vercel know
  }
};

module.exports = connectDB;
