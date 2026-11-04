import dns from 'dns';
import mongoose from 'mongoose';

// Force public DNS resolution for Atlas SRV records so MongoDB connects reliably
// in environments where the default resolver is blocked or stale.
dns.setServers(['8.8.8.8', '8.8.4.4']);
dns.setDefaultResultOrder('ipv4first');

export let isDatabaseReady = false;

export const connectDB = async (failOnError = false) => {
  const mongoUri = process.env.MONGODB_URI;

  if (!mongoUri) {
    const message = 'MONGODB_URI is not defined in environment variables';
    console.warn(`${message}. Running in mock mode.`);

    if (failOnError) {
      throw new Error(message);
    }

    return false;
  }

  try {
    await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 15000,
      socketTimeoutMS: 15000,
    });

    isDatabaseReady = true;
    console.log('MongoDB connected successfully');
    return true;
  } catch (error) {
    isDatabaseReady = false;
    const message =
      error instanceof Error ? error.message : 'Unknown MongoDB error';
    console.warn(`MongoDB connection failed. Running in mock mode. ${message}`);

    if (failOnError) {
      throw error;
    }

    return false;
  }
};
