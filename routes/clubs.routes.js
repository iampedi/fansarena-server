// routes/clubs.routes.js
const express = require("express");
const router = express.Router();
const {
  createClub,
  getAllClubs,
  getClubBySlug,
  updateClub,
  deleteClub,
} = require("../controllers/club.controller");

// POST: /api/clubs
router.post("/", createClub);

// GET: /api/clubs
router.get("/", getAllClubs);

// GET: /api/clubs/:slug
router.get("/:slug", getClubBySlug);

// PUT: /api/clubs/:id
router.put("/:id", updateClub);

// DELETE: /api/clubs/:id
router.delete("/:id", deleteClub);

module.exports = router;
