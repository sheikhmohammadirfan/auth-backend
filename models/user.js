const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  email: { 
    type: String, 
    required: true, 
    unique: true,
    lowercase: true,
    trim: true
  },
  password: { 
    type: String, 
    required: true 
  },
  role: { 
    type: String, 
    enum: ["user", "superadmin"], 
    default: "user" 
  },
  isVerified: { 
    type: Boolean, 
    default: false 
  }
}, {
  timestamps: true  // Adds createdAt and updatedAt fields
});

module.exports = mongoose.model("User", UserSchema);