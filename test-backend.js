// Save this as test-backend.js in your backend folder
// Run with: node test-backend.js

const mongoose = require("mongoose");
require("dotenv").config();

console.log("🔍 Testing Backend Configuration...\n");

// Test 1: Environment Variables
console.log("1️⃣ Checking Environment Variables:");
console.log("   PORT:", process.env.PORT || "❌ NOT SET");
console.log("   MONGO_URL:", process.env.MONGO_URL || "❌ NOT SET");
console.log("   JWT_SECRET:", process.env.JWT_SECRET ? "✅ SET" : "❌ NOT SET");
console.log("   SUPERADMIN_KEY:", process.env.SUPERADMIN_KEY ? "✅ SET" : "❌ NOT SET");
console.log("");

// Test 2: MongoDB Connection
console.log("2️⃣ Testing MongoDB Connection...");
mongoose.connect(process.env.MONGO_URL)
  .then(() => {
    console.log("   ✅ MongoDB connected successfully!\n");
    
    // Test 3: User Model
    console.log("3️⃣ Testing User Model...");
    const User = require("./models/User");
    console.log("   ✅ User model loaded successfully!\n");
    
    console.log("🎉 All tests passed! Your backend should work.\n");
    process.exit(0);
  })
  .catch(err => {
    console.error("   ❌ MongoDB connection failed:", err.message);
    console.log("\n💡 Troubleshooting:");
    console.log("   - Is MongoDB running? Try: mongod");
    console.log("   - Check if port 27017 is available");
    console.log("   - Verify MONGO_URL in .env file\n");
    process.exit(1);
  });