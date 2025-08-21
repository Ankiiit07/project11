import mongoose from 'mongoose';

export const connectDB = async (): Promise<void> => {
  try {
    // Allow for MongoDB Atlas connection via environment variable
    const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/cafe-at-once';

    console.log('🔄 Connecting to MongoDB...');
    // Hide credentials in logs
    console.log('📍 MongoDB URI:', mongoURI.replace(/\/\/.*@/, '//***:***@'));

    const conn = await mongoose.connect(mongoURI);

    console.log(`✅ MongoDB Connected successfully!`);
    console.log(`📊 Database: ${conn.connection.name}`);
    console.log(`🌐 Host: ${conn.connection.host}:${conn.connection.port}`);
  } catch (error) {
    console.error('❌ Error connecting to MongoDB:', error instanceof Error ? error.message : error);
    console.log('⚠️ Is MongoDB running on your machine? If not, consider:');
    console.log('   1. Start local MongoDB server');
    console.log('   2. Use MongoDB Atlas by setting MONGODB_URI in .env file');
    console.log('   3. The app will continue to run with limited functionality');

    // Continue execution with warning instead of crashing
    console.log('⚠️ Continuing without database connection. Some features will not work.');
  }

  // Handle connection events
  mongoose.connection.on('error', (err) => {
    console.error('❌ MongoDB connection error:', err);
  });

  mongoose.connection.on('disconnected', () => {
    console.log('⚠️ MongoDB disconnected');
  });

  // Graceful shutdown
  process.on('SIGINT', async () => {
    if (mongoose.connection.readyState !== 0) {
      await mongoose.connection.close();
      console.log('🔌 MongoDB connection closed through app termination');
    }
    process.exit(0);
  });
};

export const disconnectDB = async (): Promise<void> => {
  try {
    if (mongoose.connection.readyState !== 0) {
      await mongoose.connection.close();
      console.log('🔌 MongoDB connection closed');
    }
  } catch (error) {
    console.error('❌ Error disconnecting from MongoDB:', error);
  }
};