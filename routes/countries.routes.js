const express = require("express");
const router = express.Router();
const { getAllCountries } = require("../controllers/country.controller");

// GET: /api/countries
router.get("/", getAllCountries);

module.exports = router;
