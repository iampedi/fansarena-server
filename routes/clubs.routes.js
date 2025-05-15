const express = require("express");
const router = express.Router();
const clubController = require("../controllers/club.controller");

router.post("/", clubController.createClub);
// GET: /api/clubs
router.get("/", clubController.getAllClubs);
router.get("/:slug", clubController.getClubBySlug);
router.put("/:id", clubController.updateClub);
router.delete("/:id", clubController.deleteClub);

module.exports = router;
