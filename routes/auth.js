const express = require("express");
const router = express.Router();
const { signup, login, getAllUsers, getCurrentUser, deleteAllUsers, deleteUser } = require("../controllers/authController");
const auth = require("../middleware/auth");

// Public routes
router.post("/signup", signup);
router.post("/login", login);

// Protected routes - any authenticated user
router.get("/me", auth(), getCurrentUser);

// Protected routes - superadmin only
router.get("/users", auth(["superadmin"]), getAllUsers);
router.delete("/users/all", auth(["superadmin"]), deleteAllUsers);
router.delete("/users/:userId", auth(["superadmin"]), deleteUser);

module.exports = router;