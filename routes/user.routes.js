// routes/user.routes.js
const express = require("express");
const router = express.Router();
const {
  getUserById,
  updateUser,
  getAllUsers,
} = require("../controllers/user.controller");
const { authenticate } = require("../middleware/auth");

// GET: /api/users
router.get("/", getAllUsers);

// GET: /api/users/:id
router.get("/:id", getUserById);

// PUT: /api/users/:id
router.put("/:id", updateUser);

module.exports = router;
