const express = require("express");
const router = express.Router();
const clubController = require("../controllers/club.controller");

// POST: /api/clubs
router.post("/", clubController.createClub);
// GET: /api/clubs
router.get("/", clubController.getAllClubs);
// GET: /api/clubs/:slug
router.get("/:slug", clubController.getClubBySlug);
// PUT: /api/clubs/:id
router.put("/:id", clubController.updateClub);
// DELETE: /api/clubs/:id
router.delete("/:id", clubController.deleteClub);

module.exports = router;
