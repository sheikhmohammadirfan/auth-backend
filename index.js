const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const authRoutes = require("./routes/auth");

dotenv.config();

const app = express();

// CORS configuration - Allow Vercel deployments
const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:3000",
  process.env.FRONTEND_URL // Add this to your Render environment variables
];

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (mobile apps, Postman, curl)
    if (!origin) return callback(null, true);
    
    // Allow all Vercel preview/production deployments
    if (origin.includes('.vercel.app') || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.log('❌ CORS blocked origin:', origin);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  exposedHeaders: ["Authorization"]
}));

// Handle preflight requests
app.options('*', cors());

// Body parser middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/api/auth", authRoutes);

// Root route - API info
app.get("/", (req, res) => {
  res.json({ 
    message: "🔐 MERN Auth Backend API",
    version: "1.0.0",
    status: "running",
    endpoints: {
      signup: "POST /api/auth/signup",
      login: "POST /api/auth/login",
      me: "GET /api/auth/me (requires token)",
      users: "GET /api/auth/users (requires superadmin)"
    }
  });
});

// Test route
app.get("/api/test", (req, res) => {
  res.json({ 
    message: "✅ API is working!",
    timestamp: new Date().toISOString()
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ 
    message: "Route not found",
    path: req.path 
  });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error("❌ Global error:", err);
  res.status(500).json({ 
    message: err.message || "Internal server error",
    error: process.env.NODE_ENV === "development" ? err.stack : {}
  });
});

// MongoDB connection with better error handling
mongoose.connect(process.env.MONGO_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
  .then(() => {
    console.log("✅ MongoDB connected successfully");
    console.log("📊 Database:", mongoose.connection.db.databaseName);
  })
  .catch(err => {
    console.error("❌ MongoDB connection error:", err.message);
    console.log("\n💡 Make sure MongoDB is running:");
    console.log("   Run: mongod");
    console.log("   Or check if MongoDB service is started\n");
    process.exit(1);
  });

// Log when MongoDB connection is ready
mongoose.connection.on('connected', () => {
  console.log('🔗 Mongoose connected to MongoDB');
});

mongoose.connection.on('error', (err) => {
  console.error('❌ Mongoose connection error:', err);
});

mongoose.connection.on('disconnected', () => {
  console.log('⚠️ Mongoose disconnected');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📍 API endpoint: http://localhost:${PORT}/api`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
});