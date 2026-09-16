import mongoose from 'mongoose';

/**
 * Connect to MongoDB database.
 * Caches the connection to avoid re-connecting on every Vercel serverless invocation.
 */
export const connectDB = async () => {
  // If already connected or connecting, reuse the connection
  if (mongoose.connection.readyState >= 1) {
    return;
  }
  try {
    const mongoUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/store_website';
    const conn = await mongoose.connect(mongoUri);
    console.log(`[Database] MongoDB Connected: ${conn.connection.host}/${conn.connection.name}`);
  } catch (error) {
    console.error(`[Database Error] ${error.message}`);
    process.exit(1);
  }
};

mongoose.connection.on('disconnected', () => {
  console.warn('[Database] MongoDB disconnected');
});

mongoose.connection.on('error', (err) => {
  console.error(`[Database Error] MongoDB connection error: ${err.message}`);
});
