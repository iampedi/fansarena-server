// routes/auth.routes.js
const express = require("express");
const router = express.Router();
const { signUp, login, verify } = require("../controllers/auth.controller");
const { authenticate } = require("../middleware/auth");

// POST: /auth/signup
router.post("/signup", signUp);

// POST: /auth/signin
router.post("/signin", login);

// GET: auth/verify
router.get("/verify", authenticate, verify);

module.exports = router;
