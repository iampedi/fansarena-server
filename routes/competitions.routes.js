const express = require("express");
const router = express.Router();
const {
  createCompetition,
  getAllCompetitions,
  deleteCompetition,
  updateCompetition,
  getCompetitionBySlug,
} = require("../controllers/competition.controller");

// POST: /api/competitions
router.post("/", createCompetition);

// GET: /api/competitions
router.get("/", getAllCompetitions);

// GET: /api/competitions/:slug
router.get("/:slug", getCompetitionBySlug);

// PUT: /api/competitions/:id
router.put("/:slug", updateCompetition);

// DELETE: /api/competitions/:id
router.delete("/:id", deleteCompetition);

module.exports = router;
