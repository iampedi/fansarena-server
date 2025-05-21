// controllers/competition.controller.js
const mongoose = require("mongoose");
const Competition = require("../models/Competition.model");
const Country = require("../models/Country.model");

// Create a competition
exports.createCompetition = async (req, res) => {
  const allowedFields = ["name", "level", "continent", "country"];
  const data = {};
  allowedFields.forEach((f) => {
    if (req.body[f] !== undefined) data[f] = req.body[f];
  });

  try {
    const competition = await Competition.create(data);
    res.status(201).json(competition);
  } catch (err) {
    res.status(400).json({ err: err.message });
  }
};

// Get all competitions (with level/country/continent filter)
exports.getAllCompetitions = async (req, res) => {
  try {
    const { search = "", level, country, continent } = req.query;

    let query = {};

    if (search) {
      query.name = { $regex: search, $options: "i" };
    }

    if (country) {
      query.country = country;
    } else if (continent) {
      // Get all countries in the continent
      const countries = await Country.find({ continent }).select("_id");
      if (!countries.length) {
        return res.json([]);
      }
      const countryIds = countries.map((c) => c._id);
      query.country = { $in: countryIds };
    }

    if (level) {
      query.level = level;
    }

    // Populate country
    const competitions = await Competition.find(query).populate(
      "country",
      "name code continent"
    );

    res.json(competitions);
  } catch (err) {
    res.status(400).json({ err: err.message });
  }
};

// Get a specific competition
exports.getCompetitionBySlug = async (req, res) => {
  try {
    const competition = await Competition.findOne({
      slug: req.params.slug,
    }).populate("country", "name code continent");
    if (!competition)
      return res.status(404).json({ error: "Competition not found" });
    res.json(competition);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Edit a specific competition
exports.updateCompetition = async (req, res) => {
  try {
    const updated = await Competition.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!updated)
      return res.status(404).json({ error: "Competition not found" });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Delete a specific competition
exports.deleteCompetition = async (req, res) => {
  try {
    const deleted = await Competition.findByIdAndDelete(req.params.id);
    if (!deleted)
      return res.status(404).json({ error: "Competition not found" });
    res.json({ message: "Competition deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
