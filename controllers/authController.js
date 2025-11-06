const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const signup = async (req, res) => {
  try {
    console.log("📝 Signup request received:", { email: req.body.email, role: req.body.role });
    
    const { email, password, role, superAdminKey } = req.body;

    // Validate input
    if (!email || !password) {
      console.log("❌ Missing email or password");
      return res.status(400).json({ message: "Email and password are required" });
    }

    // Validate superadmin key if role is superadmin
    if (role === "superadmin") {
      console.log("🔑 Checking superadmin key...");
      if (superAdminKey !== process.env.SUPERADMIN_KEY) {
        console.log("❌ Invalid superadmin key");
        return res.status(403).json({ message: "Invalid superadmin key" });
      }
      console.log("✅ Superadmin key validated");
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      console.log("❌ User already exists:", email);
      return res.status(400).json({ message: "User already exists" });
    }

    // Hash password
    console.log("🔐 Hashing password...");
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    console.log("👤 Creating new user...");
    const newUser = new User({
      email,
      password: hashedPassword,
      role: role || "user",
      isVerified: role === "superadmin" ? true : false
    });

    await newUser.save();
    console.log("✅ User created successfully:", email);

    res.status(201).json({ 
      message: "User created successfully", 
      user: { 
        email: newUser.email, 
        role: newUser.role 
      } 
    });
  } catch (err) {
    console.error("❌ Signup error:", err);
    res.status(500).json({ 
      message: "Internal server error", 
      error: err.message 
    });
  }
};

const login = async (req, res) => {
  try {
    console.log("🔐 Login request received:", { email: req.body.email });
    
    const { email, password } = req.body;

    if (!email || !password) {
      console.log("❌ Missing email or password");
      return res.status(400).json({ message: "Email and password are required" });
    }
    
    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      console.log("❌ User not found:", email);
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Verify password
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      console.log("❌ Invalid password for:", email);
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Generate JWT token
    console.log("🎟️ Generating token for:", email);
    const token = jwt.sign(
      { 
        id: user._id, 
        role: user.role, 
        email: user.email 
      },
      process.env.JWT_SECRET,
      { expiresIn: "24h" }
    );

    console.log("✅ Login successful for:", email);
    res.status(200).json({
      token,
      role: user.role,
      email: user.email,
      id: user._id
    });
  } catch (err) {
    console.error("❌ Login error:", err);
    res.status(500).json({ 
      message: "Internal server error",
      error: err.message 
    });
  }
};

const getAllUsers = async (req, res) => {
  try {
    console.log("📋 Fetching all users (requested by:", req.user.email + ")");
    const users = await User.find().select("-password");
    console.log("✅ Found", users.length, "users");
    res.status(200).json({ users });
  } catch (err) {
    console.error("❌ Get all users error:", err);
    res.status(500).json({ 
      message: "Internal server error",
      error: err.message 
    });
  }
};

const getCurrentUser = async (req, res) => {
  try {
    console.log("👤 Fetching current user:", req.user.email);
    const user = await User.findById(req.user.id).select("-password");
    if (!user) {
      console.log("❌ User not found:", req.user.id);
      return res.status(404).json({ message: "User not found" });
    }
    console.log("✅ User found:", user.email);
    res.status(200).json({ user });
  } catch (err) {
    console.error("❌ Get current user error:", err);
    res.status(500).json({ 
      message: "Internal server error",
      error: err.message 
    });
  }
};

module.exports = { signup, login, getAllUsers, getCurrentUser };