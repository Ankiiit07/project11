"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.disconnectDB = exports.connectDB = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const connectDB = async () => {
    try {
        const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/cafe-at-once';
        console.log('🔄 Connecting to MongoDB...');
        console.log('📍 MongoDB URI:', mongoURI.replace(/\/\/.*@/, '//***:***@'));
        const conn = await mongoose_1.default.connect(mongoURI);
        console.log(`✅ MongoDB Connected successfully!`);
        console.log(`📊 Database: ${conn.connection.name}`);
        console.log(`🌐 Host: ${conn.connection.host}:${conn.connection.port}`);
    }
    catch (error) {
        console.error('❌ Error connecting to MongoDB:', error instanceof Error ? error.message : error);
        console.log('⚠️ Is MongoDB running on your machine? If not, consider:');
        console.log('   1. Start local MongoDB server');
        console.log('   2. Use MongoDB Atlas by setting MONGODB_URI in .env file');
        console.log('   3. The app will continue to run with limited functionality');
        console.log('⚠️ Continuing without database connection. Some features will not work.');
    }
    mongoose_1.default.connection.on('error', (err) => {
        console.error('❌ MongoDB connection error:', err);
    });
    mongoose_1.default.connection.on('disconnected', () => {
        console.log('⚠️ MongoDB disconnected');
    });
    process.on('SIGINT', async () => {
        if (mongoose_1.default.connection.readyState !== 0) {
            await mongoose_1.default.connection.close();
            console.log('🔌 MongoDB connection closed through app termination');
        }
        process.exit(0);
    });
};
exports.connectDB = connectDB;
const disconnectDB = async () => {
    try {
        if (mongoose_1.default.connection.readyState !== 0) {
            await mongoose_1.default.connection.close();
            console.log('🔌 MongoDB connection closed');
        }
    }
    catch (error) {
        console.error('❌ Error disconnecting from MongoDB:', error);
    }
};
exports.disconnectDB = disconnectDB;
//# sourceMappingURL=database.js.map