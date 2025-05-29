// controllers/user.controller.js
const User = require("../models/User.model");
const Club = require("../models/Club.model");

// Get All Users
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

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
    // Find the existing user
    const existingUser = await User.findById(req.params.id);
    if (!existingUser)
      return res.status(404).json({ error: "User not found." });

    const previousClubSlug = existingUser.favoriteClub;
    const newClubSlug = req.body.favoriteClub;

    // Update the user document
    const updatedUser = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });

    // If the favoriteClub has changed manage fans
    if (newClubSlug && newClubSlug !== previousClubSlug) {
      // Decrease fans from the previous club if exists
      if (previousClubSlug) {
        await Club.findOneAndUpdate(
          { slug: previousClubSlug },
          { $inc: { fans: -1 } }
        );
        console.log(`⬇️ Removed fan from: ${previousClubSlug}`);
      }

      // Increase fans to the new club
      await Club.findOneAndUpdate(
        { slug: newClubSlug },
        { $inc: { fans: 1 } },
        { new: true, upsert: false }
      );
      console.log(`⬆️ Added fan to: ${newClubSlug}`);
    }

    res.json(updatedUser);
  } catch (err) {
    console.error("🔥 updateUser error:", err);
    if (!res.headersSent) {
      res.status(500).json({ error: err.message });
    }
  }
};

// Delete a specific user
exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ error: "User not found." });

    const clubSlug = user.favoriteClub;

    await User.findByIdAndDelete(req.params.id);

    if (clubSlug) {
      await Club.findOneAndUpdate({ slug: clubSlug }, { $inc: { fans: -1 } });
      console.log(`⬇️ Removed fan from club after user deletion: ${clubSlug}`);
    }

    res.json({ message: "User deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
