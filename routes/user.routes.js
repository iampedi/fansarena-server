const express = require("express");
const router = express.Router();
const { getUserById, updateUser } = require("../controllers/user.controller");
const { authenticate } = require("../middleware/auth");

// // GET: /api/users/:id
router.get("/:id", getUserById);

// PUT: /api/users/:id
router.put("/:id", updateUser);

module.exports = router;
