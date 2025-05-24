// controllers/competition.controller.js
const mongoose = require("mongoose");
const Competition = require("../models/Competition.model");
const Country = require("../models/Country.model");
const Club = require("../models/Club.model");
const slugify = require("slugify");

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
    if (err.code === 11000) {
      return res
        .status(400)
        .json({ error: "A competition with this name already exists." });
    }
    res.status(400).json({ error: err.message || "Submission failed" });
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

    const competitions = await Competition.find(query)
      .populate("country", "name continent")
      .populate("winners.club", "slug");

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
    })
      .populate("country", "name continent")
      .populate("winners", "club");
    if (!competition)
      return res.status(404).json({ error: "Competition Not Found." });
    res.json(competition);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Edit a specific competition
exports.updateCompetition = async (req, res) => {
  const allowedFields = ["name", "level", "continent", "country", "winners"];
  const data = {};

  allowedFields.forEach((f) => {
    if (req.body[f] !== undefined) data[f] = req.body[f];
  });

  if (req.body.name) {
    data.slug = slugify(req.body.name, { lower: true, strict: true });
    data.logoUrl = `/images/competitions/${data.slug}.webp`;
  }

  try {
    if (data.name) {
      const duplicate = await Competition.findOne({
        name: data.name,
        slug: { $ne: req.params.slug },
      });
      if (duplicate) {
        return res
          .status(400)
          .json({ error: "Competition name already exists." });
      }
    }
    const updated = await Competition.findOneAndUpdate(
      { slug: req.params.slug },
      {
        ...data,
        ...(req.body.level === "continental" && { country: null }),
        ...(req.body.level === "global" && { continent: null, country: null }),
        ...(req.body.level === "domestic" && { continent: null }),
      },
      {
        new: true,
        runValidators: true,
      }
    );
    if (!updated)
      return res.status(404).json({ error: "Competition Not Found." });
    res.json(updated);

    // Update trophies
    if (updated && updated.winners && updated.winners.length > 0) {
      const clubIds = [
        ...new Set(updated.winners.map((w) => w.club.toString())),
      ];

      await Promise.all(
        clubIds.map(async (clubId) => {
          const allCompetitions = await Competition.find(
            { "winners.club": clubId },
            { winners: 1 }
          );

          let count = 0;
          allCompetitions.forEach((comp) => {
            comp.winners.forEach((winner) => {
              if (winner.club.toString() === clubId) {
                count++;
              }
            });
          });

          await Club.findByIdAndUpdate(clubId, { trophies: count });
        })
      );
    }
  } catch (err) {
    if (err.code === 11000) {
      return res
        .status(400)
        .json({ error: "Competition name already exists." });
    }

    if (err.name === "ValidationError") {
      const messages = Object.values(err.errors)
        .map((e) => e.message)
        .join(" | ");
      return res.status(400).json({ error: messages });
    }

    if (err.name === "CastError") {
      return res.status(400).json({
        error: `Invalid value for field '${err.path}': ${err.value}`,
      });
    }

    if (process.env.NODE_ENV !== "production") {
      return res.status(500).json({ error: err.message });
    }
    return res.status(500).json({ error: "Server error" });
  }
};

// Delete a specific competition
exports.deleteCompetition = async (req, res) => {
  try {
    const deleted = await Competition.findByIdAndDelete(req.params.id);
    if (!deleted)
      return res.status(404).json({ error: "Competition Not Found." });
    res.json({ message: "Competition Deleted Successfully." });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Add a winner
exports.addWinner = async (req, res) => {
  try {
    const competition = await Competition.findById(req.params.competitionId);
    if (!competition)
      return res.status(404).json({ error: "Competition Not Found." });

    const club = await Club.findById(req.body.club);
    if (!club) return res.status(404).json({ error: "Club Not Found." });

    const updated = await Competition.findByIdAndUpdate(
      req.params.competitionId,
      { $addToSet: { winners: req.body } },
      { new: true }
    );

    if (!updated)
      return res.status(404).json({ error: "Competition Not Found." });
    res.json(updated);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: err.message });
  }
};

// Delete a winner
exports.deleteWinner = async (req, res) => {
  try {
    const { competitionId, winnerId } = req.params;

    // 1. لاگ ورودی‌ها
    console.log("competitionId:", competitionId);
    console.log("winnerId:", winnerId);

    // 2. مقدار competition و winnersش رو قبل از حذف ببین
    const competition = await Competition.findById(competitionId);
    if (!competition) {
      return res.status(404).json({ error: "Competition Not Found." });
    }
    console.log("before winners:", competition.winners);

    // 3. حذف winner
    const updated = await Competition.findByIdAndUpdate(
      competitionId,
      { $pull: { winners: { _id: new mongoose.Types.ObjectId(winnerId) } } },
      { new: true }
    );
    if (!updated) {
      return res.status(404).json({ error: "Competition Not Found." });
    }

    // 4. آرایه winners بعد از حذف
    console.log("after winners:", updated.winners);

    res.json(updated);
  } catch (err) {
    console.error("DELETE WINNER ERROR:", err);
    res.status(500).json({ error: err.message });
  }
};
