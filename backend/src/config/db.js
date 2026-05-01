import mongoose from 'mongoose';
import env from './env.js';

async function connectDB() {
  try {
    mongoose.set('strictQuery', true);

    const connection = await mongoose.connect(env.mongoUri, {
      autoIndex: env.nodeEnv !== 'production'
    });

    console.log(`MongoDB connected: ${connection.connection.host}`);
    return connection;
  } catch (error) {
    console.error(`MongoDB connection failed: ${error.message}`);
    console.warn('Starting API without MongoDB. Database routes will fail until MongoDB is available.');
    return null;
  }
}

async function disconnectDB() {
  if (mongoose.connection.readyState === 0) {
    return;
  }

  await mongoose.connection.close();
  console.log('MongoDB connection closed.');
}

export { connectDB, disconnectDB };
