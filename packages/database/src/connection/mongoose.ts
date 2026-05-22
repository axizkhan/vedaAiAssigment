import mongoose from 'mongoose';
import { logger } from '@assessment-ai/logger';

let isConnected = false;

export const connectDatabase = async (uri: string): Promise<void> => {
  if (isConnected) {
    logger.info('Using existing database connection');
    return;
  }

  try {
    const db = await mongoose.connect(uri, {
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
    });

    isConnected = db.connections[0].readyState === 1;
    logger.info('✅ Successfully connected to MongoDB');
  } catch (error) {
    logger.error('❌ MongoDB connection error:', error);
    throw error;
  }
};

export const disconnectDatabase = async (): Promise<void> => {
  if (!isConnected) return;
  await mongoose.disconnect();
  isConnected = false;
  logger.info('Disconnected from MongoDB');
};

process.on('SIGINT', async () => {
  await disconnectDatabase();
  process.exit(0);
});
