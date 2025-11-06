const jwt = require("jsonwebtoken");

module.exports = (roles = []) => (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader) {
      console.log("❌ No authorization header found");
      return res.status(401).json({ message: "No authorization token provided" });
    }

    const token = authHeader.split(" ")[1];
    
    if (!token) {
      console.log("❌ Token not found in authorization header");
      return res.status(401).json({ message: "Invalid authorization format" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("✅ Token verified for user:", decoded.email);

    // Check role if specified
    if (roles.length && !roles.includes(decoded.role)) {
      console.log(`❌ Role ${decoded.role} not authorized. Required: ${roles.join(", ")}`);
      return res.status(403).json({ message: "Insufficient permissions" });
    }

    req.user = decoded;
    next();
  } catch (err) {
    console.error("❌ Auth middleware error:", err.message);
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};