// controllers/user.controller.js
const User = require("../models/User.model");

// Get a specific user
exports.getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ error: "User not found." });
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Updete a specific user
exports.updateUser = async (req, res) => {
  try {
    const updatedUser = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!updatedUser) return res.status(404).json({ error: "User not found." });
    res.json(updatedUser);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
