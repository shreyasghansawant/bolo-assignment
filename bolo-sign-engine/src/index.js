require('dotenv').config();
const path = require('path');
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const signRoute = require('./routes/signRoute');

const app = express();

// CORS configuration - handle trailing slash issues
const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) {
      console.log('CORS: No origin header, allowing');
      return callback(null, true);
    }
    
    console.log('CORS: Request from origin:', origin);
    console.log('CORS: FRONTEND_URL:', process.env.FRONTEND_URL);
    
    // If FRONTEND_URL is set, normalize and compare
    if (process.env.FRONTEND_URL) {
      // Remove trailing slashes from both for comparison
      const normalizedOrigin = origin.replace(/\/$/, '');
      const normalizedAllowed = process.env.FRONTEND_URL.replace(/\/$/, '');
      
      console.log('CORS: Normalized origin:', normalizedOrigin);
      console.log('CORS: Normalized allowed:', normalizedAllowed);
      
      if (normalizedOrigin === normalizedAllowed) {
        console.log('CORS: ✅ Origin allowed');
        return callback(null, true);
      } else {
        console.log('CORS: ❌ Origin not allowed');
      }
    } else {
      // Allow all origins if FRONTEND_URL not set
      console.log('CORS: FRONTEND_URL not set, allowing all origins');
      return callback(null, true);
    }
    
    // Reject if origin doesn't match
    callback(new Error('Not allowed by CORS'));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  preflightContinue: false,
  optionsSuccessStatus: 204
};

app.use(cors(corsOptions));

// Explicitly handle OPTIONS requests for all routes (Express 5 compatible)
app.use((req, res, next) => {
  if (req.method === 'OPTIONS') {
    res.header('Access-Control-Allow-Origin', req.headers.origin || '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
    res.header('Access-Control-Allow-Credentials', 'true');
    return res.sendStatus(204);
  }
  next();
});

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use('/storage', express.static(path.join(__dirname, '../storage')));
app.use('/sign-pdf', signRoute);

app.get('/health', (req, res) => {
  res.json({ ok: true, timestamp: new Date().toISOString() });
});

app.get('/', (req, res) => {
  res.json({ 
    message: 'BoloForms Signature Injection Engine API',
    endpoints: { health: '/health', signPdf: 'POST /sign-pdf' }
  });
});

const PORT = process.env.PORT || 4000;

async function start() {
  try {
    if (process.env.MONGO_URI) {
      console.log('Attempting to connect to MongoDB...');
      console.log('MONGO_URI:', process.env.MONGO_URI.replace(/:[^:@]+@/, ':****@')); // Hide password in logs
      
      await mongoose.connect(process.env.MONGO_URI, {
        serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of 30s
        socketTimeoutMS: 45000, // Close sockets after 45s of inactivity
      });
      
      mongoose.connection.on('error', (err) => {
        console.error('MongoDB connection error:', err);
      });
      
      mongoose.connection.on('disconnected', () => {
        console.warn('MongoDB disconnected');
      });
      
      console.log('✅ Connected to MongoDB successfully');
    } else {
      console.warn('⚠️ MONGO_URI not set - MongoDB features will be disabled');
    }
    
    app.listen(PORT, () => {
      console.log(`✅ Server started on port ${PORT}`);
      console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
      console.log(`MongoDB: ${process.env.MONGO_URI ? 'Configured' : 'Not configured'}`);
    });
  } catch (err) {
    console.error('❌ Failed to start server:', err);
    console.error('Error details:', err.message);
    process.exit(1);
  }
}

start();
