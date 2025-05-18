const City = require("../models/City.model");

exports.getAllCities = async (req, res) => {
  try {
    const { search = "", country, page = 1, limit = 15 } = req.query;

    const query = {};

    if (country) {
      query.country = country;
    }

    if (search) {
      query.name = { $regex: search, $options: "i" };
    }

    const total = await City.countDocuments(query);

    const cities = await City.find(query)
      .populate("country", "name code")
      .sort("name")
      .skip((parseInt(page) - 1) * parseInt(limit))
      .limit(parseInt(limit));

    res.json({
      data: cities,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(total / parseInt(limit)),
      },
    });
  } catch (err) {
    console.error("Error fetching cities:", err);
    res.status(500).json({ error: err.message });
  }
};
