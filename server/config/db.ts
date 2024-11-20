import mongoose from 'mongoose';
import config from './index';

export const connectDB = async () => {
  try {
    await mongoose.connect(config.mongoUri);
    console.log(`MongoDB Connected successfully`);
  } catch (error) {
    console.error('MongoDB connection error:', error);
    // Don't exit the process, let the app continue with mock data
    throw error;
  }
};