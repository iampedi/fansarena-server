// routes/auth.routes.js
const express = require("express");
const router = express.Router();
const { signUp, login } = require("../controllers/auth.controller");

// POST: /auth/signup
router.post("/signup", signUp);

// POST: /auth/login
router.post("/login", login);

module.exports = router;
