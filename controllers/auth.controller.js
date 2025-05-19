// controllers/auth.controllers.js
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User.model");

const saltRounds = 10;

exports.signUp = async (req, res) => {
  try {
    // Extract user data from request body
    const { email, password, name } = req.body;

    // Basic validation: All fields are required
    if (!email || !password || !name) {
      return res
        .status(400)
        .json({ error: "Please fill all required fields." });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: "Invalid email format." });
    }

    // Validate password: at least 6 chars, one uppercase, one number
    const passwordRegex = /^(?=.*[A-Z])(?=.*\d).{6,}$/;
    if (!passwordRegex.test(password)) {
      return res.status(400).json({
        error:
          "Password must be at least 6 characters and include at least one uppercase letter and one number.",
      });
    }

    // Check if the user already exists by email
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res
        .status(400)
        .json({ error: "Email already exists. Please log in instead." });
    }

    // Hash the password using bcrypt
    const salt = await bcrypt.genSalt(saltRounds);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create a new user with default role "user"
    const newUser = await User.create({
      email,
      password: hashedPassword,
      name,
      role: "user",
    });

    // Build response object without password
    res.status(201).json({
      message: "User registered successfully.",
      user: {
        _id: newUser._id,
        email: newUser.email,
        name: newUser.name,
        role: newUser.role,
        createdAt: newUser.createdAt,
      },
    });
  } catch (err) {
    // Log error and return 500 Internal Server Error
    console.error("Signup error:\n", err);
    res.status(500).json({ error: "Internal server error." });
  }
};

exports.login = async (req, res) => {
  try {
    // Extract email and password from request body
    const { email, password } = req.body;

    // Basic validation
    if (!email || !password) {
      return res
        .status(400)
        .json({ error: "Please provide email and password." });
    }

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      // Do NOT reveal if email exists (for security)
      return res.status(401).json({ error: "Invalid email or password." });
    }

    // Compare password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      // Same error as above (do NOT reveal which part failed)
      return res.status(401).json({ error: "Invalid email or password." });
    }

    // Generate JWT Token
    const payload = {
      userId: user._id,
      email: user.email,
      role: user.role,
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN || "7d",
      algorithm: "HS256",
    });

    // Build response without password
    res.status(200).json({
      message: "Login successful.",
      token,
      user: {
        _id: user._id,
        email: user.email,
        name: user.name,
        role: user.role,
        createdAt: user.createdAt,
      },
    });
  } catch (err) {
    console.error("Login error:\n", err);
    res.status(500).json({ error: "Internal server error." });
  }
};

exports.verify = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select("-password");

    if (!user) {
      return res.status(404).json({ error: "User not found." });
    }

    res.status(200).json({ user });
  } catch (err) {
    console.error("Verify error:\n", err);
    res.status(500).json({ error: "Internal server error." });
  }
};
