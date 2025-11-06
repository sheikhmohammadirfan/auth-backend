const express = require("express");
const router = express.Router();
const { signup, login, getAllUsers, getCurrentUser } = require("../controllers/authController");
const auth = require("../middleware/auth");

// Public routes
router.post("/signup", signup);
router.post("/login", login);

// Protected routes - any authenticated user
router.get("/me", auth(), getCurrentUser);

// Protected routes - superadmin only
router.get("/users", auth(["superadmin"]), getAllUsers);

module.exports = router;