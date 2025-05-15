const mongoose = require("mongoose");
const Club = require("../models/Club"); // مسیر فایل مدل رو طبق ساختار خودت تنظیم کن
require("dotenv").config();

async function normalizeClubs() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ Connected to MongoDB");

    const clubs = await Club.find();
    console.log(`🔍 Found ${clubs.length} clubs.`);

    for (const club of clubs) {
      let updated = false;

      // مرور بر کل کلیدها
      for (const key in club._doc) {
        const value = club[key];

        if (typeof value === "string" && value !== value.toLowerCase()) {
          club[key] = value.toLowerCase();
          updated = true;
        }
      }

      if (updated) {
        await club.save();
        console.log(`✅ Updated: ${club.name}`);
      }
    }

    console.log("🎉 All clubs normalized.");
    mongoose.disconnect();
  } catch (err) {
    console.error("❌ Error:", err);
    mongoose.disconnect();
  }
}

normalizeClubs();
