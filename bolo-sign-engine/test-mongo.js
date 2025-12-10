// Quick MongoDB connection test
require('dotenv').config();
const mongoose = require('mongoose');

async function testConnection() {
  try {
    console.log('Testing MongoDB connection...');
    console.log('MONGO_URI:', process.env.MONGO_URI ? 'Set' : 'NOT SET');
    
    if (!process.env.MONGO_URI) {
      console.error('❌ MONGO_URI not found in .env file');
      process.exit(1);
    }

    await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 10000,
    });
    
    console.log('✅ MongoDB connection successful!');
    process.exit(0);
  } catch (error) {
    console.error('❌ MongoDB connection failed:');
    console.error('Error:', error.message);
    console.error('\nCommon issues:');
    console.error('1. Check if IP is whitelisted in MongoDB Atlas');
    console.error('2. Verify connection string format');
    console.error('3. Check username/password are correct');
    process.exit(1);
  }
}

testConnection();

