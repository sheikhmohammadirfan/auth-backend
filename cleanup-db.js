// cleanup-db.js - Run this once to fix the database
const mongoose = require("mongoose");
require("dotenv").config();

async function cleanup() {
  try {
    console.log("🔧 Connecting to MongoDB...");
    await mongoose.connect(process.env.MONGO_URL);
    console.log("✅ Connected!\n");

    const db = mongoose.connection.db;
    const collection = db.collection("users");

    // Get all indexes
    console.log("📋 Current indexes:");
    const indexes = await collection.indexes();
    indexes.forEach(idx => {
      console.log("   -", idx.name, ":", JSON.stringify(idx.key));
    });
    console.log("");

    // Drop the problematic username index if it exists
    try {
      console.log("🗑️  Dropping username_1 index...");
      await collection.dropIndex("username_1");
      console.log("✅ Index dropped successfully!\n");
    } catch (err) {
      if (err.code === 27) {
        console.log("ℹ️  Index doesn't exist (that's okay)\n");
      } else {
        throw err;
      }
    }

    // Optional: Clear all users (if you want a fresh start)
    const userCount = await collection.countDocuments();
    console.log(`📊 Current users in database: ${userCount}`);
    
    const readline = require("readline").createInterface({
      input: process.stdin,
      output: process.stdout
    });

    readline.question("\n⚠️  Delete all users? (yes/no): ", async (answer) => {
      if (answer.toLowerCase() === "yes") {
        const result = await collection.deleteMany({});
        console.log(`✅ Deleted ${result.deletedCount} users`);
      } else {
        console.log("ℹ️  Keeping existing users");
      }
      
      console.log("\n🎉 Database cleanup complete!");
      readline.close();
      process.exit(0);
    });

  } catch (err) {
    console.error("❌ Error:", err.message);
    process.exit(1);
  }
}

cleanup();