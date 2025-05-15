const Club = require("../models/Club.model");

// ایجاد یک باشگاه جدید
exports.createClub = async (req, res) => {
  try {
    const club = new Club(req.body);
    await club.save();
    res.status(201).json(club);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// گرفتن لیست باشگاه‌ها
exports.getAllClubs = async (req, res) => {
  try {
    const clubs = await Club.find()
      .populate("country", "name") // فقط نام کشور
      .populate("city", "name"); // فقط نام شهر
    res.json(clubs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// گرفتن یک باشگاه خاص
exports.getClubBySlug = async (req, res) => {
  try {
    const club = await Club.findOne({ slug: req.params.slug })
      .populate("country", "name code")
      .populate("city", "name");

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
