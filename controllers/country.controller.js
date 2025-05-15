const Country = require("../models/Country.model");

exports.getAllCountries = async (req, res) => {
  try {
    const countries = await Country.find().sort("name");
    res.json(countries);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
