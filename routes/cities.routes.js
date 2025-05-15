// routes/cities.routes.js
const express = require("express");
const router = express.Router();
const { getAllCities } = require("../controllers/city.controller");

// GET: /api/cities
router.get("/", getAllCities);

module.exports = router;
