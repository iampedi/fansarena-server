// controllers/country.controller.js
const Country = require("../models/Country.model");

exports.getAllCountries = async (req, res) => {
  try {
    const { search = "", page = 1, limit = 15, continent } = req.query;

    const query = {};

    if (search) {
      query.name = { $regex: search, $options: "i" };
    }

    if (continent && continent !== "all") {
      query.continent = continent;
    }

    const total = await Country.countDocuments(query);

    const countries = await Country.find(query)
      .sort("name")
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    res.json({
      data: countries,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(total / parseInt(limit)),
      },
    });
  } catch (err) {
    console.error("Error fetching countries:", err);
    res.status(500).json({ error: err.message });
  }
};
