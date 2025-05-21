const express = require("express");
const router = express.Router();
const {
  createCompetition,
  getAllCompetitions,
  deleteCompetition,
  updateCompetition,
  getCompetitionBySlug, // می‌تونی getCompetitionById هم بزنی
} = require("../controllers/competition.controller");

// POST: /api/competitions
router.post("/", createCompetition);

// GET: /api/competitions
router.get("/", getAllCompetitions);

// GET: /api/competitions/:slug
router.get("/:slug", getCompetitionBySlug);

// PUT: /api/competitions/:slug
router.put("/:slug", updateCompetition);

// DELETE: /api/competitions/:slug
router.delete("/:slug", deleteCompetition);

module.exports = router;
