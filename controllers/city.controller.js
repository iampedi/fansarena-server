const City = require("../models/City.model");

exports.getAllCities = async (req, res) => {
  try {
    const filter = {};
    if (req.query.country) {
      filter.country = req.query.country;
    }

    const cities = await City.find(filter)
      .populate("country", "name code")
      .sort("name");

    res.json(cities);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
