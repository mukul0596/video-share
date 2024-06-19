const express = require("express");
const router = express.Router();
const { register, login } = require("../controllers/auth");

// @route   POST /api/auth/register
// @desc    Register a new user
// @access  Public
router.post("/register", register);

// @route   POST /api/auth/login
// @desc    Login user and return JWT token
// @access  Public
router.post("/login", login);

module.exports = router;
