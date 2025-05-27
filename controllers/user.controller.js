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
    // مرحله 1: کاربر قبلی رو پیدا کن تا باشگاه قبلیش رو بدونی
    const existingUser = await User.findById(req.params.id);
    if (!existingUser)
      return res.status(404).json({ error: "User not found." });

    const previousClubSlug = existingUser.favoriteClub;
    const newClubSlug = req.body.favoriteClub;

    // مرحله 2: آپدیت اطلاعات کاربر
    const updatedUser = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });

    // مرحله 3: اگر باشگاه تغییر کرده بود، fans رو مدیریت کن
    if (newClubSlug && newClubSlug !== previousClubSlug) {
      // کاهش fans از باشگاه قبلی (اگه وجود داشت)
      if (previousClubSlug) {
        await Club.findOneAndUpdate(
          { slug: previousClubSlug },
          { $inc: { fans: -1 } }
        );
        console.log(`⬇️ Removed fan from: ${previousClubSlug}`);
      }

      // افزایش fans به باشگاه جدید
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
