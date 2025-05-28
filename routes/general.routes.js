// routes/general.routes.js
const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

// GET: /api/
router.get(["/", ""], (req, res) => {
  console.log("API root route HIT");
  res.json({ message: "All good is here." });
});

// GET /api/health
router.get("/health", async (req, res) => {
  try {
    await mongoose.connection.db.admin().ping();
    res.status(200).json({
      status: "ok",
      timestamp: new Date().toISOString(),
    });
  } catch (err) {
    console.error("MongoDB ping failed:", err);
    res.status(500).json({
      status: "error",
      message: "Failed to connect to MongoDB",
    });
  }
});

module.exports = router;
