const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const uri = process.env.NODE_ENV === 'staging'
      ? process.env.MONGO_URI_STAGING
      : process.env.MONGO_URI;

    mongoose.connection.on('error', (err) => {
      console.error('MongoDB runtime error:', err.message);
    });

    mongoose.connection.on('disconnected', () => {
      console.log('MongoDB disconnected');
    });

    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 5000,
      connectTimeoutMS: 5000,
    });
    console.log(`MongoDB connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`MongoDB connection error: ${error.message}`);
    console.log('Server will continue without database connection');
  }
};

module.exports = connectDB;
