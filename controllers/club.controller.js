const Club = require("../models/Club.model");
const Country = require("../models/Country.model");

// Create a new club
exports.createClub = async (req, res) => {
  try {
    const club = await Club.create(req.body);
    res.status(201).json(club);
  } catch (err) {
    // Check for duplicate key error
    if (err.code === 11000) {
      return res.status(400).json({
        error: `${req.body.name} Club already exists.`,
      });
    }
    // Other errors
    res.status(400).json({ error: err.message });
  }
};

// Get all clubs (with country/continent filter)
exports.getAllClubs = async (req, res) => {
  try {
    const { search = "", continent, country } = req.query;

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

    const clubs = await Club.find(query).populate(
      "country",
      "name code continent"
    );

    res.json(clubs);
  } catch (err) {
    console.error("ERROR in getAllClubs:", err);
    res.status(500).json({ error: err.message });
  }
};

// گرفتن یک باشگاه خاص
exports.getClubBySlug = async (req, res) => {
  try {
    const club = await Club.findOne({ slug: req.params.slug }).populate(
      "country",
      "name code"
    );
    if (!club) return res.status(404).json({ error: "Club not found" });
    res.json(club);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// حذف یک باشگاه
exports.deleteClub = async (req, res) => {
  try {
    const deleted = await Club.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: "Club not found" });
    res.json({ message: "Club deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ویرایش باشگاه
exports.updateClub = async (req, res) => {
  try {
    const updated = await Club.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!updated) return res.status(404).json({ error: "Club not found" });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
